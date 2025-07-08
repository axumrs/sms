use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Message {
    pub id: String,
    pub email: String,
    pub subject: String,
    pub message: String,
    pub dateline: chrono::DateTime<chrono::Local>,
    pub group: String,
}

impl Message {
    pub fn new(
        email: impl Into<String>,
        subject: impl Into<String>,
        message: impl Into<String>,
        group: impl Into<String>,
    ) -> Self {
        Self {
            id: xid::new().to_string(),
            email: email.into(),
            subject: subject.into(),
            message: message.into(),
            dateline: chrono::Local::now(),
            group: group.into(),
        }
    }

    pub fn mark_info(self) -> Self {
        let email = Self::_mark(self.email, 5);
        Self {
            id: self.id,
            email,
            subject: self.subject,
            message: self.message,
            dateline: self.dateline,
            group: self.group,
        }
    }
    fn _mark(input: String, len: usize) -> String {
        if input.chars().collect::<Vec<_>>().len() > len {
            return format!("{}***", utf8_slice::till(&input, len));
        }
        input
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MessageReply {
    pub id: String,
    pub message_id: String,
    pub content: String,
    pub dateline: chrono::DateTime<chrono::Local>,
}

impl MessageReply {
    pub fn new(message_id: impl Into<String>, content: impl Into<String>) -> Self {
        Self {
            id: xid::new().to_string(),
            message_id: message_id.into(),
            content: content.into(),
            dateline: chrono::Local::now(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MessageWithReplies {
    #[serde(flatten)]
    #[sqlx(flatten)]
    pub message: Message,
    pub reply_id: Option<String>,
    pub reply_content: Option<String>,
    pub reply_dateline: Option<chrono::DateTime<chrono::Local>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MessageWithRepliesCount {
    #[serde(flatten)]
    #[sqlx(flatten)]
    pub message: Message,
    pub reply_count: i64,
}
