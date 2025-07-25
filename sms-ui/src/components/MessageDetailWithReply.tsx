import { useState } from "react";
import MessageDetail from "./MessageDetail";
import useFetch from "../hooks/useFetch";

type CreateReply = {
  content: string;
  send_email:boolean;
};
export default function MessageDetailWithReply({
  msg,
  ctx,
  onDone,
  replies = [],
  onDelete,
  onClear,
  auth,
}: {
  msg: Message;
  ctx: StateContextProps;
  onDone: () => void;
  replies?: MessageReply[];
  onDelete?: () => void;
  onClear?: () => void;
  auth?: AdminAuth;
}) {
  const { $setToast } = ctx;
  const { $post } = useFetch<IdResp>(ctx, { $auth: auth });

  const [reply, setReply] = useState<CreateReply>({
    content: "",
    send_email:true,
  });

  const handleSubmit = async () => {
    const content = reply.content.trim();
    if (!(content.length >= 3 && content.length <= 255)) {
      $setToast("请输入回复内容：3~255个字符");
      return;
    }

    try {
      await $post(`/api/admin/message/${msg.id}/reply`, reply);
      setReply({
        content: "",
        send_email:true,
      });
      onDone();
    } catch (error) {
      $setToast("回复失败");
    }
  };
  return (
    <>
      <MessageDetail
        msg={msg}
        className="bg-white/70 my-4 p-4  space-y-4 rounded-md"
        replies={replies}
        isAdmin
        onDelete={onDelete}
        onClear={onClear}
        auth={auth}
      />
      <div className="bg-white/70 my-4 p-4  space-y-4 rounded-md">
        <div>
          <textarea
            className="px-2 py-1.5 ring ring-inset ring-gray-300 w-full h-36 rounded"
            placeholder="输入回复内容"
            value={reply.content}
            onChange={(e) => {
              setReply({
                ...reply,
                content: e.target.value.trim(),
              });
            }}
          ></textarea>
        </div>
        <div className="lg:flex lg:justify-end lg:items-center lg:gap-x-2">
          <label className="flex itemc-center gap-x-1">
            <input type="checkbox" checked={reply.send_email} onChange={e=>setReply({...reply, send_email:e.target.checked})} />
            <span>邮件回复</span></label>
         <div> <button
            className="w-full bg-gray-900 text-white px-2 py-1.5 rounded-md lg:w-auto"
            onClick={handleSubmit}
          >
            回复消息
          </button></div>
        </div>
      </div>
    </>
  );
}
