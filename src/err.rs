use axum::response::IntoResponse;

#[derive(Debug)]
pub struct Error(anyhow::Error);

impl Error {
    pub fn code(&self) -> i32 {
        -1
    }

    pub fn msg(&self) -> String {
        self.0.to_string()
    }

    pub fn from_str(s: impl Into<String>) -> Self {
        Self(anyhow::anyhow!(s.into()))
    }
}

impl<E> From<E> for Error
where
    E: Into<anyhow::Error>,
{
    fn from(value: E) -> Self {
        Self(value.into())
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            self.0.to_string(),
        )
            .into_response()
    }
}
