import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#111827] border border-[#1F2A3D] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-[#4C6EF540] hover:-translate-y-[2px]",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
