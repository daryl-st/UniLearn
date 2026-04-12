import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bolt,
  BrainCircuit,
  Database,
  ExternalLink,
  History,
  Send,
  Sparkles,
  Terminal,
} from 'lucide-react';

type ToolCardData = {
  title: string;
  model: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
};

const tools: ToolCardData[] = [
  {
    title: 'Code Architect',
    model: 'SONNET_3.5',
    description:
      'Refactor legacy infrastructure with dependency mapping and security checks in one workspace.',
    action: 'Launch Console',
    icon: Terminal,
    iconColor: 'text-secondary',
  },
  {
    title: 'Summary Engine',
    model: 'GPT_4O_MINI',
    description:
      'Distill long course docs and research files into concise briefings for rapid review.',
    action: 'Upload File',
    icon: Sparkles,
    iconColor: 'text-primary',
  },
  {
    title: 'Data Query',
    model: 'NL_TO_SQL',
    description:
      'Run natural language database questions across learning analytics without writing SQL.',
    action: 'Query Data',
    icon: Database,
    iconColor: 'text-primary',
  },
];

const sessions = [
  {
    id: '#UL-84920',
    tool: 'Protocol Tutor',
    icon: BrainCircuit,
    subject: 'Ethics in Machine Learning',
    date: '2024-05-22 // 14:20',
    status: 'COMPLETED',
  },
  {
    id: '#UL-84918',
    tool: 'Code Architect',
    icon: Terminal,
    subject: 'API Gateway Redundancy',
    date: '2024-05-22 // 11:05',
    status: 'ARCHIVED',
  },
  {
    id: '#UL-84912',
    tool: 'Summary Engine',
    icon: Sparkles,
    subject: 'Global Supply Chain 2024',
    date: '2024-05-21 // 16:45',
    status: 'COMPLETED',
  },
];

function ToolCard({ tool }: { tool: ToolCardData }) {
  const Icon = tool.icon;

  return (
    <article className="rounded-sm border border-outline-variant/10 bg-surface-low p-6 transition-all hover:border-primary/25 hover:bg-surface-high/40">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-outline-variant/20 bg-surface-high">
          <Icon className={`h-5 w-5 ${tool.iconColor}`} />
        </div>
        <div>
          <h4 className="font-headline text-base font-bold text-white">{tool.title}</h4>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">LLM: {tool.model}</p>
        </div>
      </div>
      <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">{tool.description}</p>
      <button className="w-full rounded-sm border border-outline-variant/20 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary">
        {tool.action}
      </button>
    </article>
  );
}

export default function AIToolPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="space-y-10 p-8 pb-36">
      <section className="rounded-sm border border-outline-variant/10 bg-surface-low p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Neural workspace</p>
            <h2 className="mt-3 font-headline text-3xl font-bold text-white uppercase tracking-tight">AI Tools</h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <p className="text-sm text-on-surface-variant">System ready: Neural Engine v4.2.0 active</p>
            </div>
          </div>
          <button className="w-full rounded-sm border border-outline-variant/20 bg-surface-high px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-on-surface transition-colors hover:border-primary/40 lg:w-auto">
            View Logs
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden xl:col-span-8 rounded-sm border border-outline-variant/10 bg-surface-low p-8"
        >
          <div className="pointer-events-none absolute inset-0 opacity-15">
            <img
              src="https://picsum.photos/seed/tech-network/1200/600"
              alt="Protocol tutor background"
              className="h-full w-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface via-surface/80 to-surface/30" />

          <div className="relative">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-primary/20 bg-primary/10">
              <BrainCircuit className="h-7 w-7 text-primary" />
            </div>
            <span className="rounded-sm border border-secondary/30 bg-secondary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-secondary">
              High Precision
            </span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-white">Protocol Tutor</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Specialized tutoring for complex technical topics. Upload your curriculum and receive targeted walkthroughs,
            practice prompts, and corrective feedback loops.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90">
              Initialize Session
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">Latency: 42ms</span>
          </div>
          </div>
        </motion.article>

        <div className="xl:col-span-4 space-y-6">
          <article className="rounded-sm border border-outline-variant/10 bg-surface-low p-6">
            <h4 className="mb-4 font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary">System Status</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] text-on-surface-variant">NEURAL_LOAD</span>
                <div className="h-1 w-28 overflow-hidden rounded-full bg-surface-high">
                  <div className="h-full w-2/3 bg-primary" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-on-surface-variant">API_HEALTH</span>
                <span className="font-mono text-[11px] text-secondary">OPTIMAL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-on-surface-variant">TOKEN_REMAINING</span>
                <span className="font-mono text-[11px] text-white">842k / 1M</span>
              </div>
            </div>
          </article>

          <article className="rounded-sm border border-outline-variant/10 bg-surface-low p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-white">Quick Summary</h4>
              <History className="h-4 w-4 text-on-surface-variant" />
            </div>
            <p className="text-sm italic leading-relaxed text-on-surface-variant">
              Last summary generated: Research paper on quantum cryptography. Comprehension time reduced by 42%.
            </p>
          </article>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl font-bold tracking-tight text-white">Active Session History</h3>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Sync Active
          </span>
        </div>

        <div className="overflow-x-auto rounded-sm border border-outline-variant/10 bg-surface-low">
          <table className="min-w-190 w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Session ID</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Tool</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Subject</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Date</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {sessions.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-surface-high/40">
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <row.icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-white">{row.tool}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface">{row.subject}</td>
                  <td className="px-6 py-4 font-mono text-[10px] text-on-surface-variant">{row.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                        row.status === 'COMPLETED'
                          ? 'border-secondary/30 bg-secondary/10 text-secondary'
                          : 'border-primary/30 bg-primary/10 text-primary'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant transition-colors hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="fixed bottom-4 right-3 z-50 w-80 max-w-[calc(100%-1rem)] sm:bottom-6 sm:right-6 sm:w-96">
        <div className="flex items-center gap-2 rounded-sm border border-primary/30 bg-surface-low/95 px-2.5 py-2 shadow-[0_20px_40px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary text-on-primary">
            <Bolt className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI anything..."
            className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50"
          />
          <button className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary text-on-primary transition-opacity hover:opacity-90">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
