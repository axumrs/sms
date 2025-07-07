use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct SendMessage {
    #[validate(length(min = 1, max = 20, message = "请输入正确的昵称"))]
    pub nickname: String,

    #[validate(email(message = "请输入正确的邮箱"))]
    #[validate(length(min = 1, max = 255, message = "请输入正确的邮箱"))]
    pub email: String,

    #[validate(length(min = 1, max = 50, message = "请输入主题"))]
    pub subject: String,

    #[validate(length(min = 1, max = 255, message = "请输入内容"))]
    pub message: String,

    #[validate(length(min = 6, message = "请完成人机验证"))]
    pub captcha: String,

    #[validate(length(min = 1, max = 20, message = "请选择分组"))]
    pub group: String,
}
