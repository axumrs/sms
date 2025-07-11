use axum::http::{
    HeaderMap,
    header::{AUTHORIZATION, AsHeaderName},
};

pub fn get_header_opt(headers: &HeaderMap, key: impl AsHeaderName) -> Option<&str> {
    headers.get(key).and_then(|v| v.to_str().ok())
}
pub fn get_auth(headers: &HeaderMap) -> Option<&str> {
    get_header_opt(headers, AUTHORIZATION)
}

pub fn get_auth_token(headers: &HeaderMap) -> Option<&str> {
    let v = get_auth(headers);

    if let Some(v) = v {
        if let Some(v) = v.strip_prefix("Bearer ") {
            return Some(v);
        }
    }

    None
}
