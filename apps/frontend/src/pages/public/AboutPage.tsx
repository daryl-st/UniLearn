import { Surface } from "@/components/ui/Surface";
import { Badge } from "@/components/ui/Badge";
import { Network, BrainCircuit, FlaskConical } from "lucide-react";

const logs = [
  { id: "LOG-992", event: "Neural Sync", status: "Verified", latency: "0.2ms" },
  { id: "LOG-991", event: "Vector Mapping", status: "Active", latency: "0.1ms" },
  { id: "LOG-990", event: "Protocol Handshake", status: "Verified", latency: "0.4ms" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-24 lg:px-12">
      {/* Hero Header for About - Protocol headline-lg (2rem) */}
      <section className="pt-24 pb-16 border-b border-border/10">
        <span className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4 block">
          UniLearn Department Platform // Overview
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-on-surface leading-tight">
          About <br /> UniLearn.
        </h1>
        <p className="mt-8 text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          UniLearn centralizes course resources and supports revision with AI-generated summaries and quizzes so students, instructors, and administrators can work from one organized academic space.
        </p>
      </section>

        {/* Product Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-24 border-t border-border/10">
        {/* Product Philosophy Header */}
        <div className="md:col-span-4">
            <h2 className="font-display text-3xl font-bold text-on-surface uppercase tracking-tight">
                Core <br /> Capabilities
            </h2>
            <div className="h-0.5 w-12 bg-brand mt-4 mb-6" />
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
                The platform is designed to keep course materials organized, access controlled, and study support available in the same workflow.
            </p>
        </div>

        {/* Feature List - Tonal Separation without Borders */}
        <div className="md:col-span-8 space-y-12">
            {[
            { id: "01", label: "Centralized Repository", title: "Single Source of Truth", desc: "Course materials are organized by department, academic year, and course so students can find the latest trusted version quickly." },
            { id: "02", label: "AI Learning Support", title: "Summaries and Quizzes", desc: "Students can request concise summaries and generate quizzes directly from selected resources to support active revision." },
            { id: "03", label: "Role-Based Operations", title: "Controlled Access", desc: "Students, instructors, and administrators see only the tools and responsibilities relevant to their role in the platform." }
            ].map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 group">
                <span className="md:col-span-1 font-mono text-xs text-brand/60 pt-1">
                {item.id} /
                </span>
                <div className="md:col-span-11">
                <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-2 block">
                    {item.label}
                </span>
                <h3 className="font-display text-xl font-bold text-on-surface mb-3 group-hover:text-brand transition-colors">
                    {item.title}
                </h3>
                <p className="text-sm max-w-xl">{item.desc}</p>
                </div>
            </div>
            ))}
        </div>
      </div>
      
      <section className="py-24">
        {/* <h2 className="font-display text-2xl font-bold text-on-surface mb-12">Foundation & Architecture</h2> */}
        <section className="py-24 text-center">
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-on-surface mb-4">Why UniLearn Exists</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
          The platform reduces scattered file sharing, improves access to trusted learning materials, and gives students direct revision support from the same course content.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            { icon: BrainCircuit, title: "AI Summarization", color: "text-brand", label: "STUDY SUPPORT" },
            { icon: Network, title: "Resource Organization", color: "text-accent", label: "CENTRALIZED ACCESS" },
            { icon: FlaskConical, title: "Quiz Feedback", color: "text-on-surface", label: "PROGRESS TRACKING" },
            ].map((item, i) => (
            /* Glassmorphism Surface per Protocol Section 2 */
            <Surface key={i} glass className="p-8 text-left h-full border-t border-brand/20">
                <item.icon className={`w-6 h-6 ${item.color} mb-6`} strokeWidth={1.5} />
                <h3 className="font-display text-lg font-bold text-on-surface mb-3">{item.title}</h3>
                <p className="text-sm mb-8 text-on-surface-variant/80">
            UniLearn helps students understand material faster, organize course files clearly, and review performance over time.
                </p>
                <Badge variant={item.color.includes('accent') ? 'status' : 'neutral'}>
                {item.label}
                </Badge>
            </Surface>
            ))}
        </div>
        </section>
      </section>

      {/* High-Density Table Example */}
      <section className="pb-24">
        <Surface className="overflow-hidden border-t border-brand/20">
            <div className="bg-surface-high/50 px-6 py-3 border-b border-border/5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-brand">Platform Snapshot</h3>
            </div>
            <div className="p-0">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Item ID</th>
              <th className="px-6 py-4 font-medium">Capability</th>
              <th className="px-6 py-4 font-medium text-right">State</th>
                    </tr>
                </thead>
                <tbody className="text-sm font-mono">
                    {logs.map((log, i) => (
                    <tr 
                        key={log.id} 
                        className={`hover:bg-brand/5 transition-colors ${i % 2 === 0 ? 'bg-surface-low/30' : ''}`}
                    >
                        <td className="px-6 py-4 text-on-surface-variant">{log.id}</td>
                        <td className="px-6 py-4 text-on-surface">{log.event}</td>
                        <td className="px-6 py-4 text-right text-accent">{log.status}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </Surface>
      </section>
    </div>
  );
}