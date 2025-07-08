import State from "./State";
import { Link, Outlet } from "react-router-dom";

export default function Header({ isBackend }: { isBackend?: boolean }) {
  const href = isBackend ? "/a" : "/";
  const bage = isBackend ? "后台" : null;
  return (
    <>
      <State>
        <div className="fixed inset-0 z-[-1] object-cover opacity-20 bg-[url('/tg-pattern.svg')]"></div>
        <header className="bg-gray-100/50 shadow">
          <div className="sms-container flex items-center justify-between py-4 ">
            <Link
              to={href}
              className="shrink-0 flex items-center  gap-x-3 lg:gap-x-4 relative"
            >
              <img
                src="/logo.png"
                alt="logo"
                className="w-8 lg:w-10 object-cover"
              />
              <h2 className="text-lg lg:text-xl">给站长发送手机短信</h2>
              {bage && (
                <div className="absolute z-[1] -right-5 -top-2 bg-orange-600/80 rounded-md text-white text-xs p-1">
                  {bage}
                </div>
              )}
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
