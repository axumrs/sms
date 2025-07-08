import { LoaderIcon } from "lucide-react";

export default function Loading({
  children = <LoaderIcon className="animate-spin lg:scale-125" size={30} />,
  className = "",
  maskClassName = "",
}: {
  children?: React.ReactNode;
  className?: string;
  maskClassName?: string;
}) {
  return (
    <div className={`fixed inset-0 bg-gray-50/50 z-10 ${maskClassName}`}>
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  p-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
