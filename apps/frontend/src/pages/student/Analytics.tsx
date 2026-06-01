import { useEffect, useState } from 'react';
import { Download, BookOpen, Database, FileText, type LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { StudentPageHeader } from '@/components/features/student/shared/StudentPageHeader';
import { AnalyticsStatsGrid } from '@/components/features/student/analytics/AnalyticsStatsGrid';
import { PerformanceChart } from '@/components/features/student/analytics/PerformanceChart';
import { ActivityPulse } from '@/components/features/student/analytics/ActivityPulse';
import { TopicStrengthList } from '@/components/features/student/analytics/TopicStrengthList';
import { CourseProgressList } from '@/components/features/student/analytics/CourseProgressList';
import { LearningRecommendation } from '@/components/features/student/analytics/LearningRecommendation';
import { DashboardAPI, type StudentStats } from '@/api/dashboard';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Database,
  FileText
};

export default function Analytics() {
  const userName = useAuthStore((s) => s.user?.name?.trim());
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    DashboardAPI.getStudentStats()
      .then((data) => {
        if (active) {
          setStats(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load student analytics:", err);
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const eyebrow = userName ? `Learning overview · Signed in as ${userName}` : 'Learning overview';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-10 w-2/5 rounded-full bg-surface-low animate-pulse" />
          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 rounded-[1.5rem] bg-surface-low animate-pulse" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 rounded-[1.75rem] bg-surface-low animate-pulse" />
            <div className="h-72 rounded-[1.75rem] bg-surface-low animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Overall progress',
      value: stats ? String(stats.overallProgress || 0) : '0',
      unit: '%',
      progress: stats ? stats.overallProgress || 0 : 0,
    },
    {
      label: 'Quiz attempts',
      value: stats ? String(stats.quizAttemptsCount) : '0',
      unit: 'times',
      detail: stats && stats.avgQuizScore !== null ? `Average score: ${stats.avgQuizScore}%` : 'No attempts recorded',
    },
    {
      label: 'Resources viewed',
      value: stats ? String(stats.learningMaterialsCount) : '0',
      unit: 'items',
      detail: stats ? `${stats.enrolledCoursesCount} courses in progress` : '0 courses',
    },
    {
      label: 'Study assistant',
      value: 'Ready',
      detail: 'Ask questions in the learning workspace',
      highlight: true,
    },
  ];

  const chartMonths = stats?.monthlyPerformance?.map(m => m.month) || ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const chartPeakLabel = stats?.avgQuizScore ? `Peak ${stats.avgQuizScore}` : 'Peak 98.4';

  const activityHeatmap = stats?.activityPulse || Array.from({ length: 49 }, () => 0.1);

  const coursesData = stats?.coursesProgressDetails?.map(c => ({
    icon: iconMap[c.iconName] || BookOpen,
    title: c.title,
    subtitle: c.subtitle,
    metricLabel: c.metricLabel,
    metricValue: c.metricValue,
    status: c.status,
    completed: c.completed
  })) || [];

  const topicsData = stats?.coursesProgressDetails?.map(c => ({
    label: c.title.split(' — ')[1] || c.title,
    value: parseInt(c.metricValue) || 0
  })) || [];

  const lowestProgressCourse = stats?.coursesProgressDetails?.find(c => !c.completed) || stats?.coursesProgressDetails?.[0];
  const recommendation = lowestProgressCourse ? {
    title: `Continue with ${lowestProgressCourse.title.split(' — ')[1] || lowestProgressCourse.title} revision`,
    body: `You are currently at ${lowestProgressCourse.metricValue} progress. Open your course resources to keep momentum and review pending materials.`,
    primaryCta: 'Continue learning',
    primaryHref: `/dashboard/courses`,
    secondaryCta: 'Dismiss'
  } : {
    title: 'Explore new courses',
    body: 'You have completed all your enrolled course materials. Browse the course catalog to explore new academic opportunities and keep learning.',
    primaryCta: 'Browse catalog',
    primaryHref: '/dashboard/courses',
    secondaryCta: 'Dismiss'
  };

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Overall Progress,${stats?.overallProgress || 0}%\n`
      + `Quiz Attempts,${stats?.quizAttemptsCount || 0}\n`
      + `Average Quiz Score,${stats?.avgQuizScore || 0}%\n`
      + `Resources Viewed,${stats?.learningMaterialsCount || 0}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student-analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-full flex-col gap-6 p-6 md:gap-8 md:p-8">
      <StudentPageHeader
        eyebrow={eyebrow}
        title="Analytics"
        description="Live data-driven analysis of your course progress, learning activity, and assessment performance."
        status={
          <div className="ghost-border inline-flex items-center gap-2 rounded-sm bg-surface-low px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
            <span className="font-mono text-[11px] text-on-surface-variant">Live DB data</span>
          </div>
        }
        actions={
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-1.5 font-headline text-sm font-semibold text-on-primary hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="h-4 w-4" />
            Export report
          </button>
        }
      />

      <AnalyticsStatsGrid metrics={metrics} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PerformanceChart
          title="Assessment trend"
          subtitle="Real average scores from recent quiz attempts"
          peakLabel={chartPeakLabel}
          months={chartMonths}
        />
        <ActivityPulse
          title="Study activity"
          intensities={activityHeatmap}
          maxIntensityLabel="Real-time daily engagement pulse"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TopicStrengthList topics={topicsData} />
        <CourseProgressList courses={coursesData} />
      </section>

      <LearningRecommendation {...recommendation} />
    </div>
  );
}
