use axum::{
    Json,
    extract::{Path, Query, State},
};
use validator::Validate;

use crate::{ArcAppState, Error, Result, db, email, model, payload, resp};

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

    Ok(resp::suc(model::Pagination::new(count.0, page, page_size, data)).to_json())
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

    let send_email = frm.send_email();

    let mut tx = state.pool.begin().await?;

    let msg_id = id.clone();
    let reply_content = frm.content.clone();
    let m = model::MessageReply::new(id, frm.content);
    if let Err(e) = db::create_message_reply(&mut *tx, &m).await {
        tx.rollback().await?;
        return Err(e.into());
    }

    if let Err(e) = db::update_message_is_replied(&mut *tx, &msg_id, true).await {
        tx.rollback().await?;
        return Err(e.into());
    }

    if send_email {
        // 读取内容
        let msg = match db::get_message(&mut *tx, &msg_id).await {
            Ok(v) => {
                if let Some(v) = v {
                    v
                } else {
                    tx.rollback().await?;
                    return Err(Error::from_str("不存在的消息"));
                }
            }
            Err(e) => {
                tx.rollback().await?;
                return Err(e.into());
            }
        };
        // 构建邮件内容
        let email_title = format!("AXUM中文网回复: {}", msg.subject);
        let email_content = format!(
            "{}\n\n\n-------你发送的信息-------\n{}\n\n\n本邮件由系统自动发送，请勿回复。",
            reply_content, msg.message
        );
        let email_to = msg.email.clone();
        // 发送邮件
        let mail_user = state.cfg.mail_user.clone();
        let mail_smtp = state.cfg.mail_smtp.clone();
        let mail_password = state.cfg.mail_password.clone();
        tokio::spawn(async move {
            let m = email::Data {
                subject: email_title,
                body: email_content,
                to: email_to,
            };
            if let Err(e) = email::send(mail_smtp, mail_user, mail_password, m).await {
                tracing::error!("发送邮件失败：{:?}", e);
            }
        });
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
