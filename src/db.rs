use sqlx::PgExecutor;

use crate::model;

pub async fn create_message<'a>(
    e: impl PgExecutor<'a>,
    m: &'a model::Message,
) -> sqlx::Result<&'a str> {
    sqlx::query(r#"INSERT INTO "messages"("id", "email", "subject", "message", "dateline", "group", "is_reply") VALUES ($1, $2, $3, $4, $5, $6, $7)"#)
        .bind(&m.id)
        .bind(&m.email)
        .bind(&m.subject)
        .bind(&m.message)
        .bind(&m.dateline)
        .bind(&m.group)
        .bind(m.is_reply)
        .execute(e).await?;
    Ok(&m.id)
}

pub async fn get_message(e: impl PgExecutor<'_>, id: &str) -> sqlx::Result<Option<model::Message>> {
    sqlx::query_as(r#"SELECT "id", "email", "subject", "message", "dateline", "group", "is_reply" FROM "messages" WHERE "id" = $1"#)
        .bind(id)
        .fetch_optional(e).await
}

pub async fn list_messages_data(
    e: impl PgExecutor<'_>,
    f: &model::MessageListFilter,
    page: i64,
    page_size: i64,
) -> sqlx::Result<Vec<model::Message>> {
    let mut q = sqlx::QueryBuilder::new(
        r#"SELECT "id", "email", "subject", "message", "dateline", "group", "is_reply" FROM "messages" WHERE 1=1"#,
    );

    build_list_messages_query(&mut q, &f);

    let order = match &f.order {
        Some(v) => v,
        None => "id DESC",
    };
    q.push(r#" ORDER BY "#)
        .push_bind(order)
        .push(r#" LIMIT "#)
        .push_bind(page_size)
        .push(r#" OFFSET "#)
        .push_bind(page * page_size);

    q.build_query_as().fetch_all(e).await
}

pub async fn list_messages_count(
    e: impl PgExecutor<'_>,
    f: &model::MessageListFilter,
) -> sqlx::Result<(i64,)> {
    let mut q = sqlx::QueryBuilder::new(r#"SELECT COUNT(*) FROM "messages" WHERE 1=1"#);
    build_list_messages_query(&mut q, &f);
    q.build_query_as().fetch_one(e).await
}

fn build_list_messages_query<'a>(
    q: &mut sqlx::QueryBuilder<'a, sqlx::Postgres>,
    f: &model::MessageListFilter,
) {
    if let Some(email) = &f.email {
        let param = format!("%{}%", email);
        q.push(r#" AND "email" ILIKE "#).push_bind(param);
    }
    if let Some(subject) = &f.subject {
        let param = format!("%{}%", subject);
        q.push(r#" AND "subject" ILIKE "#).push_bind(param);
    }
    if let Some(message) = &f.message {
        let param = format!("%{}%", message);
        q.push(r#" AND "message" ILIKE "#).push_bind(param);
    }
    if let Some(group) = &f.group {
        q.push(r#" AND "group" = "#).push_bind(group.clone());
    }
    if let Some(is_reply) = f.is_reply {
        q.push(r#" AND "is_reply" = "#).push_bind(is_reply);
    }
}

pub async fn del_message(e: impl PgExecutor<'_>, id: &str) -> sqlx::Result<u64> {
    let aff = sqlx::query(r#"DELETE FROM "messages" WHERE "id" = $1"#)
        .bind(id)
        .execute(e)
        .await?
        .rows_affected();
    Ok(aff)
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

pub async fn count_message_replies(e: impl PgExecutor<'_>, message_id: &str) -> sqlx::Result<i64> {
    let c: (i64,) =
        sqlx::query_as(r#"SELECT COUNT(*) FROM "message_replies" WHERE "message_id" = $1"#)
            .bind(message_id)
            .fetch_one(e)
            .await?;
    Ok(c.0)
}

pub async fn update_message_is_replied(
    e: impl PgExecutor<'_>,
    id: &str,
    is_reply: bool,
) -> sqlx::Result<u64> {
    let aff = sqlx::query(r#"UPDATE "messages" SET "is_reply" = $1 WHERE "id" = $2"#)
        .bind(is_reply)
        .bind(id)
        .execute(e)
        .await?
        .rows_affected();
    Ok(aff)
}

pub async fn del_message_reply(e: impl PgExecutor<'_>, id: &str) -> sqlx::Result<u64> {
    let aff = sqlx::query(r#"DELETE FROM "message_replies" WHERE "id" = $1"#)
        .bind(id)
        .execute(e)
        .await?
        .rows_affected();
    Ok(aff)
}

pub async fn batch_del_message_replies(
    e: impl PgExecutor<'_>,
    message_id: &str,
) -> sqlx::Result<u64> {
    let aff = sqlx::query(r#"DELETE FROM "message_replies" WHERE "message_id" = $1"#)
        .bind(message_id)
        .execute(e)
        .await?
        .rows_affected();
    Ok(aff)
}

pub async fn get_message_replies(
    e: impl PgExecutor<'_>,
    message_id: &str,
) -> sqlx::Result<Vec<model::MessageReply>> {
    sqlx::query_as(r#"SELECT "id", "message_id", "content", "dateline" FROM "message_replies" WHERE "message_id" = $1"#)
        .bind(message_id)
        .fetch_all(e).await
}
