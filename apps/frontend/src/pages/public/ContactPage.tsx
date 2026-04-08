import { ContactForm } from "@/components/features/public/ContactForm"; 
import { AtSign, Share2, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-24">
      {/* Page Header */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">System Online</span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-on-surface mb-6">
          Connect with the <br /> <span className="text-brand">Protocol Team</span>
        </h1>
        <p className="text-on-surface-variant max-w-xl leading-relaxed">
          Direct integration with our support nodes. Reach out for technical inquiries, partnership protocols, or system access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form & Node Metadata */}
        <div className="lg:col-span-7 space-y-8">
          <ContactForm />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { Icon: AtSign, label: "DIRECT.MAIL", val: "ops@unilearn.io" },
              { Icon: Share2, label: "NETWORK.ID", val: "AS-99281-UI" },
              { Icon: Globe, label: "ORIGIN.NODE", val: "ADDIS ABABA, AA" }
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
             <img src="/path-to-your-figma-texture.jpg" className="object-cover w-full h-full opacity-60" alt="network-mesh" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-brand" />
              <h3 className="font-display text-lg font-bold">Knowledge Base</h3>
            </div>
            
            <div className="space-y-8">
              {[
                { q: "How do I access enterprise protocols?", a: "Enterprise access requires a verified institutional domain. Contact our sales node via the form for custom deployment options." },
                { q: "Is the certification system decentralized?", a: "Yes, all UniLearn credentials are minted on the protocol layer, ensuring immutable proof of knowledge." }
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
             <p className="font-mono text-[10px] text-accent mb-1">/system_message</p>
             <p className="text-[11px] text-on-surface-variant leading-relaxed italic">
               For immediate critical infrastructure failures, please use the high-priority uplink available in your dashboard.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}