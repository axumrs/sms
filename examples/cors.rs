use std::sync::Arc;

use axum::{Router, routing::post};
use sms::{AppState, Config, asset, handler};
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| format!("{}=debug", env!("CARGO_CRATE_NAME")).into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let cfg = Config::from_env()?;

    let listener = TcpListener::bind(&cfg.addr).await?;

    let pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(cfg.database_max_conns)
        .connect(&cfg.database_url)
        .await?;

    let state = Arc::new(AppState {
        cfg: Arc::new(cfg),
        pool,
    });

    let app = Router::new()
        .route("/api/send", post(handler::send))
        .fallback(asset::static_handler)
        .with_state(state)
        .layer(
            CorsLayer::new()
                .allow_headers(Any)
                .allow_methods(Any)
                .allow_origin(Any),
        );

    tracing::info!("服务监听于 {:?}", listener.local_addr()?);

    axum::serve(listener, app).await?;

    Ok(())
}
