import { Lock } from "lucide-react";
import Marsk from "./Marsk";
import TurnstileWidget from "./TurnstileWidget";
import { useState } from "react";
import useStateContext from "../hooks/useStateContext";
import State from "./State";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import getAuthStorage from "../getAuthStorage";

export default function AdminLogin() {
  const ctx = useStateContext();
  const { $setToast } = ctx;

  const [_, $setAuth] = getAuthStorage();

  const [formData, setFormData] = useState({
    password: "axum.eu.org",
    captcha: "",
  });

  const { $post } = useFetch<AdminAuth>(ctx);

  const nav = useNavigate();

  const handleLogin = async () => {
    const password = formData.password.trim();
    if (!(password && password.length >= 6)) {
      $setToast("请输入正确的密码");
      return;
    }

    const captcha = formData.captcha.trim();
    if (!(captcha && captcha.length >= 6)) {
      $setToast("请完成人机验证");
      return;
    }

    const res = await $post("/api/auth/admin-login", formData);
    if (res) {
      $setAuth(res);
      nav("/a");
    }
  };
  return (
    <>
      <State>
        <div className="fixed inset-0 z-[-1] object-cover opacity-20 bg-[url('/tg-pattern.svg')]"></div>
        <Marsk className="">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow space-y-4 w-11/12 lg:w-max">
            <h1 className="text-xl">后台登录</h1>
            <div>
              <label className="space-y-2">
                <div>密码：</div>
                <div className="flex justify-start items-center gap-x-1 ring ring-inset ring-gray-300 px-2 py-1.5 rounded">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    type="password"
                    className=""
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </label>
            </div>
            <div>
              <label className="space-y-2">
                <div>人机验证：</div>
                <div>
                  <TurnstileWidget
                    onVerify={(token) =>
                      setFormData({ ...formData, captcha: token })
                    }
                  />
                </div>
              </label>
            </div>
            <div className="flex justify-center lg:justify-end">
              <button
                className="bg-gray-800 text-white px-3 py-1.5 rounded w-full lg:w-auto"
                onClick={handleLogin}
              >
                登录
              </button>
            </div>
          </div>
        </Marsk>
      </State>
    </>
  );
}
