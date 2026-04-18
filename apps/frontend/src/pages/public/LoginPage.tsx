import { AuthInput } from "@/components/features/public/AuthInput";
import { Button } from "@/components/ui/Button";
import { AtSign, LockKeyhole, ArrowRight, Terminal } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none opacity-70">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* Level 2 Module: The Console */}
      <div className="relative w-full max-w-[460px] bg-surface-low/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-white/5 shadow-ambient overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-secondary to-brand opacity-80" />
        
        {/* Status Mint Indicator - Section 5 */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
        </div>

        <div className="text-center mb-8 sm:mb-10 pt-4">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/5 bg-surface-high px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/70">Welcome back</span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tighter text-on-surface mb-3 uppercase">
            Sign In
          </h1>
          <p className="mx-auto max-w-[28ch] text-sm text-on-surface-variant leading-relaxed">
            Continue to your personalized learning workspace, access trusted resources, and pick up where you left off.
          </p>
          <p className="mt-4 font-mono text-[10px] text-accent tracking-[0.25em] uppercase opacity-80">
            Access your UniLearn workspace
          </p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-5">
            <AuthInput 
              label="University Email" 
              placeholder="name@university.edu" 
              Icon={AtSign} 
            />
            <AuthInput 
              label="Password" 
              placeholder="Enter your password" 
              type="password" 
              Icon={LockKeyhole} 
            />
          </div>

          <Button variant="primary" className="w-full h-14 group">
            <span className="flex items-center justify-center gap-2 font-display text-sm uppercase tracking-widest font-bold">
              Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </form>

        <div className="mt-10 rounded-xl border border-white/5 bg-surface-high/50 p-4 text-center space-y-4">
          <p className="text-xs text-on-surface-variant/40">New to UniLearn?</p>
          <button className="font-display text-sm font-bold text-on-surface hover:text-brand transition-colors flex items-center gap-2 mx-auto">
            Create an account <ArrowRight size={14} />
          </button>
        </div>

        {/* Footer Terminal Links */}
        <div className="mt-8 flex items-center justify-center gap-8 border-t border-white/5 pt-6">
          <button className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/30 hover:text-on-surface-variant transition-colors">
            Forgot Password?
          </button>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <button className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/30 hover:text-on-surface-variant transition-colors flex items-center gap-1.5">
            <Terminal size={10} /> Help Desk
          </button>
        </div>
      </div>
    </div>
  );
}