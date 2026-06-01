import { useCallback, useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Difficulty, QuizRecord } from '@unilearn/shared-types';
import { AiAPI, aiResourceErrorMessage } from '@/api/ai';

type LearningQuizPanelProps = {
  resourceId: string;
  resourceTitle: string;
};

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

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

export function LearningQuizPanel({ resourceId, resourceTitle }: LearningQuizPanelProps) {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [quizzes, setQuizzes] = useState<QuizRecord[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [loadingList, setLoadingList] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const response = await AiAPI.listQuizzes(resourceId);
      setQuizzes(response.quizzes ?? []);
    } catch (err) {
      setError(aiResourceErrorMessage(err));
      setQuizzes([]);
    } finally {
      setLoadingList(false);
    }
  }, [resourceId]);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await AiAPI.generateQuiz({ resourceId, difficulty });
      setQuizzes((prev) => [
        {
          ...response.quiz,
          attemptCount: 0,
        },
        ...prev,
      ]);
      if (courseId) {
        navigate(
          `/dashboard/learning/${courseId}/${resourceId}/quiz/${response.quiz.id}`,
        );
      }
    } catch (err) {
      setError(aiResourceErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  const openQuiz = (quizId: string) => {
    if (!courseId) return;
    navigate(`/dashboard/learning/${courseId}/${resourceId}/quiz/${quizId}`);
  };

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-outline-variant/10 bg-surface-low lg:w-[22rem] lg:border-l xl:w-[26rem]">
      <div className="shrink-0 border-b border-outline-variant/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-headline text-sm font-semibold text-white">Quiz</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-on-surface-variant">
          Practice questions for <span className="text-on-surface">{resourceTitle}</span>
        </p>
        <label className="mt-3 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="mt-1 w-full rounded-sm border border-outline-variant/20 bg-surface-high px-2 py-2 text-xs text-on-surface"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>
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
          {generating ? 'Generating…' : 'Generate quiz'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 chat-scrollbar">
        {error ? <p className="text-sm text-error">{error}</p> : null}

        {loadingList ? (
          <p className="text-sm text-on-surface-variant animate-pulse">Loading quizzes…</p>
        ) : quizzes.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No quizzes yet. Generate one from indexed course content.
          </p>
        ) : (
          quizzes.map((item) => (
            <article
              key={item.id}
              className="rounded-sm border border-outline-variant/10 bg-surface-high/80 p-4"
            >
              <p className="font-headline text-sm font-semibold text-on-surface">{item.title}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                {item.difficulty} · {formatWhen(item.createdAt)}
                {item.attemptCount != null && item.attemptCount > 0
                  ? ` · ${item.attemptCount} attempt(s)`
                  : ''}
              </p>
              <button
                type="button"
                onClick={() => openQuiz(item.id)}
                className="mt-3 w-full rounded-sm border border-primary/30 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10"
              >
                {item.attemptCount && item.attemptCount > 0 ? 'Retake' : 'Take quiz'}
              </button>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
