import { useState, useRef, useEffect } from 'react';
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
  FileText,
  Cpu,
//   ArrowRight,
//   MessageSquare,
  Sparkles
} from 'lucide-react';
// import { getChatResponse } from '@/utils/service';
import { COURSES } from '@/utils/constants';

interface LearningProps {
  courseId: string;
}

// Needs refactrowing - too much hardcoded data and UI logic in one component, but good enough for MVP phase. 
// Will break down into smaller components in future iterations.
// state management is also a bit messy here - will likely migrate to zustand or similar in future iterations as the app grows in complexity.
// export default function Learning({ courseId }: LearningProps) {
export default function Learning() {
  const { courseId }: LearningProps = {
    courseId: "course-001"
  };

  const course = COURSES.find(c => c.id === courseId) || COURSES[0];
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Welcome to the learning workspace for **${course.title}**. I can help you summarize resources, generate quiz questions, and explain concepts.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const activeModuleIdx = 0;
  const activeLessonIdx = 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // try {
    //   const response = await getChatResponse(input, `User is watching course: ${course.title}. Current module: ${course.modules?.[activeModuleIdx]?.title}.`);
    //   setMessages(prev => [...prev, { role: 'ai', content: response }]);
    // } catch (error) {
    //   setMessages(prev => [...prev, { role: 'ai', content: "Error: Could not connect to the AI engine. Please check your API key." }]);
    // } finally {
    //   setIsTyping(false);
    // }
  };

  const activeModule = course.modules?.[activeModuleIdx];
  const activeLesson = activeModule?.lessons[activeLessonIdx];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-surface">
      {/* Main Content */}
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 subtle-scrollbar">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <div className="flex items-center gap-2 font-mono text-[10px] text-on-surface-variant tracking-[0.2em] uppercase">
              <span className="truncate max-w-37.5">{course.title}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-primary truncate">{activeModule?.title}</span>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black rounded-sm relative overflow-hidden group border border-outline-variant/10 shadow-2xl">
              <img 
                src={course.thumbnail} 
                alt="Video" 
                className="w-full h-full object-cover opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-primary/90 text-on-primary flex items-center justify-center scale-100 hover:scale-110 transition-transform shadow-2xl shadow-primary/40">
                  <PlayCircle className="w-12 h-12 fill-current" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-6 bg-linear-to-t from-black/80 to-transparent backdrop-blur-[2px]">
                <Pause className="text-white w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress">
                  <div className="h-full w-1/3 bg-primary relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-white">12:44 / {activeLesson?.duration || '38:20'}</span>
                <div className="flex items-center gap-4">
                  <Settings className="text-white w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                  <Maximize className="text-white w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="font-headline text-3xl font-bold text-white tracking-tight">{activeLesson?.title}</h2>
                  <p className="text-on-surface-variant leading-relaxed text-lg max-w-3xl">
                    In this session, review the selected learning resource, extract key points with AI summary support, and test understanding with a generated quiz.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary px-6 py-3 rounded-sm font-headline font-bold text-sm whitespace-nowrap hover:bg-secondary/20 transition-all">
                    <CheckCircle className="w-4 h-4" />
                    Generate Summary
                  </button>
                  <button className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-sm font-headline font-bold text-sm whitespace-nowrap hover:bg-primary/20 transition-all">
                    <PlayCircle className="w-4 h-4" />
                    Generate Quiz
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-outline-variant/10">
                <div className="md:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-headline text-white font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                      <span className="w-1 h-4 bg-primary rounded-full"></span>
                      Lesson Resources
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-low rounded-sm border border-outline-variant/5 flex items-center gap-4 group cursor-pointer hover:bg-surface-high transition-all">
                        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Open Resource</p>
                          <p className="text-[10px] font-mono text-on-surface-variant mt-1 uppercase">Lecture PDF • 1.2 MB</p>
                        </div>
                      </div>
                      <div className="p-4 bg-surface-low rounded-sm border border-outline-variant/5 flex items-center gap-4 group cursor-pointer hover:bg-surface-high transition-all">
                        <div className="w-10 h-10 rounded-sm bg-secondary/10 flex items-center justify-center text-secondary">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Quiz & Summary History</p>
                          <p className="text-[10px] font-mono text-on-surface-variant mt-1 uppercase">View Attempts • Latest First</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-headline text-white font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                      <span className="w-1 h-4 bg-primary rounded-full"></span>
                      About this Lesson
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      This lesson is part of your course learning flow in UniLearn. Start by reading the core resource, then generate a summary to review key ideas quickly.
                      <br /><br />
                      After that, generate a practice quiz and review feedback to identify topics that need more study.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-surface-low p-6 rounded-sm border border-outline-variant/5">
                    <h4 className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">Instructor</h4>
                    <div className="flex items-center gap-3">
                      <img 
                        src={course.instructorImage} 
                        alt={course.instructor} 
                        className="w-12 h-12 rounded-sm grayscale"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{course.instructor}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-1">Course Instructor</p>
                      </div>
                    </div>
                    <button className="w-full mt-6 py-2 border border-outline-variant/10 rounded-sm text-[10px] font-mono uppercase tracking-widest text-on-surface-variant hover:text-white hover:bg-surface-high transition-all">
                      View Course Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Copilot Panel */}
      <aside className="hidden lg:flex h-full w-100 flex-col border-l border-outline-variant/10 glass-ai xl:w-110">
        <div className="p-4 border-b border-outline-variant/10 bg-surface/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="font-headline font-bold text-sm text-white uppercase tracking-tighter">AI Learning Assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-on-surface-variant" />
            <div className="h-4 w-px bg-outline-variant/20"></div>
            <Settings className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 subtle-scrollbar">
          <div className="bg-primary/5 border border-primary/10 p-4 rounded-sm text-[11px] text-on-surface-variant leading-relaxed">
            <span className="text-primary font-bold block mb-1 uppercase tracking-widest">Course Context Active</span>
            I am currently synchronized with **{activeLesson?.title}**. Ask me to summarize this resource, generate practice questions, or explain difficult concepts.
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
                <div className={`text-[13px] p-3 rounded-sm border leading-relaxed ${
                  msg.role === 'ai' 
                    ? 'bg-surface-high border-outline-variant/5 rounded-tl-none text-on-surface' 
                    : 'bg-primary/10 text-primary border-primary/20 rounded-tr-none'
                }`}>
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
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
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
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="bg-transparent border-none focus:ring-0 text-[13px] w-full min-h-10 max-h-32 text-on-surface resize-none subtle-scrollbar placeholder:text-on-surface-variant/40" 
              placeholder="Ask about this lesson..." 
              rows={1}
            />
            <button 
              onClick={handleSend}
              className="bg-primary text-on-primary p-2 rounded-sm flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
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
