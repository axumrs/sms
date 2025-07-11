import { useState, type FormEvent } from "react";
import TurnstileWidget from "../components/TurnstileWidget";

import useStateContext from "../hooks/useStateContext";
import useFetch from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";

type FormData = {
  email: string;
  message: string;
  subject: string;
  captcha: string;
  group?: "微信支付" | "用户注册" | "找回密码" | "其它";
};

export default function HomePage() {
  const ctx = useStateContext();
  const { $setToast } = ctx;
  const { email: $email, orderId: $orderId, action: $action } = useParams();
  const subject = () => {
    if ($orderId) {
      return `订单'${$orderId}'已完成支付`;
    }
    if ($action === "active") {
      return "激活账号";
    }
    if ($action === "reset") {
      return "重置密码";
    }
    return "";
  };
  const group = () => {
    if ($orderId) {
      return "微信支付";
    }
    if ($action === "active") {
      return "用户注册";
    }
    if ($action === "reset") {
      return "找回密码";
    }
    return undefined;
  };

  const message = () => {
    if ($orderId) {
      return `您好，订单 \`${$orderId}\` 已完成支付，请尽快通过审核，谢谢！`;
    }
    if ($action === "active") {
      return "您好，我没收到激活账号的验证码，**并且已经发送过邮件到激活邮箱**，请尽快帮我激活账号，谢谢！";
    }
    if ($action === "reset") {
      return "您好，我没收到重置密码的验证码，**并且已经发送过邮件到激活邮箱**，请尽快帮我重置密码，谢谢！";
    }
    return "";
  };
  const [data, setData] = useState<FormData>({
    email: $email || "",
    message: message() || "",
    subject: subject() || "",
    captcha: "",
    group: group(),
  });
  const { $post } = useFetch<IdResp>(ctx);
  const navigate = useNavigate();

  const updateValue =
    (key: string) =>
    (
      e:
        | FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        | string
    ) => {
      if (key === "group" && e === "--请选择--") {
        setData({
          ...data,
          group: undefined,
        });
        return;
      }
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
    const subject = data.subject.trim();
    if (!(subject && subject.length >= 3 && subject.length <= 50)) {
      $setToast("请输入主题：3~50个字符");
      return;
    }

    const email = data.email.trim();
    if (!(email && email.length >= 6 && email.length <= 255)) {
      $setToast("请输入邮箱：6~255个字符");
      return;
    }

    if (
      !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
        email
      )
    ) {
      $setToast("请输入正确的邮箱");
      return;
    }

    const message = data.message.trim();
    if (!(message && message.length >= 3 && message.length <= 255)) {
      $setToast("请输入内容：3~255个字符");
      return;
    }

    const captcha = data.captcha.trim();
    if (!(captcha && captcha.length >= 6)) {
      $setToast("请完成人机验证");
      return;
    }

    const group = data.group;
    // @ts-ignore
    if (!group || group === "--请选择--") {
      $setToast("请选择分组");
      return;
    }
    const resp = await $post("/api/send", data);
    if (resp) {
      return navigate(`/v/${resp.id}`);
    }
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
  ) => (
    e:
      | FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | string
  ) => void;
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
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-0">
        <label className="flex flex-col gap-y-2 lg:col-span-1 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
          <div className="shrink-0">分组：</div>
          <div className="grow">
            <select
              value={data.group}
              onChange={updateValue("group")}
              className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
            >
              <option value={undefined}>--请选择--</option>
              {["微信支付", "用户注册", "找回密码", "其它"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label className="flex flex-col gap-y-2 lg:col-span-4 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
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
      </div>
      <label className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-2">
        <div className="shrink-0">邮箱：</div>
        <div className="grow">
          <input
            type="email"
            placeholder="留下你的邮箱，方便回复"
            className="rounded px-3 py-1.5 ring ring-gray-400 focus:ring-sky-600 ring-inset w-full block"
            value={data.email}
            onChange={updateValue("email")}
          />
        </div>
      </label>
      <label className="flex flex-col gap-y-2 ">
        <div className="shrink-0">内容：</div>
        <div className="grow">
          <textarea
            placeholder="请输入内容（支持Markdown）"
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
