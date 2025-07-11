import { useParams } from "react-router-dom";
import MessageDetailWithReply from "../../components/MessageDetailWithReply";
import useFetch from "../../hooks/useFetch";
import useStateContext from "../../hooks/useStateContext";
import { useEffect, useState } from "react";
import getAuthStorage from "../../getAuthStorage";

export default function AdminDetailPage() {
  const ctx = useStateContext();
  const { id } = useParams();

  const [$auth] = getAuthStorage();

  const { $get } = useFetch<Message | MessageReply[]>(ctx, { $auth });
  const [msg, setMsg] = useState<Message | null>(null);
  const [msgReplies, setMsgReplies] = useState<MessageReply[]>([]);

  const loadData = async () => {
    const data = await $get(`/api/admin/message/${id}`);
    if (data) {
      setMsg(data as Message);
    }
  };

  const loadReplices = async () => {
    const data = await $get(`/api/admin/message/${id}/reply`);
    if (data) {
      setMsgReplies(data as MessageReply[]);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      Promise.all([loadData(), loadReplices()]);
    }, 10);

    return () => clearTimeout(t);
  }, []);

  if (!msg) {
    return <></>;
  }
  return (
    <>
      <MessageDetailWithReply
        msg={msg}
        ctx={ctx}
        onDone={loadReplices}
        replies={msgReplies}
        onDelete={loadReplices}
        onClear={loadReplices}
        auth={$auth}
      />
    </>
  );
}
