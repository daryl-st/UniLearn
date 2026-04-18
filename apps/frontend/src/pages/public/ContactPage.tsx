import { ContactForm } from "@/components/features/public/ContactForm"; 
import { AtSign, Share2, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-24 lg:px-12">
      {/* Page Header */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Support Channel Open</span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-on-surface mb-6">
          Contact UniLearn <br /> <span className="text-brand">Support Team</span>
        </h1>
        <p className="text-on-surface-variant max-w-xl leading-relaxed">
          Send questions, feedback, or access requests through the form and the support team will respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form & Node Metadata */}
        <div className="lg:col-span-7 space-y-8">
          <ContactForm />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { Icon: AtSign, label: "SUPPORT.EMAIL", val: "support@unilearn.edu" },
              { Icon: Share2, label: "DEPARTMENT", val: "Computer Science" },
              { Icon: Globe, label: "LOCATION", val: "Addis Ababa, Ethiopia" }
            ].map((node) => (
              <div key={node.label} className="bg-[#1B1B1D] p-4 rounded-sm border-l border-accent/30">
                <node.Icon className="w-4 h-4 text-accent mb-3" />
                <p className="font-mono text-[9px] text-on-surface-variant/40 mb-1">{node.label}</p>
                <p className="font-mono text-[11px] text-on-surface">{node.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Knowledge Base & Visuals */}
        <div className="lg:col-span-5 space-y-10">
          <div className="rounded-lg overflow-hidden h-48 bg-surface-high relative border border-border/10">
             <img src="/path-to-your-figma-texture.jpg" className="object-cover w-full h-full opacity-60" alt="support workspace" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-brand" />
              <h3 className="font-display text-lg font-bold">Quick Help</h3>
            </div>
            
            <div className="space-y-8">
              {[
                { q: "How do I access course resources?", a: "Sign in with your university account, then open the course you need from the catalog or dashboard." },
                { q: "Who should I contact for missing files?", a: "Use this form to report the issue and include the course code, file name, and any error message you saw." }
              ].map((faq, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-sans text-sm font-semibold text-on-surface group-hover:text-brand transition-colors">{faq.q}</p>
                    <span className="text-on-surface-variant text-xs">⌄</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Message Box (Protocol Style) */}
          <div className="p-4 bg-surface-high/30 border-l-2 border-accent/50 rounded-r-sm">
             <p className="font-mono text-[10px] text-accent mb-1">/support_note</p>
             <p className="text-[11px] text-on-surface-variant leading-relaxed italic">
               For urgent access issues, please include your course code and university email so the team can respond faster.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}