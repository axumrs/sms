pub mod admin_handler;
pub mod asset;
pub mod auth_handler;
mod config;
pub mod db;
pub mod email;
mod err;
pub mod handler;
pub mod jwt;
pub mod mid;
pub mod model;
pub mod payload;
mod resp;
pub mod router;
pub mod sms;
mod state;
pub mod turnstile;
pub mod utils;

pub use config::Config;
pub use err::Error;
pub use resp::*;
pub use state::{AppState, ArcAppState};

pub type Result<T> = std::result::Result<T, crate::Error>;
