import type { LucideIcon } from 'lucide-react';

export type AnalyticsMetric = {
  label: string;
  value: string;
  unit?: string;
  detail?: string;
  highlight?: boolean;
  progress?: number;
};

export type TopicStrength = {
  label: string;
  value: number;
};

export type CourseProgressItem = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  metricLabel: string;
  metricValue: string;
  status: string;
  completed: boolean;
};

export type LearningRecommendationData = {
  title: string;
  body: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
};
