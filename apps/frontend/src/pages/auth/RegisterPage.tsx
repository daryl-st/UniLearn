import { useState, type FormEvent } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap} from 'lucide-react';
import {SiGooglechrome, SiApple} from 'react-icons/si';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/route-paths';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  // Local form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  }); // we might not need confirm password

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear error when user starts typing
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // validation
    // if (formData.password !== formData.confirmPassword) {
    //   setValidationError('Password do not match!');
    //   return;
    // }

    if (formData.password.length < 4) { // TODO: edit later
      setValidationError('Password must be at least 6 characters');
      return;
    } 

    try {
      // const { confirmPassword, ...userData } = formData; // no confirm password
      await register(formData);
      navigate('/dashboard'); // role based
    } catch (err) {
      // Error already in store, no need to handle here
      console.log('Registration failed');
    }
  }

  const students = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&h=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
  ];

  return (
    <>
      <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground lg:flex-row">
        <div 
          className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-cover bg-center bg-background"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop')" 
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/80 to-transparent backdrop-blur-sm"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary shadow-lg shadow-primary/30">
              <GraduationCap className="text-primary-foreground w-8 h-8" />
            </div>
            
            <h1 className="text-foreground text-2xl xl:text-5xl font-black leading-tight tracking-tight mb-6">
              Welcome to <br />
              <span className="text-primary">UniLearn</span>
            </h1>
            
            <p className="text-muted-foreground text-lg xl:text-xl font-light max-w-lg leading-relaxed opacity-90">
              Join thousands of students across the globe. Access exclusive resources, 
              collaborate on projects, and accelerate your academic journey.
            </p>
            
            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-4">
                {students.map((src, i) => (
                  <img 
                    key={i}
                    src={src} 
                    alt="Student avatar" 
                    className="w-10 h-10 rounded-full border-2 border-border object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-border bg-primary text-[10px] font-bold text-primary-foreground uppercase tracking-tighter">
                  +2k
                </div>
              </div>
              <span className="text-muted-foreground text-sm font-medium tracking-wide">
                Trusted by students worldwide
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col flex-1 justify-center items-center px-5 py-4 sm:py-5 lg:px-10 lg:py-8 xl:px-16 xl:py-10 bg-background text-foreground">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="w-full max-w-[26rem] lg:max-w-[28rem]"
      >
        {/* Mobile Header */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20">
              <GraduationCap className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-foreground text-2xl font-black tracking-tight">UniLearn</h1>
          </div>
          <p className="text-muted-foreground text-sm">Join thousands of students today.</p>
        </div>

        <div className="mb-4 lg:mb-7">
          <h2 className="text-foreground text-2xl lg:text-[1.65rem] font-extrabold tracking-tight">Create Account</h2>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">Get started with your university credentials.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {(error || validationError) ? (
            <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error || validationError}
            </p>
          ) : null}

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/90 text-sm font-semibold ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/70" 
                placeholder="John Doe" 
                name='name'
                type="text" 
                value={formData.name}
                onChange={handleChange}
                required
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
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
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
                name='password'
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                required
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

          <div className="pt-1.5">
            <button className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg shadow-black/15 flex items-center justify-center gap-2 group disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">
              <span>{isLoading ? 'Creating account...' : 'Sign Up'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-4 lg:mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">or continue with</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        <div className="mt-4 lg:mt-5 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-input hover:bg-accent transition-all font-semibold text-foreground">
            <SiGooglechrome className="w-5 h-5 text-[#4285F4]" />
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-input hover:bg-accent transition-all font-semibold text-foreground">
            <SiApple className="w-5 h-5" />
            <span>Apple</span>
          </button>
        </div>

        <div className="mt-4 lg:mt-6 pt-4 lg:pt-5 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account? 
            <Link className="ml-1 text-blue-400 visited:text-blue-400 hover:text-blue-300 active:text-blue-200 font-bold hover:underline" to={ROUTES.LOGIN}>Sign in</Link>
          </p>
        </div>

        <div className="hidden sm:flex mt-5 lg:mt-6 flex-wrap justify-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Help Center</a>
        </div>
      </motion.div>
    </div>
      </main>
    </>
  );
}
