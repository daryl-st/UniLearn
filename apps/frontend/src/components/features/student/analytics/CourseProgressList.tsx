import { CheckCircle2, ChevronRight } from 'lucide-react';
import type { CourseProgressItem } from '@/types/student/analytics';

type CourseProgressListProps = {
  title?: string;
  updatedAt?: string;
  courses: CourseProgressItem[];
};

export function CourseProgressList({
  title = 'Course progress',
  updatedAt = 'Demo data',
  courses,
}: CourseProgressListProps) {
  return (
    <div className="border border-outline-variant/30 bg-surface-low p-8 lg:col-span-2">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">{title}</h3>
        <span className="font-mono text-[10px] text-on-surface-variant">{updatedAt}</span>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.title} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-outline-variant/30 bg-surface-high">
                <course.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">{course.title}</p>
                <p className="font-mono text-[10px] text-on-surface-variant">{course.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
              <div className="hidden text-right sm:block">
                <p className="font-mono text-[10px] text-on-surface-variant">{course.metricLabel}</p>
                <p className="font-mono text-sm text-secondary">{course.metricValue}</p>
              </div>

              <div
                className={
                  course.completed
                    ? 'inline-flex items-center gap-1 border border-secondary/30 bg-secondary/10 px-3 py-1 font-mono text-[11px] text-secondary'
                    : 'inline-flex items-center gap-1 border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] text-primary'
                }
              >
                <span>{course.status}</span>
                {course.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
