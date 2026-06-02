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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummaries = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const response = await AiAPI.listSummaries(resourceId);
      const list = response.summaries ?? [];
      setSummaries(list);
      setSelectedId((prev) => {
        if (prev && list.some((s) => s.id === prev)) return prev;
        return list[0]?.id ?? null;
      });
    } catch (err) {
      setError(aiResourceErrorMessage(err));
      setSummaries([]);
      setSelectedId(null);
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
      setSelectedId(response.summary.id);
    } catch (err) {
      setError(aiResourceErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  const selected =
    summaries.find((s) => s.id === selectedId) ?? summaries[0] ?? null;
  const older = selected
    ? summaries.filter((s) => s.id !== selected.id)
    : [];

  return (
    <aside className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface-low">
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

      <div className="flex h-0 min-h-0 flex-1 flex-col overflow-hidden px-4 py-4">
        {error ? <p className="mb-3 shrink-0 text-sm text-error">{error}</p> : null}

        {loadingList ? (
          <p className="text-sm text-on-surface-variant animate-pulse">Loading history…</p>
        ) : summaries.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No summaries yet. Generate one from the indexed course content.
          </p>
        ) : selected ? (
          <>
            {older.length > 0 ? (
              <div className="mb-3 shrink-0">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Previous versions
                </p>
                <div className="max-h-28 space-y-1.5 overflow-y-auto chat-scrollbar">
                  {older.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="w-full rounded-sm border border-outline-variant/10 bg-surface-high/60 px-3 py-2 text-left text-[11px] text-on-surface-variant transition-colors hover:border-primary/30 hover:text-on-surface"
                    >
                      {formatWhen(item.createdAt)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <article className="flex h-0 min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-high/80">
              <p className="shrink-0 border-b border-outline-variant/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                {formatWhen(selected.createdAt)}
              </p>
              <div className="h-0 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 chat-scrollbar">
                <MarkdownContent>{selected.content}</MarkdownContent>
              </div>
            </article>
          </>
        ) : null}
      </div>
    </aside>
  );
}
