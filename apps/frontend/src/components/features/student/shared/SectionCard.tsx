import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionCardProps = {
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ title, subtitle, headerRight, children, className }: SectionCardProps) {
  return (
    <div className={cn('border border-outline-variant/30 bg-surface-low p-8', className)}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">{title}</h3>
          {subtitle ? <p className="font-mono text-[11px] text-on-surface-variant">{subtitle}</p> : null}
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  );
}
