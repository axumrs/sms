import { createContext, useState } from "react";

const StateContext = createContext<StateContextProps>({
  $toast: null,
  $setToast: () => {},
  $msg: null,
  $setMsg: () => {},
  $isLoading: false,
  $setIsLoading: () => {},
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
  return (
    <StateContext.Provider
      value={{
        $toast: toast,
        $setToast,
        $msg: msg,
        $setMsg,
        $isLoading: isLoading,
        $setIsLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export { StateContext };
