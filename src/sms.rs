use std::time::Duration;

use serde::{Deserialize, Serialize};

use crate::Result;

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    pub body: String,
    pub title: String,
    pub group: String,
    pub url: String,
    pub icon: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiRequest {
    pub device_key: String,
    #[serde(flatten)]
    pub message: Message,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse {
    pub code: i32,
    pub message: String,
    pub timestamp: u32,
}

impl ApiResponse {
    pub fn is_success(&self) -> bool {
        self.code == 200 && self.message == "success"
    }
}

pub async fn send_message(
    message: Message,
    device_key: &str,
    api_url: &str,
    timeout: u64,
) -> Result<ApiResponse> {
    let req = ApiRequest {
        device_key: device_key.into(),
        message,
    };
    let api_url = format!("{}/push", api_url);
    let cli = reqwest::ClientBuilder::new()
        .timeout(Duration::from_secs(timeout))
        .build()?;
    let resp = cli
        .post(&api_url)
        .json(&req)
        .send()
        .await?
        .json::<ApiResponse>()
        .await?;
    Ok(resp)
}

#[cfg(test)]
mod tests {
    use crate::Config;

    use super::*;

    #[tokio::test]
    async fn test_send_message() {
        dotenv::dotenv().ok();
        let cfg = Config::from_env().unwrap();
        let resp = send_message(
            Message {
                body: "欢迎来到AXUM中文网".into(),
                title: "AXUM中文网".into(),
                group: "AXUM".into(),
                url: "https://axum.eu.org".into(),
                icon: "https://file.axum.eu.org/asset/logo.png".into(),
            },
            &cfg.sms_device_key,
            &cfg.sms_api,
            cfg.sms_api_timeout as u64,
        )
        .await
        .unwrap();
        println!("{:?}", resp);
        assert!(resp.is_success());
    }
}
