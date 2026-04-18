import { Button } from "../../ui/Button";
import { Send } from "lucide-react";

export function ContactForm() {
  return (
    <div className="bg-[#1B1B1D] p-8 rounded-lg border border-[#49454f]/15 shadow-ambient">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Full Name</label>
            <input type="text" placeholder="Your full name" className="w-full bg-[#2A2A2C] border-none rounded-sm p-3 text-on-surface focus:ring-1 focus:ring-brand outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">University Email</label>
            <input type="email" placeholder="name@university.edu" className="w-full bg-[#2A2A2C] border-none rounded-sm p-3 text-on-surface focus:ring-1 focus:ring-brand outline-none transition-all" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Inquiry Topic</label>
          <select className="w-full bg-[#2A2A2C] border-none rounded-sm p-3 text-on-surface outline-none appearance-none cursor-pointer">
            <option>Course Access</option>
            <option>Missing Resource</option>
            <option>General Question</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Message</label>
          <textarea rows={5} placeholder="Describe your issue or request..." className="w-full bg-[#2A2A2C] border-none rounded-sm p-3 text-on-surface focus:ring-1 focus:ring-brand outline-none resize-none transition-all" />
        </div>

        <Button variant="primary" className="w-full py-6 text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Submit Inquiry
        </Button>
      </form>
    </div>
  );
}