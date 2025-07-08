use axum::Json;
use serde::Serialize;

use crate::Error;

#[derive(Serialize)]
pub struct Resp<T> {
    pub code: i32,
    pub msg: String,
    pub data: Option<T>,
}

impl<T> Resp<T>
where
    T: Serialize,
{
    pub fn new(code: i32, msg: impl Into<String>, data: Option<T>) -> Self {
        Self {
            code,
            msg: msg.into(),
            data,
        }
    }

    pub fn success(data: T) -> Self {
        Self::new(0, "OK", Some(data))
    }
    pub fn success_empty() -> Self {
        Self::new(0, "OK", None)
    }

    pub fn error(e: Error) -> Self {
        Self::new(e.code(), e.msg(), None)
    }

    pub fn to_json(self) -> Json<Self> {
        Json(self)
    }
}

pub type JsonResp<T> = Json<Resp<T>>;

#[derive(Serialize)]
pub struct IDResp {
    pub id: String,
}

#[derive(Serialize)]
pub struct AffResp {
    pub rows: u64,
}

#[derive(Serialize)]
pub struct MessageDetailView {
    pub url: String,
}

pub fn suc<T: Serialize>(data: T) -> Resp<T> {
    Resp::success(data)
}

pub fn err(e: Error) -> Resp<()> {
    Resp::error(e)
}

pub fn empty() -> Resp<()> {
    Resp::success_empty()
}
