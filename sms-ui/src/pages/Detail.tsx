import { useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Calendar, Group, Mail } from "lucide-react";
import dayjs from "dayjs";
import Markdown from "react-markdown";

export default function DetailPage() {
  const { id } = useParams();
  const { $get } = useFetch<Message>(useStateContext());
  const [msg, setMsg] = useState<Message | null>(null);

  const loadData = async () => {
    const data = await $get(`/api/message/${id}`);
    if (data) {
      setMsg(data);
    }
  };
  useEffect(() => {
    const t = setTimeout(() => {
      loadData();
    }, 10);

    return () => clearTimeout(t);
  }, []);

  if (!msg) {
    return <></>;
  }
  return (
    <>
      <section className="bg-white/70 my-6 p-4 space-y-4 rounded-md">
        <h1 className="text-xl ">{msg?.subject}</h1>

        <ul className="flex justify-start items-center gap-x-2 text-gray-500 text-xs">
          <li className="flex gap-x-1 items-center">
            <div>
              <Group size={12} />
            </div>
            <div>{msg?.group}</div>
          </li>

          <li className="flex gap-x-1 items-center">
            <div>
              <Mail size={12} />
            </div>
            <div>{msg?.email}</div>
          </li>

          <li className="flex gap-x-1 items-center">
            <div>
              <Calendar size={12} />
            </div>
            <div>{dayjs(msg?.dateline).format("YYYY-MM-DD HH:mm:ss")}</div>
          </li>
        </ul>
        <div className="prose">
          <Markdown>{msg?.message}</Markdown>
        </div>
      </section>

      <section className="bg-white/70 my-6 p-4 space-y-4 rounded-md">
        <div>暂无回复</div>
      </section>
    </>
  );
}
