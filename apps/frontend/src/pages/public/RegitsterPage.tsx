import { AuthInput } from "@/components/features/public/AuthInput";
import { Button } from "@/components/ui/Button";
import { User, Mail, LaptopMinimal, LockKeyhole } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none opacity-70">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* System Status Pip - Section 5 Metadata */}
      <div className="relative z-10 mb-8 flex items-center gap-2 bg-[#1B1B1D] px-3 py-1 rounded-full border border-white/5 shadow-ambient">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4EDEA3] animate-pulse shadow-[0_0_8px_#4EDEA3]" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#4EDEA3]">
          Account Setup Available
        </span>
      </div>

      {/* Level 1 Console: Surface-Container-Low */}
      <div className="relative z-10 w-full bg-[#1B1B1D] p-8 sm:p-12 rounded-2xl shadow-ambient border border-white/5" style={{ maxWidth: "460px" }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand via-secondary to-brand opacity-80 rounded-t-2xl" />
        <div className="text-center mb-8 sm:mb-10 pt-3">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/5 bg-surface-high px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/70">Join the platform</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface uppercase mb-3">
            Create Your Account
          </h1>
          <p className="mx-auto max-w-[30ch] text-on-surface-variant text-sm leading-relaxed">
            Use your university details to join UniLearn as a student or instructor.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AuthInput 
            label="Full Name" 
            placeholder="Your full name"
            type="text" 
            Icon={User} 
          />
          <AuthInput 
            label="University Email" 
            placeholder="name@university.edu" 
            type="email"
            Icon={Mail} 
          />
          <AuthInput 
            label="Password" 
            placeholder="Create a password" 
            Icon={LockKeyhole} 
          />

          <Button variant="primary" className="w-full h-14 mt-4 group">
            <span className="flex items-center justify-center gap-3 font-display text-sm uppercase tracking-widest font-bold">
              Create Account <LaptopMinimal size={18} className="group-hover:rotate-12 transition-transform" />
            </span>
          </Button>
        </form>

        <div className="mt-8 rounded-xl border border-white/5 bg-surface-high/50 p-4 text-center">
          <button className="text-xs text-on-surface-variant/60 hover:text-on-surface transition-colors">
            Already have an account? <span className="text-on-surface font-bold ml-1">Sign in</span>
          </button>
        </div>
      </div>

      {/* Technical Footer Metadata - Section 3 System Typeface */}
      <div className="relative z-10 mt-10 w-full flex justify-between items-center px-4 font-mono text-[8px] uppercase tracking-[0.3em] text-on-surface-variant/20" style={{ maxWidth: "500px" }}>
        <div className="flex gap-6">
          <span>Access: Web</span>
          <span>Role: Student or Instructor</span>
        </div>
        <span>Request ID: UNL-2026-04</span>
      </div>
    </div>
  );
}