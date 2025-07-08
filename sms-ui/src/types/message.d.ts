type Message = {
  id: string;
  email: string;
  subject: string;
  message: string;
  dateline: string;
  group: string;
  is_reply: boolean;
};

type MessageReply = {
  id: string;
  message_id: string;
  content: string;
  dateline: string;
};
