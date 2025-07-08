use sqlx::PgExecutor;

use crate::model;

pub async fn create_message<'a>(
    e: impl PgExecutor<'a>,
    m: &'a model::Message,
) -> sqlx::Result<&'a str> {
    sqlx::query(r#"INSERT INTO "messages"("id", "email", "subject", "message", "dateline","group") VALUES ($1, $2, $3, $4, $5, $6)"#)
        .bind(&m.id)
        .bind(&m.email)
        .bind(&m.subject)
        .bind(&m.message)
        .bind(&m.dateline)
        .bind(&m.group)
        .execute(e).await?;
    Ok(&m.id)
}

pub async fn get_message(e: impl PgExecutor<'_>, id: &str) -> sqlx::Result<Option<model::Message>> {
    sqlx::query_as(r#"SELECT "id", "email", "subject", "message", "dateline", "group" FROM "messages" WHERE "id" = $1"#)
        .bind(id)
        .fetch_optional(e).await
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
