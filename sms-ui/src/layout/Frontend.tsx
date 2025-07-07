import { Link, Outlet } from "react-router-dom";
import State from "./State";

export default function FrontendLayout() {
  return (
    <>
      <State>
        <div className="fixed inset-0 z-[-1] object-cover opacity-20 bg-[url('/tg-pattern.svg')]"></div>
        <header className="bg-gray-100/50 shadow">
          <div className="sms-container flex items-center justify-between py-4">
            <Link
              to="/"
              className="shrink-0 flex items-center  gap-x-3 lg:gap-x-4"
            >
              <img
                src="/logo.png"
                alt="logo"
                className="w-8 lg:w-10 object-cover"
              />
              <h2 className="text-lg lg:text-xl">给站长发送手机短信</h2>
            </Link>
          </div>
        </header>
        <div className="sms-container">
          <Outlet />
        </div>
      </State>
    </>
  );
}
