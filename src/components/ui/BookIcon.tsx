import React from "react";
import { cn } from "@/utils/cn";

interface BookIconProps {
  className?: string;
  isActive?: boolean;
}

export const BookIcon: React.FC<BookIconProps> = ({ className, isActive }) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Circle */}
        <circle 
          cx="12" 
          cy="12" 
          r="11" 
          className={cn(
            "transition-colors duration-500",
            isActive ? "stroke-brand-gold fill-brand-gold/5" : "stroke-slate-200 dark:stroke-white/10 fill-none"
          )}
          strokeWidth="1"
        />
        
        {/* Open Book Path */}
        <path 
          d="M12 18V6M12 6C10.5 6 7 6 4 8V18C7 16 10.5 16 12 16M12 6C13.5 6 17 6 20 8V18C17 16 13.5 16 12 16" 
          className={cn(
            "transition-colors duration-500",
            isActive ? "stroke-brand-gold" : "stroke-slate-400 dark:stroke-slate-500 group-hover:stroke-brand-emerald-light"
          )}
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
