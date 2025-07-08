export default function Marsk({
  children,
  className = "",
  onClick,
}: ComponentProps & {
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const onClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onClick) {
      // e.stopPropagation();
      onClick(e);
    }
  };
  return (
    <div className={`fixed inset-0 z-10 ${className}`} onClick={onClickHandler}>
      {children}
    </div>
  );
}
