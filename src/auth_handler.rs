use axum::{Json, extract::State};
use validator::Validate;

use crate::{ArcAppState, Error, Result, jwt, mid, payload, resp, turnstile};

pub async fn admin_login(
    State(state): State<ArcAppState>,
    Json(frm): Json<payload::AdminLogin>,
) -> Result<resp::JsonResp<mid::AdminAuth>> {
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

    if frm.password != state.cfg.admin_password {
        return Err(Error::from_str("密码错误"));
    }

    let keys = jwt::key(&state.cfg.jwt_secret);
    let claims = jwt::Claims::new(state.cfg.jwt_exp);
    let token = jwt::token(&claims, &keys.encoding);

    Ok(resp::suc(mid::AdminAuth {
        token,
        exp: claims.exp,
    })
    .to_json())
}
