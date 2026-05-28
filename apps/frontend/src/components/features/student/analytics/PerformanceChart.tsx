import { motion } from 'motion/react';

type PerformanceChartProps = {
  title: string;
  subtitle: string;
  peakLabel: string;
  months: readonly string[];
};

export function PerformanceChart({ title, subtitle, peakLabel, months }: PerformanceChartProps) {
  return (
    <div className="relative overflow-hidden border border-outline-variant/30 bg-surface-low p-8 lg:col-span-2">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">{title}</h3>
          <p className="font-mono text-[11px] text-on-surface-variant">{subtitle}</p>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Current
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-surface-highest" />
            Average
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full">
        <svg className="h-full w-full" viewBox="0 0 800 200" aria-hidden>
          <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="0" y2="0" />
          <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="50" y2="50" />
          <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="100" y2="100" />
          <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="150" y2="150" />

          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            d="M0,120 Q200,100 400,110 T800,90"
            fill="none"
            stroke="#2A2A2C"
            strokeDasharray="4"
            strokeWidth="2"
          />

          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            d="M0,150 L100,140 L200,90 L300,110 L400,60 L500,70 L600,30 L700,45 L800,20"
            fill="none"
            stroke="#D0BCFF"
            strokeWidth="3"
          />

          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 }}
            cx="600"
            cy="30"
            r="4"
            fill="#D0BCFF"
          />

          <motion.circle
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ delay: 1.5 }}
            cx="600"
            cy="30"
            r="12"
            fill="none"
            stroke="#D0BCFF"
          />
        </svg>
        <div className="absolute top-5 left-[75%] border border-outline-variant/40 bg-surface-high px-2 py-1">
          <span className="font-mono text-[10px] text-primary">{peakLabel}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between px-1 font-mono text-[10px] text-on-surface-variant">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}
