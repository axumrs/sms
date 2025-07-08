use axum::{
    Json,
    extract::{Path, Query, State},
};
use validator::Validate;

use crate::{ArcAppState, Error, Result, db, model, payload, resp};

pub async fn message_list(
    State(state): State<ArcAppState>,
    Query(frm): Query<payload::AdminListMessage>,
) -> Result<resp::JsonResp<model::Pagination<model::Message>>> {
    let f = model::MessageListFilter {
        is_reply: frm.is_reply(),
        email: frm.email,
        subject: frm.subject,
        message: frm.message,
        group: frm.group,
        order: None,
    };
    let page = frm.page.unwrap_or(0);
    let page_size = frm.page_size.unwrap_or(model::DEFAULT_PAGE_SIZE);

    let mut tx = state.pool.begin().await?;
    let count = db::list_messages_count(&mut *tx, &f).await?;
    let data = db::list_messages_data(&mut *tx, &f, page as i64, page_size as i64).await?;
    tx.commit().await?;

    Ok(resp::suc(model::Pagination::with_count(count, page, data)).to_json())
}

pub async fn message_detail(
    State(state): State<ArcAppState>,
    Path(id): Path<String>,
) -> Result<resp::JsonResp<model::Message>> {
    let m = match db::get_message(&state.pool, &id).await? {
        Some(v) => v,
        None => return Err(Error::from_str("不存在的消息")),
    };
    Ok(resp::suc(m).to_json())
}

pub async fn del_message(
    State(state): State<ArcAppState>,
    Path(id): Path<String>,
) -> Result<resp::JsonResp<(resp::AffResp, resp::AffResp)>> {
    let mut tx = state.pool.begin().await?;

    let rows = db::del_message(&mut *tx, &id).await?;
    let reply_rows = db::batch_del_message_replies(&mut *tx, &id).await?;

    tx.commit().await?;
    Ok(resp::suc((resp::AffResp { rows }, resp::AffResp { rows: reply_rows })).to_json())
}

pub async fn reply_message(
    State(state): State<ArcAppState>,
    Path(id): Path<String>,
    Json(frm): Json<payload::CreateMessageReply>,
) -> Result<resp::JsonResp<resp::IDResp>> {
    frm.validate()?;

    let mut tx = state.pool.begin().await?;

    let msg_id = id.clone();
    let m = model::MessageReply::new(id, frm.content);
    if let Err(e) = db::create_message_reply(&mut *tx, &m).await {
        tx.rollback().await?;
        return Err(e.into());
    }

    if let Err(e) = db::update_message_is_replied(&mut *tx, &msg_id, true).await {
        tx.rollback().await?;
        return Err(e.into());
    }

    tx.commit().await?;

    Ok(resp::suc(resp::IDResp { id: m.id }).to_json())
}

pub async fn message_replies(
    State(state): State<ArcAppState>,
    Path(id): Path<String>,
) -> Result<resp::JsonResp<Vec<model::MessageReply>>> {
    let replies = db::get_message_replies(&state.pool, &id).await?;
    Ok(resp::suc(replies).to_json())
}

pub async fn del_message_reply(
    State(state): State<ArcAppState>,
    Path((id, message_id)): Path<(String, String)>,
) -> Result<resp::JsonResp<resp::AffResp>> {
    let mut tx = state.pool.begin().await?;
    let rows = match db::del_message_reply(&state.pool, &id).await {
        Ok(v) => v,
        Err(e) => {
            tx.rollback().await?;
            return Err(e.into());
        }
    };
    let count = match db::count_message_replies(&mut *tx, &message_id).await {
        Ok(v) => v,
        Err(e) => {
            tx.rollback().await?;
            return Err(e.into());
        }
    };

    if let Err(e) = db::update_message_is_replied(&mut *tx, &message_id, count > 0).await {
        tx.rollback().await?;
        return Err(e.into());
    }
    tx.commit().await?;
    Ok(resp::suc(resp::AffResp { rows }).to_json())
}

pub async fn batch_del_message_replies(
    State(state): State<ArcAppState>,
    Path(id): Path<String>,
) -> Result<resp::JsonResp<resp::AffResp>> {
    let mut tx = state.pool.begin().await?;
    let rows = match db::batch_del_message_replies(&mut *tx, &id).await {
        Ok(v) => v,
        Err(e) => {
            tx.rollback().await?;
            return Err(e.into());
        }
    };
    if let Err(e) = db::update_message_is_replied(&mut *tx, &id, false).await {
        tx.rollback().await?;
        return Err(e.into());
    }
    tx.commit().await?;
    Ok(resp::suc(resp::AffResp { rows }).to_json())
}
