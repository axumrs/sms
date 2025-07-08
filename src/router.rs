use axum::{
    Router,
    routing::{get, post},
};

use crate::{ArcAppState, asset, handler};

pub fn init(state: ArcAppState) -> Router {
    Router::new()
        .route("/api/send", post(handler::send))
        .route("/api/message/{id}", get(handler::detail))
        .fallback(asset::static_handler)
        .with_state(state)
}
