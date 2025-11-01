import { cn } from "@heroui/react";

const IconWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center rounded-small justify-center w-8 h-8 shrink-0",
      className,
    )}
  >
    {children}
  </div>
);

export default IconWrapper;
