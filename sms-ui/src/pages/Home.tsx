import { useState } from "react";
import TurnstileWidget from "../components/TurnstileWidget";

type FormData = {
  nickname: string;
  email: string;
  message: string;
  subject: string;
  captcha: string;
};

export default function HomePage() {
  const [data, _setData] = useState<FormData>({
    nickname: "",
    email: "",
    message: "",
    subject: "",
    captcha: "",
  });
  return <Form data={data} />;
}

function Form({ data: _data }: { data: FormData }) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <form
      className="bg-white/70 p-4 shadow rounded-md my-3 space-y-4"
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-0">
        <label className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
          <div className="shrink-0">昵称：</div>
          <div className="grow">
            <input
              type="text"
              placeholder="请输入昵称"
              className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
            />
          </div>
        </label>
        <label className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
          <div className="shrink-0">邮箱：</div>
          <div className="grow">
            <input
              type="text"
              placeholder="请输入邮箱"
              className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
            />
          </div>
        </label>
      </div>
      <label className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
        <div className="shrink-0">主题：</div>
        <div className="grow">
          <input
            type="text"
            placeholder="请输入主题"
            className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
          />
        </div>
      </label>
      <label className="flex flex-col gap-y-2 ">
        <div className="shrink-0">内容：</div>
        <div className="grow">
          <textarea
            placeholder="请输入内容"
            rows={10}
            className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
          />
        </div>
      </label>
      <label className="flex flex-col gap-y-2 ">
        <div className="shrink-0">人机验证：</div>
        <div className="grow">
          <TurnstileWidget />
        </div>
      </label>
      <div className="flex justify-center lg:justify-end">
        <button className="bg-gray-900 rounded w-full text-white px-3 py-1.5 hover:bg-gray-800 lg:w-auto">
          发送信息
        </button>
      </div>
    </form>
  );
}
