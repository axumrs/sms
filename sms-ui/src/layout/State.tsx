import Toast from "../components/Toast";
import useStateContext from "../hooks/useStateContext";

export default function State({ children }: ComponentProps) {
  const { $toast, $setToast } = useStateContext();
  return (
    <>
      {children}

      {$toast && <Toast callback={() => $setToast(null)}>{$toast}</Toast>}
    </>
  );
}
