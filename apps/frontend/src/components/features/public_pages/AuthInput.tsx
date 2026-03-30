// src/components/features/auth/AuthInput.tsx
import type { LucideIcon } from "lucide-react";

interface AuthInputProps {
  label: string;
  placeholder: string;
  type?: string;
  Icon: LucideIcon;
}

export function AuthInput({ label, placeholder, type = "text", Icon }: AuthInputProps) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-brand transition-colors">
          <Icon size={14} />
        </div>
        <input 
          type={type}
          placeholder={placeholder}
          className="w-full bg-surface-high border border-white/5 rounded-sm py-3.5 pl-11 pr-4 text-sm font-mono text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}