import type { ReactNode } from 'react';

type StudentPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  status?: ReactNode;
  actions?: ReactNode;
};

export function StudentPageHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
}: StudentPageHeaderProps) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">{eyebrow}</span>
        <h2 className="mt-1 font-headline text-4xl font-bold tracking-tighter text-on-surface">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      {(status || actions) && (
        <div className="flex flex-wrap items-center gap-2">
          {status}
          {actions}
        </div>
      )}
    </section>
  );
}
