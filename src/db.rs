use sqlx::PgExecutor;

use crate::model;

pub async fn create_message<'a>(
    e: impl PgExecutor<'a>,
    m: &'a model::Message,
) -> sqlx::Result<&'a str> {
    sqlx::query(r#"INSERT INTO "messages"("id", "nickname", "email", "subject", "message", "dateline") VALUES ($1, $2, $3, $4, $5, $6)"#)
        .bind(&m.id)
        .bind(&m.nickname)
        .bind(&m.email)
        .bind(&m.subject)
        .bind(&m.message)
        .bind(&m.dateline)
        .execute(e).await?;
    Ok(&m.id)
}

pub async fn create_message_reply<'a>(
    e: impl PgExecutor<'a>,
    m: &'a model::MessageReply,
) -> sqlx::Result<&'a str> {
    sqlx::query(r#"INSERT INTO "message_replies"("id", "message_id", "content", "dateline") VALUES ($1, $2, $3, $4)"#)
        .bind(&m.id)
        .bind(&m.message_id)
        .bind(&m.content)
        .bind(&m.dateline)
        .execute(e).await?;
    Ok(&m.id)
}
