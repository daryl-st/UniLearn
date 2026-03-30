import * as React from "react"
import { cn } from "../../lib/utils"

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2;
  glass?: boolean;
}

export function Surface({ className, level = 1, glass = false, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-lg transition-colors duration-150", // Max radius 12px
        {
          "bg-surface-low": level === 1 && !glass,
          "bg-surface-high": level === 2 && !glass,
          "bg-brand/10 backdrop-blur-md bg-gradient-to-b from-brand/15 to-transparent shadow-ambient ring-1 ring-[#49454f]/15": glass,
        },
        className
      )}
      {...props}
    />
  )
}