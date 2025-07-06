use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    /// 数据库连接
    pub database_url: String,
    /// 数据库最大连接数
    pub database_max_conns: u32,
    /// 推送密钥
    pub sms_device_key: String,
    /// 推送API
    pub sms_api: String,
    /// 监听地址
    pub addr: String,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        let database_url = std::env::var("DATABASE_URL")?;
        let database_max_conns = std::env::var("DATABASE_MAX_CONNS")?.parse()?;
        let sms_device_key = std::env::var("SMS_DEVICE_KEY")?;
        let sms_api = std::env::var("SMS_API")?;
        let addr = std::env::var("ADDR")?;
        Ok(Self {
            database_url,
            database_max_conns,
            sms_device_key,
            sms_api,
            addr,
        })
    }
}
