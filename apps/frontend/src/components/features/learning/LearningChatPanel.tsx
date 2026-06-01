import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, User } from 'lucide-react';
import { MarkdownContent } from '@/components/features/learning/MarkdownContent';

export type ChatMessage = { role: 'ai' | 'user'; content: string };

type LearningChatPanelProps = {
  courseCode: string;
  resourceTitle: string;
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isTyping: boolean;
  canSend: boolean;
};

export function LearningChatPanel({
  courseCode,
  resourceTitle,
  messages,
  input,
  onInputChange,
  onSend,
  isTyping,
  canSend,
}: LearningChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <aside className="flex h-full min-h-0 w-full flex-1 flex-col bg-surface-low">
      <div className="shrink-0 border-b border-outline-variant/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary/80" />
          <span className="font-headline text-sm font-semibold text-white">Assistant</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-on-surface-variant">
          <span className="font-mono text-primary/90">{courseCode}</span>
          <span className="mx-1.5 text-on-surface-variant/40">·</span>
          <span className="text-on-surface">{resourceTitle}</span>
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 chat-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'ai' && (
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[88%] px-4 py-3 ${
                msg.role === 'ai'
                  ? 'rounded-2xl rounded-tl-md border border-outline-variant/10 bg-surface-high/80 text-on-surface'
                  : 'rounded-2xl rounded-tr-md border border-primary/25 bg-primary/15 text-on-surface'
              }`}
            >
              {msg.role === 'ai' ? (
                <MarkdownContent>{msg.content}</MarkdownContent>
              ) : (
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-on-surface">
                  {msg.content}
                </p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-high">
                <User className="h-3.5 w-3.5 text-on-surface-variant" />
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="rounded-2xl rounded-tl-md border border-outline-variant/10 bg-surface-high/80 px-4 py-3">
              <div className="flex gap-1">
                <motion.span
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-1.5 w-1.5 rounded-full bg-primary/70"
                />
                <motion.span
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-primary/70"
                />
                <motion.span
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
                  className="h-1.5 w-1.5 rounded-full bg-primary/70"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-outline-variant/10 p-4">
        <div className="flex items-end gap-2 rounded-lg border border-outline-variant/20 bg-surface-high/60 p-2 focus-within:border-primary/40 transition-colors">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
            disabled={isTyping}
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-on-surface placeholder:text-on-surface-variant/45 focus:outline-none disabled:opacity-50 chat-scrollbar"
            placeholder="Ask about this material..."
            rows={1}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/40">
          Enter to send
        </p>
      </div>
    </aside>
  );
}
