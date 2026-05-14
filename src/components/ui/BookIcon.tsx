import React from "react";
import { cn } from "@/utils/cn";

interface BookIconProps {
  className?: string;
  isActive?: boolean;
}

export const BookIcon: React.FC<BookIconProps> = ({ className, isActive }) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <img
        src="/number_bg.svg"
        alt=""
        aria-hidden="true"
        className={cn(
          "w-full h-full object-contain transition-all duration-500",
          isActive
            ? "opacity-100 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            : "opacity-60 group-hover:opacity-90"
        )}
      />
    </div>
  );
};
