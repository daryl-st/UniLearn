import { motion } from 'motion/react';

type ActivityPulseProps = {
  title: string;
  intensities: number[];
  maxIntensityLabel: string;
};

function cellColor(opacity: number): string {
  if (opacity > 0.8) return '#D0BCFF';
  if (opacity > 0.4) return 'rgba(208, 188, 255, 0.4)';
  return 'rgba(53, 52, 55, 0.2)';
}

export function ActivityPulse({ title, intensities, maxIntensityLabel }: ActivityPulseProps) {
  return (
    <div className="border border-outline-variant/30 bg-surface-low p-8">
      <h3 className="mb-6 font-headline text-lg font-bold uppercase tracking-tight text-on-surface">{title}</h3>
      <div className="grid grid-cols-7 gap-1">
        {intensities.map((opacity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.01 }}
            className="aspect-square w-full"
            style={{
              backgroundColor: cellColor(opacity),
              opacity: opacity > 0.2 ? 1 : 0.2,
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 font-mono text-[9px] text-on-surface-variant">
          <span>Less</span>
          <div className="h-2 w-2 bg-surface-highest/20" />
          <div className="h-2 w-2 bg-primary/40" />
          <div className="h-2 w-2 bg-primary/70" />
          <div className="h-2 w-2 bg-primary" />
          <span>More</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.04em] text-secondary">{maxIntensityLabel}</span>
      </div>
    </div>
  );
}
