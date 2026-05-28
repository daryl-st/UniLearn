import type { AiToolItem } from '@/data/student/mockAiTools';
import { AiToolCard } from './AiToolCard';

type AiToolsGridProps = {
  tools: AiToolItem[];
};

export function AiToolsGrid({ tools }: AiToolsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {tools.map((tool) => (
        <AiToolCard key={tool.id} tool={tool} />
      ))}
    </section>
  );
}
