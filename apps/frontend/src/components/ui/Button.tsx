import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 px-4 py-2",
          {
            "bg-brand text-on-primary hover:brightness-110": variant === "primary",
            "bg-surface-high text-on-surface hover:bg-surface-highest": variant === "secondary",
            "bg-transparent text-on-surface-variant hover:bg-surface-low": variant === "tertiary",
            "bg-transparent text-on-surface hover:bg-surface-low": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"