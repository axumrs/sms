import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useStateContext from "../../hooks/useStateContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import locale_zh from "dayjs/locale/zh-cn";
import Dialog from "../../components/Dialog";
import MessageDetailWithReply from "../../components/MessageDetailWithReply";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
dayjs.locale(locale_zh);
dayjs.extend(relativeTime);

type SearchFormData = {
  email?: string;
  subject?: string;
  message?: string;
  group?: string;
  is_reply?: 0 | 1;

  page_size?: number;
};

const emptySearchFormData: SearchFormData = {
  email: undefined,
  subject: undefined,
  message: undefined,
  group: undefined,
  is_reply: undefined,
  page_size: 1,
};
export default function AdminHomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [detailMsg, setDetailMsg] = useState<Message | null>(null);
  const [delMsg, setDelMsg] = useState<Message | null>(null);
  const [msgReplies, setMsgReplies] = useState<MessageReply[]>([]);
  const [showSearchPane, setShowSearchPane] = useState<boolean>(false);
  const [formData, setFormData] = useState<SearchFormData>({
    ...emptySearchFormData,
  });
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page_total: 0,
    page: 0,
    page_size: 0,
  });
  const [pageNumList, setPageNumList] = useState<number[]>([]);
  const [page, setPage] = useState(0);

  const changeFormDataValue =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (key === "group" && e.target.value === "所有分组") {
        setFormData({
          ...formData,
          [key]: undefined,
        });
        return;
      }
      if (key === "is_reply" && e.target.value === "全部") {
        setFormData({
          ...formData,
          [key]: undefined,
        });
        return;
      }
      setFormData({
        ...formData,
        [key]: e.target.value || undefined,
      });
    };

  const ctx = useStateContext();
  const { $get, $delete } = useFetch<Pagination<Message> | MessageReply[]>(ctx);

  const loadData = async () => {
    const res = await $get("/api/admin/message", { ...formData, page });
    if (res) {
      setMessages((res as Pagination<Message>).data || []);
      setPaginationMeta(res as Pagination<Message>);
    }
  };

  const loadReplices = async () => {
    if (!detailMsg) {
      return;
    }
    let resp = await $get(`/api/admin/message/${detailMsg.id}/reply`);
    if (resp) {
      setMsgReplies(resp as MessageReply[]);
    }
  };

  const delMsgHandler = async () => {
    if (!delMsg) {
      return;
    }
    await $delete(`/api/admin/message/${delMsg.id}`);
    setDelMsg(null);
    await loadData();
  };

  useEffect(() => {
    Promise.all([loadData()]);
  }, []);

  useEffect(() => {
    loadReplices();
  }, [detailMsg]);

  useEffect(() => {
    let pnl: number[] = [];
    for (let i = 0; i < paginationMeta.page_total; i++) {
      pnl.push(i);
    }
    setPageNumList(pnl);
  }, [paginationMeta]);

  return (
    <>
      <div className="lg:hidden flex justify-end fixed top-4 right-4">
        <button
          className="bg-white text-gray-600 rounded-full p-1"
          onClick={() => setShowSearchPane(!showSearchPane)}
        >
          <Search size={20} />
        </button>
      </div>
      <section
        className={`  bg-white my-6 p-4  rounded-md fixed   left-1/2 -translate-x-1/2 -translate-y-6  z-10 w-11/12 shadow-lg lg:bg-white/70 lg:static lg:shadow-none lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0 lg:z-auto lg:w-auto lg:block  ${
          showSearchPane ? "block" : "hidden"
        }`}
      >
        <ul className=" grid lg:grid-flow-col gap-4">
          <li>
            <input
              placeholder="邮箱"
              className="w-full ring ring-inset px-2 py-0.5 rounded ring-gray-300 placeholder:text-gray-500"
              onChange={changeFormDataValue("email")}
              value={formData.email}
            />
          </li>
          <li>
            <input
              onChange={changeFormDataValue("subject")}
              value={formData.subject}
              placeholder="主题"
              className="w-full ring ring-inset px-2 py-0.5 rounded ring-gray-300 placeholder:text-gray-500"
            />
          </li>
          {/* <li>
            <input
              onChange={changeFormDataValue("message")}
              value={formData.message}
              placeholder="消息"
              className="w-full ring ring-inset px-2 py-0.5 rounded ring-gray-300 placeholder:text-gray-500 "
            />
          </li> */}
          <li>
            <select
              className="w-full ring ring-inset px-2 py-0.5 rounded ring-gray-300 placeholder:text-gray-500 text-gray-500"
              onChange={changeFormDataValue("group")}
              value={formData.group}
            >
              <option value={undefined}>所有分组</option>
              {["微信支付", "用户注册", "找回密码", "其它"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </li>
          <li>
            <select
              className="w-full ring ring-inset px-2 py-0.5 rounded ring-gray-300 placeholder:text-gray-500 text-gray-500"
              onChange={changeFormDataValue("is_reply")}
              value={formData.is_reply}
            >
              <option value={undefined}>全部</option>
              <option value={0}>未回复</option>
              <option value={1}>已回复</option>
            </select>
          </li>
          <li>
            <button
              className="w-full ring ring-inset px-2 py-0.5 rounded ring-gray-300  text-gray-500 "
              onClick={loadData}
            >
              搜索
            </button>
          </li>
        </ul>
      </section>

      <section className="bg-white/70 my-6 p-4  rounded-md">
        <div className="overflow-x-auto prose max-w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>分组</th>
                <th>邮箱</th>
                <th>标题</th>
                <th>回复</th>
                <th>时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {messages && messages.length > 0 ? (
                <>
                  {messages.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="truncate uppercase text-xs hidden lg:block">
                          {item.id}
                        </div>
                        <div className="truncate uppercase text-xs lg:hidden">
                          {item.id.slice(0, 6)}...
                        </div>
                      </td>
                      <td className="text-nowrap">{item.group}</td>
                      <td>
                        <div className="truncate text-xs lg:text-sm">
                          {item.email}
                        </div>
                      </td>
                      <td>
                        <div className="truncate">{item.subject}</div>
                      </td>
                      <td>
                        {item.is_reply ? (
                          <span className="px-2 py-0.5 text-sm bg-green-600 text-white rounded-md">
                            是
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-sm bg-gray-600 text-white rounded-md">
                            否
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="text-xs text-nowrap">
                          {dayjs(item.dateline).fromNow()}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-y-1 lg:flex-row lg:gap-x-1 lg:gap-y-0">
                          <button
                            className="text-nowrap py-0.5 px-2 bg-cyan-600 text-white rounded-md text-sm lg:hover:bg-cyan-500"
                            onClick={() => setDetailMsg(item)}
                          >
                            详情
                          </button>
                          <button
                            className="text-nowrap py-0.5 px-2 bg-red-600 text-white rounded-md text-sm lg:hover:bg-red-500"
                            onClick={() => {
                              setDelMsg(item);
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={6}>暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <div className="bg-white/70 my-6 p-4  rounded-md flex justify-end">
        转到第
        <select
          className="min-w-12 px-2 py-0.5 ring ring-inset ring-gray-300 rounded mx-1 text-sm"
          value={page}
          onChange={(e) => {
            setPage(Number(e.target.value));
            loadData();
          }}
        >
          {pageNumList.map((p) => (
            <option key={`page-num-${p}`} value={p}>
              {p + 1}
            </option>
          ))}
        </select>
        页 - {page} - {JSON.stringify(formData)}
      </div>
      {detailMsg && (
        <DetailDialog
          msg={detailMsg}
          onClose={() => setDetailMsg(null)}
          ctx={ctx}
          onDone={() => {
            Promise.all([loadData(), loadReplices()]);
          }}
          replies={msgReplies}
          onDelete={() => {
            Promise.all([loadData(), loadReplices()]);
          }}
          onClear={() => {
            Promise.all([loadData(), loadReplices()]);
          }}
        />
      )}
      {delMsg && (
        <DeleteDialog
          msg={delMsg}
          onConfirm={() => delMsgHandler()}
          onCancel={() => setDelMsg(null)}
        />
      )}
    </>
  );
}

function DetailDialog({
  msg,
  onClose,
  ctx,
  onDone,
  replies,
  onDelete,
  onClear,
}: {
  msg: Message;
  onClose?: () => void;
  ctx: StateContextProps;
  onDone: () => void;
  replies: MessageReply[];
  onDelete?: () => void;
  onClear?: () => void;
}) {
  return (
    <>
      <Dialog
        title="详情"
        className="w-11/12 lg:w-1/2 space-y-4"
        onMarskClick={onClose}
      >
        <div className="bg-gray-100 p-4">
          <MessageDetailWithReply
            msg={msg}
            ctx={ctx}
            onDone={onDone}
            replies={replies}
            onDelete={onDelete}
            onClear={onClear}
          />
        </div>

        <div className="flex justify-center">
          <Link to={`/a/v/${msg.id}`} className="text-blue-600">
            完整回复
          </Link>
        </div>
      </Dialog>
    </>
  );
}

function DeleteDialog({
  msg,
  onCancel,
  onConfirm,
}: { msg: Message } & { onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <Dialog
        title="删除"
        className="w-11/12 lg:w-1/4 space-y-4"
        hideCloseButton
      >
        <div className="overflow-x-auto">
          删除后无法恢复，确定删除
          <span className="truncate text-orange-600 underline underline-offset-4 decoration-orange-600 decoration-wavy mx-1">
            {msg.subject}
          </span>
          吗？
        </div>
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
