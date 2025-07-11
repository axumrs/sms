use axum::extract::FromRequestParts;
use serde::{Deserialize, Serialize};

use crate::{ArcAppState, jwt, utils};

#[derive(Serialize, Deserialize)]
pub struct AdminAuth {
    pub token: String,
    pub exp: usize,
}

impl FromRequestParts<ArcAppState> for AdminAuth {
    type Rejection = crate::Error;

    async fn from_request_parts(
        parts: &mut axum::http::request::Parts,
        state: &ArcAppState,
    ) -> Result<Self, Self::Rejection> {
        let token = match utils::get_auth_token(&parts.headers) {
            Some(v) => v.to_string(),
            None => return Err(crate::Error::from_str("JWT:未授权")),
        };

        let keys = jwt::key(&state.cfg.jwt_secret);
        let claims = match jwt::validate(&token, &keys.decoding) {
            Ok(v) => v,
            Err(e) => {
                tracing::debug!("failed to validate jwt token: {}", e);
                return Err(crate::Error::from_str("JWT:无效的令牌"));
            }
        };

        Ok(Self {
            token,
            exp: claims.exp,
        })
    }
}
