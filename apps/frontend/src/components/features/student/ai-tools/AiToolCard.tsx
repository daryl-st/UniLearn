import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { AiToolItem } from '@/data/student/mockAiTools';

type AiToolCardProps = {
  tool: AiToolItem;
};

export function AiToolCard({ tool }: AiToolCardProps) {
  const isLive = tool.status === 'live';

  return (
    <article
      className={cn(
        'flex min-h-56 flex-col justify-between border p-6 transition-colors',
        isLive
          ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
          : 'border-outline-variant/30 bg-surface-low',
      )}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center border',
              isLive ? 'border-primary/40 bg-primary/15' : 'border-outline-variant/30 bg-surface-high',
            )}
          >
            <tool.icon className={cn('h-5 w-5', isLive ? 'text-primary' : 'text-on-surface-variant')} />
          </div>
          <span
            className={cn(
              'font-mono text-[10px] uppercase tracking-[0.12em]',
              isLive ? 'text-secondary' : 'text-on-surface-variant',
            )}
          >
            {isLive ? 'Available' : 'Coming soon'}
          </span>
        </div>
        <h3 className="font-headline text-lg font-bold text-on-surface">{tool.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{tool.description}</p>
      </div>

      {isLive && tool.href ? (
        <Link
          to={tool.href}
          className="mt-6 inline-flex w-fit items-center justify-center rounded-sm bg-primary px-5 py-2 font-headline text-xs font-bold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
        >
          {tool.ctaLabel}
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex w-fit cursor-not-allowed items-center justify-center rounded-sm border border-outline-variant/30 bg-surface-high px-5 py-2 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant"
        >
          {tool.ctaLabel}
        </button>
      )}
    </article>
  );
}
