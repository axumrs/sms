use serde::{Deserialize, Serialize, de::DeserializeOwned};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Message {
    pub id: String,
    pub email: String,
    pub subject: String,
    pub message: String,
    pub dateline: chrono::DateTime<chrono::Local>,
    pub group: String,
    pub is_reply: bool,
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
            is_reply: false,
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
            is_reply: self.is_reply,
        }
    }
    fn _mark(input: String, len: usize) -> String {
        if input.chars().collect::<Vec<_>>().len() > len {
            return format!("{}***", utf8_slice::till(&input, len));
        }
        input
    }
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct MessageListFilter {
    pub email: Option<String>,
    pub subject: Option<String>,
    pub message: Option<String>,
    pub group: Option<String>,
    pub is_reply: Option<bool>,
    pub order: Option<String>,
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

pub const DEFAULT_PAGE_SIZE: u8 = 30;

#[derive(Debug, Serialize, Deserialize)]
pub struct Pagination<T> {
    pub total: i64,
    pub page_total: u32,
    pub page: u32,
    pub page_size: u8,
    pub data: Vec<T>,
}
impl<T> Pagination<T>
where
    T: Serialize + DeserializeOwned,
{
    pub fn new_with_page_size(total: i64, page: u32, page_size: u8, data: Vec<T>) -> Self {
        let page_total = (total as f64 / page_size as f64).ceil() as u32;
        Self {
            total,
            page_total,
            page,
            page_size,
            data,
        }
    }
    pub fn new(total: i64, page: u32, data: Vec<T>) -> Self {
        Self::new_with_page_size(total, page, DEFAULT_PAGE_SIZE, data)
    }

    pub fn with_count(count: (i64,), page: u32, data: Vec<T>) -> Self {
        Self::new(count.0, page, data)
    }

    pub fn limit(&self) -> i64 {
        self.page_size as i64
    }

    pub fn offset(&self) -> i64 {
        self.page as i64 * self.limit()
    }
}
