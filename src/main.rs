use axum::Router;
use sms::{Config, asset};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    let cfg = Config::from_env()?;

    let listener = TcpListener::bind(&cfg.addr).await?;
    let app = Router::new().fallback(asset::static_handler);

    axum::serve(listener, app).await?;

    Ok(())
}
