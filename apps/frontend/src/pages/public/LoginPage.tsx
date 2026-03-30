import { AuthInput } from "@/components/features/public_pages/AuthInput";
import { Button } from "@/components/ui/Button";
import { AtSign, LockKeyhole, ArrowRight, Terminal } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      {/* Level 2 Module: The Console */}
      <div className="w-full max-w-[420px] bg-surface-low p-10 rounded-lg border border-white/5 shadow-ambient relative overflow-hidden">
        
        {/* Status Mint Indicator - Section 5 */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
        </div>

        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold tracking-tighter text-on-surface mb-2 uppercase">
            Login
          </h1>
          <p className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase opacity-80">
            System Auth Protocol V.2.49
          </p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-5">
            <AuthInput 
              label="Identification Handle" 
              placeholder="ENTITY_ID" 
              Icon={AtSign} 
            />
            <AuthInput 
              label="Access Cipher" 
              placeholder="••••••••••••" 
              type="password" 
              Icon={LockKeyhole} 
            />
          </div>

          <Button variant="primary" className="w-full h-14 group">
            <span className="flex items-center justify-center gap-2 font-display text-sm uppercase tracking-widest font-bold">
              Enter Protocol <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </form>

        <div className="mt-12 text-center space-y-4">
          <p className="text-xs text-on-surface-variant/40">New to the ecosystem?</p>
          <button className="font-display text-sm font-bold text-on-surface hover:text-brand transition-colors flex items-center gap-2 mx-auto">
            Register Account <ArrowRight size={14} />
          </button>
        </div>

        {/* Footer Terminal Links */}
        <div className="mt-16 flex items-center justify-center gap-8 border-t border-white/5 pt-6">
          <button className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/30 hover:text-on-surface-variant transition-colors">
            Reset Cipher
          </button>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <button className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/30 hover:text-on-surface-variant transition-colors flex items-center gap-1.5">
            <Terminal size={10} /> Help Terminal
          </button>
        </div>
      </div>
    </div>
  );
}