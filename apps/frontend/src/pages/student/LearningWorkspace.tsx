import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  PlayCircle,
  Pause,
  Settings,
  Maximize,
  CheckCircle,
  Send,
  Mic,
  Paperclip,
  User,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Course, Resource } from '@unilearn/shared-types';
import { CourseAPI } from '@/api/course';
import { AiAPI, askResourceErrorMessage } from '@/api/ai';
import { courseThumbUrl } from '@/lib/coursePlaceholders';

export default function Learning() {
  const navigate = useNavigate();
  const { courseId, resourceId } = useParams<{ courseId: string; resourceId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!courseId || !resourceId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [c, r] = await Promise.all([
          CourseAPI.getCourse(courseId),
          CourseAPI.getResourcesByCourseId(courseId),
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
        setMessages([
          {
            role: 'ai',
            content: `You're studying "${resource.title}" in ${c.name}. Ask questions about this material and I'll answer using the indexed course content.`,
          },
        ]);
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

  const activeLesson = useMemo(() => {
    if (!selectedResource) return { title: 'Resource unavailable', duration: '—', type: 'reading' as const };
    return {
      title: selectedResource.title,
      duration: '—',
      type: 'reading' as const,
    };
  }, [selectedResource]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || !resourceId || !selectedResource) return;

    const userMsg = { role: 'user' as const, content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await AiAPI.askResource({ resourceId, question });
      setMessages((prev) => [...prev, { role: 'ai', content: response.answer }]);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('askResource failed', err);
      }
      setMessages((prev) => [...prev, { role: 'ai', content: askResourceErrorMessage(err) }]);
    } finally {
      setIsTyping(false);
    }
  };

  const canSend = Boolean(resourceId && selectedResource && input.trim() && !isTyping);

  if (!courseId || !resourceId) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-on-surface-variant text-sm p-8">
        <p>Invalid learning session.</p>
        <button type="button" className="text-primary underline text-sm mt-4" onClick={() => navigate('/dashboard/courses')}>
          Back to courses
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-on-surface-variant text-sm">
        Loading workspace…
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] gap-4 text-on-surface-variant p-8">
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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] gap-4 text-on-surface-variant p-8">
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

  const thumb = courseThumbUrl(course.id);
  const instructorSeed = course.instructorId;

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100vh-4rem)] min-h-[32rem] flex-col overflow-hidden bg-surface md:-mx-8 md:-my-8 lg:-mx-10 lg:-my-8 lg:flex-row">
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 subtle-scrollbar">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <div className="flex items-center gap-2 font-mono text-[10px] text-on-surface-variant tracking-[0.2em] uppercase">
              <span className="truncate max-w-37.5">{course.name}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-primary truncate">{activeLesson.title}</span>
            </div>

            <div className="aspect-video w-full bg-black rounded-sm relative overflow-hidden group border border-outline-variant/10 shadow-2xl">
              <img src={thumb} alt="" className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={String(selectedResource.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 rounded-full bg-primary/90 text-on-primary flex items-center justify-center scale-100 hover:scale-110 transition-transform shadow-2xl shadow-primary/40"
                >
                  <PlayCircle className="w-12 h-12 fill-current" />
                </a>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-6 bg-linear-to-t from-black/80 to-transparent backdrop-blur-[2px]">
                <Pause className="text-white w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress">
                  <div className="h-full w-1/3 bg-primary relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                  </div>
                </div>
                <span className="font-mono text-[11px] text-white">— / {activeLesson.duration}</span>
                <div className="flex items-center gap-4">
                  <Settings className="text-white w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                  <Maximize className="text-white w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-bold text-white tracking-tight">{activeLesson.title}</h2>
                  <p className="text-on-surface-variant leading-relaxed text-lg max-w-3xl">
                    <span className="flex flex-wrap items-center gap-2">
                      <span>
                        Type <span className="font-mono text-primary">{selectedResource.type}</span> · open the file externally.
                      </span>
                      <a
                        href={String(selectedResource.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary text-sm font-mono underline"
                      >
                        Open <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary px-6 py-3 rounded-sm font-headline font-bold text-sm whitespace-nowrap opacity-50 cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Generate Summary
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-sm font-headline font-bold text-sm whitespace-nowrap opacity-50 cursor-not-allowed"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Generate Quiz
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-outline-variant/10">
                <div className="md:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-headline text-white font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                      <span className="w-1 h-4 bg-primary rounded-full" />
                      This resource
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Materials come from the course repository. An in-app PDF viewer is planned; for now use the open link above.
                      Use the AI assistant on the right for questions about this file.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-surface-low p-6 rounded-sm border border-outline-variant/5">
                    <h4 className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">Instructor</h4>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(instructorSeed)}`}
                        alt=""
                        className="w-12 h-12 rounded-sm grayscale"
                      />
                      <div>
                        <p className="text-sm font-bold text-white font-mono truncate max-w-[140px]">{instructorSeed}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-1">Course</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full mt-6 py-2 border border-outline-variant/10 rounded-sm text-[10px] font-mono uppercase tracking-widest text-on-surface-variant hover:text-white hover:bg-surface-high transition-all"
                      onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                    >
                      View course details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="hidden lg:flex h-full w-100 flex-col border-l border-outline-variant/10 glass-ai xl:w-110">
        <div className="p-4 border-b border-outline-variant/10 bg-surface/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-headline font-bold text-sm text-white uppercase tracking-tighter">AI Learning Assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-on-surface-variant" />
            <div className="h-4 w-px bg-outline-variant/20" />
            <Settings className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 subtle-scrollbar">
          <div className="bg-primary/5 border border-primary/10 p-4 rounded-sm text-[11px] text-on-surface-variant leading-relaxed">
            <span className="text-primary font-bold block mb-1 uppercase tracking-widest">Course context</span>
            Workspace is bound to <span className="font-mono text-white">{course.code}</span>. Studying:{' '}
            <span className="text-white">{activeLesson.title}</span>.
          </div>

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-sm bg-primary/20 shrink-0 flex items-center justify-center">
                  <Sparkles className="text-primary w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`text-[13px] p-3 rounded-sm border leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'ai'
                      ? 'bg-surface-high border-outline-variant/5 rounded-tl-none text-on-surface'
                      : 'bg-primary/10 text-primary border-primary/20 rounded-tr-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-sm bg-surface-high shrink-0 flex items-center justify-center">
                  <User className="text-on-surface-variant w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-sm bg-primary/20 shrink-0 flex items-center justify-center">
                <Sparkles className="text-primary w-4 h-4" />
              </div>
              <div className="bg-surface-high p-4 rounded-sm rounded-tl-none border border-outline-variant/10 w-full">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-outline-variant/10 bg-surface/20 shrink-0">
          <div className="relative flex items-end gap-2 bg-surface-high border border-outline-variant/30 focus-within:border-primary p-3 rounded-sm transition-all shadow-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), void handleSend())}
              disabled={!selectedResource || isTyping}
              className="bg-transparent border-none focus:ring-0 text-[13px] w-full min-h-10 max-h-32 text-on-surface resize-none subtle-scrollbar placeholder:text-on-surface-variant/40 disabled:opacity-50"
              placeholder="Ask about this lesson..."
              rows={1}
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!canSend}
              className="bg-primary text-on-primary p-2 rounded-sm flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Mic className="w-4 h-4 text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
              <Paperclip className="w-4 h-4 text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
            </div>
            <span className="font-mono text-[9px] text-on-surface-variant/30 uppercase tracking-tighter">ENTER TO SEND</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
