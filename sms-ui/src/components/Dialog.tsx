import { X } from "lucide-react";
import Marsk from "./Marsk";

export default function Dialog({
  children,
  title,
  className = "",
  onMarskClick,
  hideCloseButton,
}: ComponentProps & {
  title: string;
  onMarskClick?: (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void;
  hideCloseButton?: boolean;
}) {
  return (
    <Marsk
      className={`bg-black/80`}
      onClick={(e) => {
        if (onMarskClick) onMarskClick(e);
      }}
    >
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded-md shadow ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {hideCloseButton !== true && (
          <button
            type="button"
            className="bg-white absolute -top-2 -right-2 rounded-full shadow-md"
            onClick={(e) => {
              if (onMarskClick) onMarskClick(e);
            }}
          >
            <X />
          </button>
        )}

        <h3 className="text-xl">{title}</h3>
        <div className="overflow-y-auto max-h-[32rem] lg:max-h-[48rem] space-y-4">
          {children}
        </div>
      </div>
    </Marsk>
  );
}
