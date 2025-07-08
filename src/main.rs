use std::sync::Arc;

use sms::{AppState, Config, router};
use tokio::net::TcpListener;
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

    let app = router::init(state);

    tracing::info!("服务监听于 {:?}", listener.local_addr()?);

    axum::serve(listener, app).await?;

    Ok(())
}
