import dayjs from "dayjs";
import { Calendar, Group, Mail } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import Dialog from "./Dialog";
import useFetch from "../hooks/useFetch";
import useStateContext from "../hooks/useStateContext";

export default function MessageDetail({
  msg,
  className = "",
  replies = [],
  isAdmin,
  onDelete,
  onClear,
}: {
  msg: Message;
  className?: string;
  replies?: MessageReply[];
  isAdmin?: boolean;
  onDelete?: () => void;
  onClear?: () => void;
}) {
  const [delReply, setDelReply] = useState<MessageReply | null>(null);
  const [clearReply, setClearReply] = useState<boolean>(false);
  const { $delete } = useFetch<any>(useStateContext());

  const handleDelete = async () => {
    if (!delReply) {
      return;
    }
    await $delete(`/api/admin/reply/${delReply.id}/${msg.id}`);
    setDelReply(null);
    onDelete?.();
  };
  const handleClear = async () => {
    await $delete(`/api/admin/message/${msg.id}/reply`);
    setClearReply(false);
    onClear?.();
  };
  return (
    <>
      <section className={`${className}`}>
        <h1 className="text-xl ">{msg.subject}</h1>

        <ul className="flex flex-col justify-start gap-y-1 lg:flex-row lg:gap-y-0 lg:items-center lg:gap-x-2 text-gray-500 text-xs">
          <li className="flex gap-x-1 items-center">
            <div>
              <Group size={12} />
            </div>
            <div>{msg.group}</div>
          </li>

          <li className="flex gap-x-1 items-center">
            <div>
              <Mail size={12} />
            </div>
            <div>{msg.email}</div>
          </li>

          <li className="flex gap-x-1 items-center">
            <div>
              <Calendar size={12} />
            </div>
            <div>{dayjs(msg.dateline).format("YYYY-MM-DD HH:mm:ss")}</div>
          </li>
        </ul>
        <div className="prose max-w-full">
          <Markdown>{msg.message}</Markdown>
        </div>
      </section>

      <section className={`${className}`}>
        {replies && replies.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg">站长回复</h3>
              <div>
                {isAdmin && (
                  <button
                    type="button"
                    className="text-sm"
                    onClick={() => setClearReply(true)}
                  >
                    清空
                  </button>
                )}
              </div>
            </div>
            <ul className="space-y-2">
              {replies.map((reply) => (
                <li key={reply.id} className="p-3 rounded odd:bg-gray-200/70">
                  <div className="prose max-w-full">
                    <Markdown>{reply.content}</Markdown>
                  </div>
                  <div className="flex gap-x-2 items-center justify-start  text-gray-500 text-xs">
                    <span>
                      {dayjs(reply.dateline).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                    {isAdmin && (
                      <button type="button" onClick={() => setDelReply(reply)}>
                        删除
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div>暂无回复</div>
        )}
      </section>
      {delReply && (
        <DelReply
          onCancel={() => setDelReply(null)}
          onConfirm={() => {
            handleDelete();
          }}
        />
      )}
      {clearReply && (
        <ClearReply
          onCancel={() => setClearReply(false)}
          onConfirm={() => {
            handleClear();
          }}
        />
      )}
    </>
  );
}

function DelReply({
  onCancel,
  onConfirm,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <Dialog
        title="删除"
        hideCloseButton
        className="w-11/12 lg:w-1/2 space-y-4"
      >
        <div>确定删除该回复？</div>
        <div className="flex justify-end items-center gap-x-2">
          <button
            className=" bg-gray-800 text-white px-3 py-1.5 rounded-md lg:w-auto"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            className=" bg-red-600 text-white px-3 py-1.5 rounded-md lg:w-auto"
            onClick={onConfirm}
          >
            确定
          </button>
        </div>
      </Dialog>
    </>
  );
}

function ClearReply({
  onCancel,
  onConfirm,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <Dialog
        title="清空"
        hideCloseButton
        className="w-11/12 lg:w-1/2 space-y-4"
      >
        <div>确定清空该消息的所有回复？</div>
        <div className="flex justify-end items-center gap-x-2">
          <button
            className=" bg-gray-800 text-white px-3 py-1.5 rounded-md lg:w-auto"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            className=" bg-red-600 text-white px-3 py-1.5 rounded-md lg:w-auto"
            onClick={onConfirm}
          >
            确定
          </button>
        </div>
      </Dialog>
    </>
  );
}
