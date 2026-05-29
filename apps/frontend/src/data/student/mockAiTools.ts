import { BookOpen, FileText, HelpCircle, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AiToolStatus = 'live' | 'coming_soon';

export type AiToolItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: AiToolStatus;
  href?: string;
  ctaLabel: string;
};

export const mockAiTools: AiToolItem[] = [
  {
    id: 'resource-qa',
    title: 'Resource Q&A',
    description:
      'Ask questions grounded in a course PDF while you study. Open any resource in the learning workspace to start.',
    icon: HelpCircle,
    status: 'live',
    href: '/dashboard/courses',
    ctaLabel: 'Open courses',
  },
  {
    id: 'summary',
    title: 'Smart summary',
    description:
      'Generate concise summaries from selected lecture notes and readings to speed up revision.',
    icon: FileText,
    status: 'coming_soon',
    ctaLabel: 'Coming soon',
  },
  {
    id: 'quiz',
    title: 'Practice quiz',
    description:
      'Auto-generated quizzes from course content with feedback on incorrect answers.',
    icon: Sparkles,
    status: 'coming_soon',
    ctaLabel: 'Coming soon',
  },
  {
    id: 'study-tips',
    title: 'Study tips',
    description:
      'Personalized suggestions based on your activity patterns and course progress.',
    icon: BookOpen,
    status: 'coming_soon',
    ctaLabel: 'Coming soon',
  },
];

export const mockAiActivity = [
  {
    id: 'ai-1',
    title: 'Summary generated',
    description: 'Your AI summary for Normalization Lecture is ready to review.',
    time: 'Yesterday',
  },
  {
    id: 'ai-2',
    title: 'Resource Q&A session',
    description: 'You asked 3 questions in CoSc4411 — Database Systems.',
    time: '2 days ago',
  },
  {
    id: 'ai-3',
    title: 'Quiz feedback pending',
    description: 'Practice quiz APIs are not wired yet — this is sample activity.',
    time: 'Last week',
  },
] as const;
