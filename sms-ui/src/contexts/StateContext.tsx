import { createContext, useState } from "react";

const StateContext = createContext<StateContextProps>({
  $toast: null,
  $setToast: () => {},
  $msg: null,
  $setMsg: () => {},
  $isLoading: false,
  $setIsLoading: () => {},
  $adminJwtExpired: false,
  $setAdminJwtExpired: () => {},
});

export default function StateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const $setToast = (toast: string | null) => setToast(toast);

  const [msg, setMsg] = useState<string | null>(null);
  const $setMsg = (msg: string | null) => setMsg(msg);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const $setIsLoading = (isLoading: boolean) => setIsLoading(isLoading);

  const [adminJwtExpired, setAdminJwtExpired] = useState<boolean>(false);
  const $setAdminJwtExpired = (expired: boolean) => setAdminJwtExpired(expired);
  return (
    <StateContext.Provider
      value={{
        $toast: toast,
        $setToast,
        $msg: msg,
        $setMsg,
        $isLoading: isLoading,
        $setIsLoading,
        $adminJwtExpired: adminJwtExpired,
        $setAdminJwtExpired,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export { StateContext };
