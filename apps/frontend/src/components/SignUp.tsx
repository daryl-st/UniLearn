import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap} from 'lucide-react';
import {SiGooglechrome, SiApple} from 'react-icons/si';
import { motion } from 'motion/react';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col flex-1 justify-center items-center px-5 py-6 lg:px-10 lg:py-8 xl:px-16 xl:py-10 bg-background text-foreground">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="w-full max-w-[28rem]"
      >
        {/* Mobile Header */}
        <div className="lg:hidden mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black dark:bg-primary mb-6 shadow-lg shadow-primary/20">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-foreground text-3xl font-black tracking-tight">UniLearn</h1>
          <p className="text-muted-foreground mt-1.5 text-base">Join thousands of students today.</p>
        </div>

        <div className="mb-6 lg:mb-7">
          <h2 className="text-foreground text-2xl lg:text-[1.65rem] font-extrabold tracking-tight">Create Account</h2>
          <p className="text-muted-foreground mt-1.5 text-sm lg:text-base">Get started with your university credentials.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/90 text-sm font-semibold ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/70" 
                placeholder="John Doe" 
                type="text" 
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/90 text-sm font-semibold ml-1">University Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/70" 
                placeholder="name@university.edu" 
                type="email" 
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/90 text-sm font-semibold ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/70" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors" 
                type="button"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full bg-black hover:bg-black/90 dark:bg-primary dark:hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-black/25 dark:shadow-primary/25 flex items-center justify-center gap-2 group">
              <span>Sign Up</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">or continue with</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-input hover:bg-accent transition-all font-semibold text-foreground">
            <SiGooglechrome className="w-5 h-5 text-[#4285F4]" />
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-input hover:bg-accent transition-all font-semibold text-foreground">
            <SiApple className="w-5 h-5" />
            <span>Apple</span>
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account? 
            <a className="ml-1 text-blue-400 visited:text-blue-400 hover:text-blue-300 active:text-blue-200 font-bold hover:underline" href="#">Sign in</a>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Help Center</a>
        </div>
      </motion.div>
    </div>
  );
}
