import { motion } from 'motion/react';
import type { UsageStatItem } from '@/types/student/settings';

type UsageStatsSectionProps = {
  stats: UsageStatItem[];
};

export function UsageStatsSection({ stats }: UsageStatsSectionProps) {
  return (
    <div className="mt-8">
      <h4 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">
        This month
      </h4>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-high/30 p-6 transition-all hover:border-primary/30"
          >
            <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-on-surface-variant">{stat.label}</p>
              <stat.icon
                className={`h-4 w-4 text-on-surface-variant transition-colors group-hover:text-primary ${stat.pulse ? 'animate-pulse text-secondary' : ''}`}
              />
            </div>
            <p className="mb-3 font-headline text-4xl font-bold tracking-tighter text-on-surface">{stat.value}</p>
            {stat.progress !== undefined ? (
              <div className="h-1 overflow-hidden rounded-full bg-surface-high">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1.5, ease: 'circOut' }}
                  className="h-full bg-primary"
                />
              </div>
            ) : (
              <p
                className={`text-[10px] font-mono font-black tracking-widest ${
                  stat.subtext === 'OPTIMIZED' ? 'text-secondary' : 'text-on-surface-variant/40'
                }`}
              >
                {stat.subtext}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
