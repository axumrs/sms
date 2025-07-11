import Loading from "./Loading";
import Toast from "./Toast";
import useStateContext from "../hooks/useStateContext";

export default function State({ children }: ComponentProps) {
  const { $toast, $setToast, $isLoading } = useStateContext();
  return (
    <>
      {children}

      {$toast && <Toast callback={() => $setToast(null)}>{$toast}</Toast>}
      {$isLoading && <Loading />}
    </>
  );
}
