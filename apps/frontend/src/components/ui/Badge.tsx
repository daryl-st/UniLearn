import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "status" | "neutral";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider",
        {
          "bg-accent/20 text-accent": variant === "status",
          "bg-surface-high text-on-surface-variant": variant === "neutral",
        },
        className
      )}
      {...props}
    >
      {variant === "status" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
      )}
      {children}
    </div>
  )
}