use std::sync::Arc;

use crate::Config;

pub struct AppState {
    pub cfg: Arc<Config>,
    pub pool: sqlx::PgPool,
}

pub type ArcAppState = Arc<AppState>;
