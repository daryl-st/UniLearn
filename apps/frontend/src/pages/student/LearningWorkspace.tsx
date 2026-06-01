import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LearningQuizPanel } from '@/components/features/learning/LearningQuizPanel';
import { LearningSummaryPanel } from '@/components/features/learning/LearningSummaryPanel';
import type { ChatMessageRecord, Resource } from '@unilearn/shared-types';
import { CourseAPI, type CourseWithInstructor } from '@/api/course';
import { AiAPI, askResourceErrorMessage } from '@/api/ai';
import { ResourcePdfViewer } from '@/components/features/learning/ResourcePdfViewer';
import { LearningChatPanel } from '@/components/features/learning/LearningChatPanel';

export default function Learning() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courseId, resourceId } = useParams<{ courseId: string; resourceId: string }>();
  const [sidePanel, setSidePanel] = useState<'chat' | 'summary' | 'quiz'>(() => {
    const panel = searchParams.get('panel');
    if (panel === 'summary') return 'summary';
    if (panel === 'quiz') return 'quiz';
    return 'chat';
  });

  const [course, setCourse] = useState<CourseWithInstructor | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const welcomeMessage = (resourceTitle: string, courseName: string) =>
    `You're studying "${resourceTitle}" in ${courseName}. Ask questions about this material and I'll answer using the indexed course content.`;

  const mapChatRecords = (records: ChatMessageRecord[]) =>
    records.map((m) => ({
      role: (m.role === 'user' ? 'user' : 'ai') as 'ai' | 'user',
      content: m.content,
    }));

  useEffect(() => {
    if (!courseId || !resourceId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [c, r, chat] = await Promise.all([
          CourseAPI.getCourse(courseId),
          CourseAPI.getResourcesByCourseId(courseId),
          AiAPI.getChat(resourceId).catch(() => ({ messages: [] as ChatMessageRecord[] })),
        ]);
        if (cancelled) return;

        const list = Array.isArray(r) ? r : [];
        const resource = list.find((item) => item.id === resourceId) ?? null;

        if (!resource) {
          setError('Resource not found for this course.');
          setCourse(c);
          setSelectedResource(null);
          return;
        }

        setCourse(c);
        setSelectedResource(resource);

        const persisted = mapChatRecords(chat.messages ?? []);
        if (persisted.length > 0) {
          setMessages(persisted);
        } else {
          setMessages([
            {
              role: 'ai',
              content: welcomeMessage(resource.title, c.name),
            },
          ]);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, resourceId]);

  const resourceTitle = useMemo(() => selectedResource?.title ?? 'Resource', [selectedResource]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || !resourceId || !selectedResource) return;

    setInput('');
    setIsTyping(true);

    try {
      const response = await AiAPI.askResource({ resourceId, question });
      if (response.messages && response.messages.length > 0) {
        setMessages(mapChatRecords(response.messages));
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: question },
          { role: 'ai', content: response.answer },
        ]);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('askResource failed', err);
      }
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'ai', content: askResourceErrorMessage(err) },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const canSend = Boolean(resourceId && selectedResource && input.trim() && !isTyping);

  if (!courseId || !resourceId) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-on-surface-variant text-sm p-8">
        <p>Invalid learning session.</p>
        <button type="button" className="text-primary underline text-sm mt-4" onClick={() => navigate('/dashboard/courses')}>
          Back to courses
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-10 w-72 rounded-full bg-surface-low animate-pulse" />
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div className="h-[28rem] rounded-[1.75rem] bg-surface-low animate-pulse" />
              <div className="h-16 rounded-3xl bg-surface-low animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-[28rem] rounded-[1.75rem] bg-surface-low animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 text-on-surface-variant p-8">
        <p className="text-error text-sm">{error || 'Course not found'}</p>
        <button
          type="button"
          className="text-primary underline text-sm"
          onClick={() => navigate(courseId ? `/dashboard/courses/${courseId}` : '/dashboard/courses')}
        >
          Back to course
        </button>
      </div>
    );
  }

  if (!selectedResource) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 text-on-surface-variant p-8">
        <p className="text-error text-sm">Resource not found for this course.</p>
        <button
          type="button"
          className="text-primary underline text-sm"
          onClick={() => navigate(`/dashboard/courses/${course.id}`)}
        >
          Back to course
        </button>
      </div>
    );
  }

  const instructorName = course.instructorName?.trim() || 'Instructor';
  const instructorSeed = instructorName;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:h-[calc(100dvh-7rem)] lg:max-h-[calc(100dvh-7rem)] lg:flex-row">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto subtle-scrollbar px-4 py-4 md:px-6 md:py-5">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                <span className="truncate max-w-[12rem]">{course.name}</span>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span className="truncate text-primary">{resourceTitle}</span>
              </div>
              <button
                type="button"
                className="shrink-0 text-[11px] font-mono uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => navigate(`/dashboard/courses/${course.id}`)}
              >
                View course
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-on-surface-variant">
              <span>
                <span className="font-mono text-primary">{selectedResource.type}</span>
              </span>
              <a
                href={String(selectedResource.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:opacity-90"
              >
                Open in new tab
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="hidden sm:inline text-on-surface-variant/40">|</span>
              <span className="inline-flex items-center gap-2">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(instructorSeed)}`}
                  alt=""
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-on-surface">{instructorName}</span>
              </span>
            </div>

            <ResourcePdfViewer
              resourceId={selectedResource.id}
              fileUrl={String(selectedResource.fileUrl)}
              title={selectedResource.title}
              type={selectedResource.type}
              status={selectedResource.status}
            />
          </div>
        </div>
      </section>

      <div className="flex max-h-[min(50dvh,calc(100dvh-7rem))] min-h-0 w-full flex-col overflow-hidden border-t border-outline-variant/10 lg:h-[calc(100dvh-7rem)] lg:max-h-[calc(100dvh-7rem)] lg:shrink-0 lg:border-t-0 lg:max-w-[26rem]">
        <div className="flex shrink-0 border-b border-outline-variant/10">
          <button
            type="button"
            onClick={() => setSidePanel('chat')}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              sidePanel === 'chat'
                ? 'bg-surface-high text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setSidePanel('summary')}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              sidePanel === 'summary'
                ? 'bg-surface-high text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Summary
          </button>
          <button
            type="button"
            onClick={() => setSidePanel('quiz')}
            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              sidePanel === 'quiz'
                ? 'bg-surface-high text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Quiz
          </button>
        </div>
        <div className="flex h-0 min-h-0 flex-1 flex-col overflow-hidden">
          {sidePanel === 'chat' ? (
            <LearningChatPanel
              courseCode={course.code}
              resourceTitle={resourceTitle}
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSend={() => void handleSend()}
              isTyping={isTyping}
              canSend={canSend}
            />
          ) : sidePanel === 'summary' && resourceId ? (
            <LearningSummaryPanel resourceId={resourceId} resourceTitle={resourceTitle} />
          ) : sidePanel === 'quiz' && resourceId ? (
            <LearningQuizPanel resourceId={resourceId} resourceTitle={resourceTitle} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
