import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string;
  variant?: "solid" | "subtle";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color, variant = "solid", style, ...props }, ref) => {
    const defaultBg = variant === "solid" ? "#4C6EF5" : "#4C6EF520";
    const defaultText = variant === "solid" ? "#FFF" : "#4C6EF5";

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
          className
        )}
        style={{
          backgroundColor: color ? (variant === "solid" ? color : `${color}20`) : defaultBg,
          color: color ? (variant === "solid" ? "#FFF" : color) : defaultText,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
