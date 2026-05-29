import { BookOpen, Database, FileText } from 'lucide-react';
import type {
  AnalyticsMetric,
  CourseProgressItem,
  LearningRecommendationData,
  TopicStrength,
} from '@/types/student/analytics';

/** Fixed 7×7 heatmap intensities (0–1) for stable UI. */
export const activityHeatmap: number[] = [
  0.15, 0.35, 0.55, 0.2, 0.85, 0.4, 0.1,
  0.25, 0.6, 0.9, 0.45, 0.3, 0.7, 0.5,
  0.1, 0.2, 0.75, 0.65, 0.95, 0.35, 0.8,
  0.4, 0.5, 0.3, 0.88, 0.42, 0.6, 0.22,
  0.55, 0.72, 0.48, 0.2, 0.68, 0.91, 0.38,
  0.18, 0.82, 0.56, 0.44, 0.77, 0.33, 0.62,
  0.28, 0.15, 0.9, 0.5, 0.25, 0.84, 0.7,
];

export const mockAnalytics = {
  disclaimer:
    'Demo data only. Enrollment and quiz analytics are not connected to live APIs yet.',
  summary: [
    {
      label: 'Overall progress',
      value: '84.2',
      unit: '%',
      progress: 84.2,
    },
    {
      label: 'Study time',
      value: '128.5',
      unit: 'hrs',
      detail: '+12% vs last month',
    },
    {
      label: 'Resources reviewed',
      value: '12',
      unit: 'items',
      detail: '2 courses in progress',
    },
    {
      label: 'Study assistant',
      value: 'Ready',
      detail: 'Ask questions in the learning workspace',
      highlight: true,
    },
  ] satisfies AnalyticsMetric[],
  chart: {
    title: 'Assessment trend',
    subtitle: 'Sample scores from practice activities (Jan–Jun)',
    peakLabel: 'Peak 98.4',
    months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'] as const,
  },
  activity: {
    title: 'Study activity',
    maxIntensityLabel: 'Peak day: 4.2 hrs',
  },
  topics: [
    { label: 'Database systems', value: 94 },
    { label: 'Algorithms', value: 78 },
    { label: 'Software engineering', value: 88 },
    { label: 'AI & data ethics', value: 92 },
  ] satisfies TopicStrength[],
  courses: [
    {
      icon: BookOpen,
      title: 'CoSc4411 — Database Systems',
      subtitle: '6 resources · 4 reviewed',
      metricLabel: 'Progress',
      metricValue: '82%',
      status: '82% complete',
      completed: false,
    },
    {
      icon: Database,
      title: 'CoSc3301 — Data Structures',
      subtitle: '8 resources · 1 reviewed',
      metricLabel: 'Progress',
      metricValue: '14%',
      status: '14% complete',
      completed: false,
    },
    {
      icon: FileText,
      title: 'CoSc2101 — Programming Fundamentals',
      subtitle: 'All core materials reviewed',
      metricLabel: 'Status',
      metricValue: 'Done',
      status: 'Completed',
      completed: true,
    },
  ] satisfies CourseProgressItem[],
  recommendation: {
    title: 'Continue with Database Systems revision',
    body: 'You have strong engagement with normalization and ER modeling materials. Open your course resources to keep momentum, or browse the catalog for the next module.',
    primaryCta: 'Browse courses',
    primaryHref: '/dashboard/courses',
    secondaryCta: 'Dismiss',
  } satisfies LearningRecommendationData,
};
