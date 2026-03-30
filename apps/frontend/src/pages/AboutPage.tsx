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
    <div className="container mx-auto px-6">
      {/* Hero Header for About - Protocol headline-lg (2rem) */}
      <section className="pt-24 pb-16 border-b border-border/10">
        <span className="font-mono text-xs text-brand uppercase tracking-[0.2em] mb-4 block">
          System Version 4.2.1 // Documentation
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-on-surface leading-tight">
          High-Precision <br /> Pedagogy.
        </h1>
        <p className="mt-8 text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          UniLearn is an architectural shift in knowledge transfer. We move beyond general-purpose instruction 
          toward a surgical, AI-synthesized learning environment designed for the technical elite.
        </p>
      </section>

        {/* Product Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-24 border-t border-border/10">
        {/* Product Philosophy Header */}
        <div className="md:col-span-4">
            <h2 className="font-display text-3xl font-bold text-on-surface uppercase tracking-tight">
                Product <br /> Philosophy
            </h2>
            <div className="h-0.5 w-12 bg-brand mt-4 mb-6" />
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
                UniLearn is not a mere document, but a specialized instrument. 
                Our interface reflects the complexity of the subjects it treats.
            </p>
        </div>

        {/* Feature List - Tonal Separation without Borders */}
        <div className="md:col-span-8 space-y-12">
            {[
            { id: "01", label: "Information Density", title: "Rejecting Whitespace for Signal", desc: "We embrace high information density, providing users with a comprehensive HUD that displays progress and technical context simultaneously." },
            { id: "02", label: "The Obsidian Nerve", title: "Visual Tonal Layering", desc: "By utilizing tonal shifts rather than hard borders, we create a focused, distraction-free environment where the content is the only thing that emits light." },
            { id: "03", label: "Semantic Architecture", title: "Engineered Navigation", desc: "Every interaction is designed to minimize cognitive load while maximizing data retention through a hierarchy of operational tools." }
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
            <h2 className="font-display text-3xl font-bold text-on-surface mb-4">AI Synthesis Engine</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
            The "Violet Protocol" governs every interaction, providing real-time synthesis of complex educational datasets.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: BrainCircuit, title: "Adaptive Pathway", color: "text-brand", label: "CORE ATTRIBUTE" },
                { icon: Network, title: "Knowledge Graphs", color: "text-accent", label: "REAL-TIME SYNC" },
                { icon: FlaskConical, title: "Synthesized Labs", color: "text-on-surface", label: "DEPLOY READY" },
            ].map((item, i) => (
            /* Glassmorphism Surface per Protocol Section 2 */
            <Surface key={i} glass className="p-8 text-left h-full border-t border-brand/20">
                <item.icon className={`w-6 h-6 ${item.color} mb-6`} strokeWidth={1.5} />
                <h3 className="font-display text-lg font-bold text-on-surface mb-3">{item.title}</h3>
                <p className="text-sm mb-8 text-on-surface-variant/80">
                Our engine recalibrates your curriculum in real-time based on cognitive performance metrics.
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
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-brand">System Security Ledger</h3>
            </div>
            <div className="p-0">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Trace ID</th>
                    <th className="px-6 py-4 font-medium">Operation</th>
                    <th className="px-6 py-4 font-medium text-right">Status</th>
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