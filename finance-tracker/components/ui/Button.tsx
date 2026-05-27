import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-medium transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-[#4C6EF5] text-white hover:bg-[#6B8AF7]",
      secondary:
        "bg-[#1A2235] text-white border border-[#1F2A3D] hover:border-[#4C6EF5]",
      danger: "bg-[#EF444420] text-[#EF4444] hover:bg-[#EF444430]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
