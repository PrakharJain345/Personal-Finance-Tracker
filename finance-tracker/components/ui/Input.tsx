import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "bg-[#111827] border border-[#1F2A3D] text-[#F9FAFB] rounded-xl px-4 py-3 placeholder:text-[#6B7280]/80 focus:outline-none focus:border-[#4C6EF5] transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
