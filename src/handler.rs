use crate::{Error, Result, db, model, payload, resp, sms};
use axum::Json;
use axum::extract::State;
use validator::Validate;

use crate::ArcAppState;

pub async fn send(
    State(state): State<ArcAppState>,
    Json(frm): Json<payload::SendMessage>,
) -> Result<resp::JsonResp<resp::MessageDetailView>> {
    frm.validate()?;
    // TODO: 人机验证

    let body = format!(r#"{} -- by {}({})"#, frm.message, frm.nickname, frm.email,);
    let title = frm.subject.clone();
    let m = model::Message::new(frm.nickname, frm.email, frm.subject, frm.message);
    let action_url = format!("{}{}", &state.cfg.sms_action_url_prefix, &m.id);
    let view_url = format!("{}{}", &state.cfg.sms_view_url_prefix, &m.id);
    let sms_res = sms::send_message(
        sms::Message {
            body,
            title,
            group: frm.group,
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
    Ok(resp::suc(resp::MessageDetailView { url: view_url }).to_json())
}
