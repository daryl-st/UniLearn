import { Download } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { activityHeatmap, mockAnalytics } from '@/data/student/mockAnalytics';
import { StudentPageHeader } from '@/components/features/student/shared/StudentPageHeader';
import { AnalyticsStatsGrid } from '@/components/features/student/analytics/AnalyticsStatsGrid';
import { PerformanceChart } from '@/components/features/student/analytics/PerformanceChart';
import { ActivityPulse } from '@/components/features/student/analytics/ActivityPulse';
import { TopicStrengthList } from '@/components/features/student/analytics/TopicStrengthList';
import { CourseProgressList } from '@/components/features/student/analytics/CourseProgressList';
import { LearningRecommendation } from '@/components/features/student/analytics/LearningRecommendation';

export default function Analytics() {
  const userName = useAuthStore((s) => s.user?.name?.trim());

  const eyebrow = userName ? `Learning overview · Signed in as ${userName}` : 'Learning overview';

  return (
    <div className="flex min-h-full flex-col gap-6 p-6 md:gap-8 md:p-8">
      <StudentPageHeader
        eyebrow={eyebrow}
        title="Analytics"
        description={mockAnalytics.disclaimer}
        status={
          <div className="ghost-border inline-flex items-center gap-2 rounded-sm bg-surface-low px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
            <span className="font-mono text-[11px] text-on-surface-variant">Demo data</span>
          </div>
        }
        actions={
          <button
            type="button"
            disabled
            aria-disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-sm bg-primary/50 px-4 py-1.5 font-headline text-sm font-semibold text-on-primary opacity-70"
          >
            <Download className="h-4 w-4" />
            Export report
          </button>
        }
      />

      <AnalyticsStatsGrid metrics={mockAnalytics.summary} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PerformanceChart
          title={mockAnalytics.chart.title}
          subtitle={mockAnalytics.chart.subtitle}
          peakLabel={mockAnalytics.chart.peakLabel}
          months={mockAnalytics.chart.months}
        />
        <ActivityPulse
          title={mockAnalytics.activity.title}
          intensities={activityHeatmap}
          maxIntensityLabel={mockAnalytics.activity.maxIntensityLabel}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TopicStrengthList topics={mockAnalytics.topics} />
        <CourseProgressList courses={mockAnalytics.courses} />
      </section>

      <LearningRecommendation {...mockAnalytics.recommendation} />
    </div>
  );
}
