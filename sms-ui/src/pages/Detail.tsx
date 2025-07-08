import { useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import MessageDetail from "../components/MessageDetail";

export default function DetailPage() {
  const { id } = useParams();
  const { $get } = useFetch<Message | MessageReply[]>(useStateContext());
  const [msg, setMsg] = useState<Message | null>(null);
  const [replies, setReplies] = useState<MessageReply[]>([]);

  const loadData = async () => {
    const data = await $get(`/api/message/${id}`);
    if (data) {
      setMsg(data as Message);
    }
  };

  const loadReplices = async () => {
    let resp = await $get(`/api/message/${id}/reply`);
    if (resp) {
      setReplies(resp as MessageReply[]);
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
      <MessageDetail
        msg={msg}
        className="my-6 p-4 bg-white/70  space-y-4 rounded-md"
        replies={replies}
        isAdmin={false}
      />
    </>
  );
}
