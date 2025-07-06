use sms::Config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    let cfg = Config::from_env()?;
    println!("Hello, world! {cfg:?}");

    Ok(())
}
