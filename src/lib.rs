mod config;
mod err;
pub mod sms;

pub use config::*;
pub use err::Error;

pub type Result<T> = std::result::Result<T, crate::Error>;
