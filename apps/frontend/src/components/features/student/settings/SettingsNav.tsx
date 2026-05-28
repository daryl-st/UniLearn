import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { SettingsNavItem } from '@/types/student/settings';

type SettingsNavProps = {
  items: SettingsNavItem[];
  activeId: string;
  onChange: (id: string) => void;
};

export function SettingsNav({ items, activeId, onChange }: SettingsNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 }}
      className="grid grid-cols-2 gap-1 rounded-sm border border-outline-variant/10 bg-surface-low p-1 sm:grid-cols-4 sm:gap-2 sm:p-2"
      aria-label="Settings sections"
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex w-full items-center justify-center gap-1 rounded-sm border-b-2 px-1 py-2 text-[9px] font-mono uppercase tracking-[0.08em] transition-all sm:gap-2 sm:px-3 sm:text-xs sm:tracking-[0.14em]',
              active
                ? 'border-b-primary bg-surface-high text-primary'
                : 'border-b-transparent text-on-surface-variant hover:bg-surface-high/60 hover:text-white',
            )}
          >
            <item.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="sm:hidden">{item.mobileLabel}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </motion.nav>
  );
}
