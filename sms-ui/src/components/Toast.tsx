import { useEffect, useState } from "react";

export default function Toast({
  children,
  className = "",
  duration = 3000,
  callback = () => {},
}: ComponentProps & { duration?: number; callback?: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      if (callback) callback();
    }, duration);
    return () => clearTimeout(t);
  }, []);

  if (!show) return <></>;
  return (
    <div
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 rounded-lg text-white p-6 shadow ${className}`}
    >
      {children}
    </div>
  );
}
