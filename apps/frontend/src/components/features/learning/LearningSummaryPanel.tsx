import { useCallback, useEffect, useState } from 'react';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import type { SummaryRecord } from '@unilearn/shared-types';
import { AiAPI, aiResourceErrorMessage } from '@/api/ai';
import { MarkdownContent } from '@/components/features/learning/MarkdownContent';

type LearningSummaryPanelProps = {
  resourceId: string;
  resourceTitle: string;
};

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function LearningSummaryPanel({ resourceId, resourceTitle }: LearningSummaryPanelProps) {
  const [summaries, setSummaries] = useState<SummaryRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummaries = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const response = await AiAPI.listSummaries(resourceId);
      setSummaries(response.summaries ?? []);
    } catch (err) {
      setError(aiResourceErrorMessage(err));
      setSummaries([]);
    } finally {
      setLoadingList(false);
    }
  }, [resourceId]);

  useEffect(() => {
    void loadSummaries();
  }, [loadSummaries]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await AiAPI.generateSummary({ resourceId });
      setSummaries((prev) => [response.summary, ...prev]);
    } catch (err) {
      setError(aiResourceErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-outline-variant/10 bg-surface-low lg:w-[22rem] lg:border-l xl:w-[26rem]">
      <div className="shrink-0 border-b border-outline-variant/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-headline text-sm font-semibold text-white">Summary</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-on-surface-variant">
          AI revision notes for <span className="text-on-surface">{resourceTitle}</span>
        </p>
        <button
          type="button"
          disabled={generating}
          onClick={() => void handleGenerate()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-3 py-2 text-xs font-bold uppercase tracking-widest text-on-primary hover:opacity-90 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {generating ? 'Generating…' : 'Generate summary'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 chat-scrollbar">
        {error ? (
          <p className="text-sm text-error">{error}</p>
        ) : null}

        {loadingList ? (
          <p className="text-sm text-on-surface-variant animate-pulse">Loading history…</p>
        ) : summaries.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No summaries yet. Generate one from the indexed course content.
          </p>
        ) : (
          summaries.map((item) => (
            <article
              key={item.id}
              className="rounded-sm border border-outline-variant/10 bg-surface-high/80 p-4"
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                {formatWhen(item.createdAt)}
              </p>
              <MarkdownContent>{item.content}</MarkdownContent>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
