use lettre::{
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
    message::header::ContentType,
    transport::smtp::{authentication::Credentials, response::Response},
};

use crate::{Error, Result};

pub struct Data {
    pub subject: String, // 邮件主题
    pub body: String,    // 邮件内容
    pub to: String,      // 收件人
}

impl Data {
    pub fn to_message(self, mail_user: &str) -> Result<Message> {
        let user = mail_user.parse().map_err(Error::from)?;
        let to = self.to.parse().map_err(Error::from)?;
        Message::builder()
            .from(user)
            .to(to)
            .subject(self.subject.as_str())
            .header(ContentType::TEXT_PLAIN)
            .body(self.body)
            .map_err(Error::from)
    }
}

pub async fn send(
    mail_smtp: String,
    mail_user: String,
    mail_password: String,
    m: Data,
) -> Result<Response> {
    let message = m.to_message(&mail_user)?;
    let creds = Credentials::new(mail_user, mail_password);
    let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay(&mail_smtp)
        .map_err(Error::from)?
        .credentials(creds)
        .build();
    mailer.send(message).await.map_err(Error::from)
}
