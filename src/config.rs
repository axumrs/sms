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
    /// 推送API超时
    pub sms_api_timeout: u8,
    pub turnstile_secret_key: String,
    pub turnstile_site_key: String,
    pub turnstile_timeout: u8,
    pub sms_icon: String,
    pub sms_action_url_prefix: String,
    pub jwt_secret: String,
    pub jwt_exp: usize,
    pub admin_password: String,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        let database_url = std::env::var("DATABASE_URL")?;
        let database_max_conns = std::env::var("DATABASE_MAX_CONNS")?.parse()?;
        let sms_device_key = std::env::var("SMS_DEVICE_KEY")?;
        let sms_api = std::env::var("SMS_API")?;
        let addr = std::env::var("ADDR")?;
        let sms_api_timeout = std::env::var("SMS_API_TIMEOUT")?.parse()?;
        let turnstile_secret_key = std::env::var("TURNSTILE_SECRET_KEY")?;
        let turnstile_site_key = std::env::var("TURNSTILE_SITE_KEY")?;
        let turnstile_timeout = std::env::var("TURNSTILE_TIMEOUT")?.parse()?;
        let sms_icon = std::env::var("SMS_ICON")?;
        let sms_action_url_prefix = std::env::var("SMS_ACTION_URL_PREFIX")?;
        let jwt_secret = std::env::var("JWT_SECRET")?;
        let jwt_exp = std::env::var("JWT_EXP")?.parse()?;
        let admin_password = std::env::var("ADMIN_PASSWORD")?;

        Ok(Self {
            database_url,
            database_max_conns,
            sms_device_key,
            sms_api,
            addr,
            sms_api_timeout,
            turnstile_secret_key,
            turnstile_site_key,
            turnstile_timeout,
            sms_icon,
            sms_action_url_prefix,
            jwt_secret,
            jwt_exp,
            admin_password,
        })
    }
}
