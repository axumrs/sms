CREATE TABLE IF NOT EXISTS "messages"  (
    "id" CHAR(20) PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(50) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "group" VARCHAR(4) NOT NULL,
    "dateline" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "is_reply" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "message_replies"  (
    "id" CHAR(20) PRIMARY KEY,
    "message_id" CHAR(20) NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "dateline" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW "messages_with_replies" AS
SELECT
    m.id,
    m.email,
    m.subject,
    m.message,
    m.dateline,
    m."group",
    m.is_reply,
    r.id AS reply_id,
    r.content,
    r.dateline AS reply_dateline
FROM
    "messages" AS m
    LEFT JOIN "message_replies" AS r ON m.id = r.message_id
;

CREATE VIEW "messages_with_replies_count" AS
SELECT
    m.id,
    m.email,
    m.subject,
    m.message,
    m.dateline,
    m."group",
    m.is_reply,
    (
        SELECT COUNT(*)
        FROM
            "message_replies" AS r
        WHERE
            r.message_id = m.id
    ) AS reply_count
FROM
    "messages" AS m
;