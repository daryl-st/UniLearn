import { motion } from 'motion/react';
import type { TopicStrength } from '@/types/student/analytics';

type TopicStrengthListProps = {
  title?: string;
  topics: TopicStrength[];
};

export function TopicStrengthList({ title = 'Topic strength', topics }: TopicStrengthListProps) {
  return (
    <div className="border border-outline-variant/30 bg-surface-low p-8">
      <h3 className="mb-6 font-headline text-lg font-bold uppercase tracking-tight text-on-surface">{title}</h3>
      <div className="space-y-5">
        {topics.map((topic) => (
          <div key={topic.label} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-on-surface">{topic.label}</span>
              <span className="font-mono text-[11px] text-primary">{topic.value}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden bg-surface-highest">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topic.value}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
