import { useState, type FormEvent } from "react";
import TurnstileWidget from "../components/TurnstileWidget";
import { $post } from "../fetch";
import useStateContext from "../hooks/useStateContext";

type FormData = {
  nickname: string;
  email: string;
  message: string;
  subject: string;
  captcha: string;
  group: "微信支付" | "用户注册" | "找回密码" | "其它";
};

export default function HomePage() {
  const { $setToast } = useStateContext();
  const [data, setData] = useState<FormData>({
    nickname: "",
    email: "",
    message: "",
    subject: "",
    captcha: "",
    group: "其它",
  });
  const updateValue =
    (key: string) =>
    (e: FormEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
      if (typeof e === "string") {
        setData({
          ...data,
          [key]: e,
        });
        return;
      }
      setData({
        ...data,
        [key]: e.currentTarget.value,
      });
    };

  const submitHandler = async () => {
    const nickname = data.nickname.trim();
    if (!(nickname && nickname.length >= 1 && nickname.length <= 20)) {
      $setToast("请输入昵称");
      return;
    }

    const email = data.email.trim();
    if (!(email && email.length >= 1 && email.length <= 255)) {
      $setToast("请输入邮箱");
      return;
    }

    const subject = data.subject.trim();
    if (!(subject && subject.length >= 1 && subject.length <= 50)) {
      $setToast("请输入主题");
      return;
    }

    const message = data.message.trim();
    if (!(message && message.length >= 1 && message.length <= 255)) {
      $setToast("请输入内容");
      return;
    }

    const captcha = data.captcha.trim();
    if (!(captcha && captcha.length >= 6)) {
      $setToast("请完成人机验证");
      return;
    }
    await $post("/api/send", data);
  };
  return (
    <Form data={data} updateValue={updateValue} onSubmit={submitHandler} />
  );
}

function Form({
  data,
  updateValue,
  onSubmit,
}: {
  data: FormData;
  updateValue: (
    key: string
  ) => (e: FormEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  const captchaOnVerify = (token: string) => {
    updateValue("captcha")(token);
  };
  return (
    <form
      className="bg-white/70 p-4 shadow rounded-md my-3 space-y-4"
      onSubmit={onSubmitHandler}
    >
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-0">
        <label className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
          <div className="shrink-0">昵称：</div>
          <div className="grow">
            <input
              type="text"
              placeholder="请输入昵称"
              className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
              value={data.nickname}
              onChange={updateValue("nickname")}
            />
          </div>
        </label>
        <label className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
          <div className="shrink-0">邮箱：</div>
          <div className="grow">
            <input
              type="email"
              placeholder="请输入邮箱"
              className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
              value={data.email}
              onChange={updateValue("email")}
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
            value={data.subject}
            onChange={updateValue("subject")}
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
            value={data.message}
            onChange={updateValue("message")}
          />
        </div>
      </label>
      <label className="flex flex-col gap-y-2 ">
        <div className="shrink-0">人机验证：</div>
        <div className="grow">
          <TurnstileWidget onVerify={captchaOnVerify} />
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
