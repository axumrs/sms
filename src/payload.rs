use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct SendMessage {
    #[validate(email(message = "请输入正确的邮箱"))]
    #[validate(length(min = 6, max = 255, message = "请输入正确的邮箱"))]
    pub email: String,

    #[validate(length(min = 3, max = 50, message = "请输入主题"))]
    pub subject: String,

    #[validate(length(min = 3, max = 255, message = "请输入内容"))]
    pub message: String,

    #[validate(length(min = 6, message = "请完成人机验证"))]
    pub captcha: String,

    #[validate(length(min = 1, max = 20, message = "请选择分组"))]
    pub group: String,
}

#[derive(Deserialize)]
pub struct AdminListMessage {
    pub email: Option<String>,
    pub subject: Option<String>,
    pub message: Option<String>,
    pub group: Option<String>,
    pub is_reply: Option<u8>,

    pub page: Option<u32>,
    pub page_size: Option<u8>,
}
impl AdminListMessage {
    pub fn is_reply(&self) -> Option<bool> {
        match self.is_reply {
            Some(1) => Some(true),
            Some(0) => Some(false),
            _ => None,
        }
    }

    pub fn page(&self) -> u32 {
        match self.page {
            Some(v) => v,
            None => 0,
        }
    }
}

#[derive(Deserialize, Validate)]
pub struct CreateMessageReply {
    #[validate(length(min = 3, max = 255, message = "请输入回复内容"))]
    pub content: String,
}

#[derive(Deserialize, Validate)]
pub struct AdminLogin {
    #[validate(length(min = 6, message = "请输入密码"))]
    pub password: String,

    #[validate(length(min = 6, message = "请完成人机验证"))]
    pub captcha: String,
}
