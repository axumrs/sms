use crate::{Error, Result, db, model, payload, resp, sms, turnstile};
use axum::Json;
use axum::extract::{Path, State};
use validator::Validate;

use crate::ArcAppState;

pub async fn send(
    State(state): State<ArcAppState>,
    Json(frm): Json<payload::SendMessage>,
) -> Result<resp::JsonResp<resp::IDResp>> {
    frm.validate()?;

    if !turnstile::verify(
        &state.cfg.turnstile_secret_key,
        state.cfg.turnstile_timeout,
        &frm.captcha,
    )
    .await?
    {
        return Err(Error::from_str("请完成人机验证"));
    }

    let body = format!(r#"{} -- by {}"#, frm.message, frm.email,);
    let title = frm.subject.clone();
    let group = frm.group.clone();
    let m = model::Message::new(frm.email, frm.subject, frm.message, frm.group);
    let action_url = format!("{}{}", &state.cfg.sms_action_url_prefix, &m.id);
    let sms_res = sms::send_message(
        sms::Message {
            body,
            title,
            group,
            url: action_url,
            icon: state.cfg.sms_icon.clone(),
        },
        &state.cfg.sms_device_key,
        &state.cfg.sms_api,
        state.cfg.sms_api_timeout as u64,
    )
    .await?;
    if !sms_res.is_success() {
        return Err(Error::from_str("短信发送失败"));
    }

    db::create_message(&state.pool, &m).await?;
    Ok(resp::suc(resp::IDResp { id: m.id }).to_json())
}

pub async fn detail(
    State(state): State<ArcAppState>,
    Path(id): Path<String>,
) -> Result<resp::JsonResp<model::Message>> {
    let m = match db::get_message(&state.pool, &id).await? {
        Some(v) => v.mark_info(),
        None => return Err(Error::from_str("不存在的消息")),
    };
    Ok(resp::suc(m).to_json())
}
