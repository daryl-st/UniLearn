import type { AnalyticsMetric } from '@/types/student/analytics';
import { MetricCard } from '@/components/features/student/shared/MetricCard';

type AnalyticsStatsGridProps = {
  metrics: AnalyticsMetric[];
};

export function AnalyticsStatsGrid({ metrics }: AnalyticsStatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </section>
  );
}
