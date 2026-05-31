import { mockAiActivity, mockAiTools } from '@/data/student/mockAiTools';
import { StudentPageHeader } from '@/components/features/student/shared/StudentPageHeader';
import { AiToolsGrid } from '@/components/features/student/ai-tools/AiToolsGrid';

export default function AiTools() {
  return (
    <div className="flex min-h-full flex-col gap-6 p-6 md:gap-8 md:p-8">
      <StudentPageHeader
        eyebrow="AI learning tools"
        title="AI Tools"
        description="Resource Q&A, AI summaries, and practice quizzes are available from the learning workspace on any indexed course resource."
      />

      <AiToolsGrid tools={mockAiTools} />

      <section className="border border-outline-variant/30 bg-surface-low p-8">
        <h3 className="mb-6 font-headline text-lg font-bold uppercase tracking-tight text-on-surface">
          Recent AI activity
        </h3>
        <ul className="divide-y divide-outline-variant/10">
          {mockAiActivity.map((item) => (
            <li key={item.id} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                <p className="text-xs text-on-surface-variant">{item.description}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
