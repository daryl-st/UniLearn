import { AuthInput } from "@/components/features/public_pages/AuthInput";
import { Button } from "@/components/ui/Button";
import { User, Mail, ShieldAlert, LaptopMinimal, LockKeyhole } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6">
      {/* System Status Pip - Section 5 Metadata */}
      <div className="mb-8 flex items-center gap-2 bg-[#1B1B1D] px-3 py-1 rounded-full border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4EDEA3] animate-pulse shadow-[0_0_8px_#4EDEA3]" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#4EDEA3]">
          System Online: V4.2.0
        </span>
      </div>

      {/* Level 1 Console: Surface-Container-Low */}
      <div className="w-full max-w-[460px] bg-[#1B1B1D] p-12 rounded-lg shadow-ambient relative">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface uppercase mb-3">
            Initialize Account
          </h1>
          <p className="text-on-surface-variant text-sm">
            Provisioning a new node in the UniLearn Protocol
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AuthInput 
            label="Identity_String" 
            placeholder="Full Name"
            type="text" 
            Icon={User} 
          />
          <AuthInput 
            label="Network_Address" 
            placeholder="Email Address" 
            type="email"
            Icon={Mail} 
          />
          <AuthInput 
            label="Access Cipher" 
            placeholder="********" 
            Icon={LockKeyhole} 
          />

          <Button variant="primary" className="w-full h-14 mt-4 group">
            <span className="flex items-center justify-center gap-3 font-display text-sm uppercase tracking-widest font-bold">
              Initialize <LaptopMinimal size={18} className="group-hover:rotate-12 transition-transform" />
            </span>
          </Button>
        </form>

        <div className="mt-10 text-center">
          <button className="text-xs text-on-surface-variant/60 hover:text-on-surface transition-colors">
            Existing operator? <span className="text-on-surface font-bold ml-1">Connect Here</span>
          </button>
        </div>
      </div>

      {/* Technical Footer Metadata - Section 3 System Typeface */}
      <div className="mt-12 w-full max-w-[500px] flex justify-between items-center px-4 font-mono text-[8px] uppercase tracking-[0.3em] text-on-surface-variant/20">
        <div className="flex gap-6">
          <span>Enc:AES-256</span>
          <span>Geo:Edge_Node</span>
        </div>
        <span>Request ID: UNL-90921-X</span>
      </div>
    </div>
  );
}