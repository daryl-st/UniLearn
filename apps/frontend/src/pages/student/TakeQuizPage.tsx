import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { QuestionForTaking, QuizQuestionResult, QuizRecord } from '@unilearn/shared-types';
import { AiAPI, aiResourceErrorMessage } from '@/api/ai';

function isMcq(options: QuestionForTaking['options']): boolean {
  return options != null && typeof options === 'object' && Object.keys(options).length > 0;
}

export default function TakeQuizPage() {
  const navigate = useNavigate();
  const { courseId, resourceId, quizId } = useParams<{
    courseId: string;
    resourceId: string;
    quizId: string;
  }>();

  const [quiz, setQuiz] = useState<QuizRecord | null>(null);
  const [questions, setQuestions] = useState<QuestionForTaking[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QuizQuestionResult[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const loadQuiz = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await AiAPI.getQuiz(quizId);
      setQuiz(response.quiz);
      setQuestions(response.questions ?? []);
      setAnswers({});
      setResults(null);
      setScore(null);
      setAttemptId(null);
    } catch (err) {
      setError(aiResourceErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const handleSubmit = async () => {
    if (!quizId) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      }));
      const response = await AiAPI.submitQuiz(quizId, payload);
      setResults(response.attempt.results ?? []);
      setScore(response.attempt.score);
      setAttemptId(response.attempt.id);
    } catch (err) {
      setError(aiResourceErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const workspaceUrl =
    courseId && resourceId
      ? `/dashboard/learning/${courseId}/${resourceId}?panel=quiz`
      : '/dashboard/courses';

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8">
        <p className="text-error">{error ?? 'Quiz not found.'}</p>
        <Link to={workspaceUrl} className="mt-4 inline-block text-primary text-sm">
          Back to learning workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(workspaceUrl)}
        className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <header className="mb-8 border-b border-outline-variant/10 pb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">{quiz.title}</h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
          {quiz.difficulty} · {questions.length} questions
        </p>
      </header>

      {error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

      {results && score !== null ? (
        <div className="space-y-6">
          <div className="rounded-sm border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Your score
            </p>
            <p className="mt-2 font-headline text-4xl font-bold text-primary">{score}%</p>
            {attemptId ? (
              <p className="mt-2 font-mono text-[10px] text-on-surface-variant">
                Attempt saved · {attemptId.slice(0, 8)}…
              </p>
            ) : null}
          </div>

          <ul className="space-y-4">
            {results.map((r) => (
              <li
                key={r.questionId}
                className={`rounded-sm border p-4 ${
                  r.isCorrect
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-error/30 bg-error/5'
                }`}
              >
                <div className="flex items-start gap-2">
                  {r.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-error" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-on-surface">{r.content}</p>
                    <p className="mt-2 text-[13px] text-on-surface-variant">
                      Your answer: <span className="text-on-surface">{r.userAnswer || '—'}</span>
                    </p>
                    {!r.isCorrect ? (
                      <p className="mt-1 text-[13px] text-on-surface-variant">
                        Correct: <span className="text-primary">{r.correctAnswer}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => navigate(workspaceUrl)}
            className="w-full rounded-sm bg-primary py-3 text-xs font-bold uppercase tracking-widest text-on-primary"
          >
            Done
          </button>
        </div>
      ) : (
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          {questions.map((q, index) => (
            <fieldset
              key={q.id}
              className="rounded-sm border border-outline-variant/10 bg-surface-high/50 p-5"
            >
              <legend className="mb-4 text-sm font-semibold text-on-surface">
                {index + 1}. {q.content}
              </legend>
              {isMcq(q.options) ? (
                <div className="space-y-2">
                  {Object.entries(q.options as Record<string, string>).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-3 rounded-sm border border-outline-variant/10 px-3 py-2 hover:border-primary/30"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={key}
                        checked={answers[q.id] === key}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: key }))
                        }
                        className="text-primary"
                      />
                      <span className="text-sm text-on-surface">
                        <span className="font-mono font-bold text-primary">{key}.</span> {label}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[q.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="Your answer"
                  className="w-full rounded-sm border border-outline-variant/20 bg-surface-low px-3 py-2 text-sm text-on-surface"
                />
              )}
            </fieldset>
          ))}

          <button
            type="submit"
            disabled={submitting || questions.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-3 text-xs font-bold uppercase tracking-widest text-on-primary disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? 'Submitting…' : 'Submit answers'}
          </button>
        </form>
      )}
    </div>
  );
}
