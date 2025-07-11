use axum::{
    Router, middleware,
    routing::{delete, get, post},
};

use crate::{ArcAppState, admin_handler, asset, auth_handler, handler, mid};

pub fn init(state: ArcAppState) -> Router {
    Router::new()
        .nest("/api", init_frontend(state.clone()))
        .nest("/api/admin", init_backend(state.clone()))
        .nest("/api/auth", init_auth(state.clone()))
        .fallback(asset::static_handler)
}

fn init_frontend(state: ArcAppState) -> Router {
    Router::new()
        .route("/send", post(handler::send))
        .route("/message/{id}", get(handler::detail))
        .route("/message/{id}/reply", get(handler::message_replies))
        .with_state(state)
}

fn init_backend(state: ArcAppState) -> Router {
    Router::new()
        .route("/message", get(admin_handler::message_list))
        .route(
            "/message/{id}",
            get(admin_handler::message_detail).delete(admin_handler::del_message),
        )
        .route(
            "/message/{id}/reply",
            get(admin_handler::message_replies)
                .post(admin_handler::reply_message)
                .delete(admin_handler::batch_del_message_replies),
        )
        .route(
            "/reply/{id}/{message_id}",
            delete(admin_handler::del_message_reply),
        )
        .layer(middleware::from_extractor_with_state::<
            mid::AdminAuth,
            ArcAppState,
        >(state.clone()))
        .with_state(state)
}

fn init_auth(state: ArcAppState) -> Router {
    Router::new()
        .route("/admin-login", post(auth_handler::admin_login))
        .with_state(state)
}
