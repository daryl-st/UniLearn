import { motion } from 'motion/react';
import type { AnalyticsMetric } from '@/types/student/analytics';
import { cn } from '@/lib/utils';

type MetricCardProps = AnalyticsMetric;

export function MetricCard({ label, value, unit, detail, highlight, progress }: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-32 flex-col justify-between border p-6',
        highlight
          ? 'border-primary/20 bg-primary/15'
          : 'border-outline-variant/30 bg-surface-low',
      )}
    >
      <span
        className={cn(
          'font-mono text-[10px] uppercase tracking-[0.14em]',
          highlight ? 'text-primary' : 'text-on-surface-variant',
        )}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-headline text-4xl font-bold text-on-surface">{value}</span>
        {unit ? (
          <span className="font-headline text-base font-semibold text-on-surface-variant">{unit}</span>
        ) : null}
      </div>
      {progress !== undefined ? (
        <div className="h-1 w-full overflow-hidden bg-surface-highest">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-primary"
          />
        </div>
      ) : detail ? (
        <span
          className={cn(
            'font-mono text-[11px]',
            detail.startsWith('+') ? 'text-secondary' : 'text-on-surface-variant',
          )}
        >
          {detail}
        </span>
      ) : null}
    </div>
  );
}
