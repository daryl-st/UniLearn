import { useState, type FormEvent } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap} from 'lucide-react';
import {SiGooglechrome, SiApple} from 'react-icons/si';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/route-paths';
import { useAuthStore } from '@/stores/authStore';

// type SignUpFormInput = {
//   fullName: string;
//   email: string;
//   password: string;
// };

// type SignUpProps = {
//   onSubmit?: (input: SignUpFormInput) => Promise<void> | void;
// };

export default function SignUp() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  // Local form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }); // we might not need confirm password

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
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Password do not match!');
      return;
    }

    if (formData.password.length < 4) { // TODO: edit later
      setValidationError('Password must be at least 6 characters');
      return;
    } 

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/dashboard'); // role based
    } catch (err) {
      // Error already in store, no need to handle here
      console.log('Registration failed');
    }
  }


  const [showPassword, setShowPassword] = useState(false);
  // const [fullName, setFullName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!onSubmit) {
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setErrorMessage(null);
  //   try {
  //     await onSubmit({ fullName, email, password });
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : 'Unable to create account right now.';
  //     setErrorMessage(message);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
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

        {(error || validationError) && (
          <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded'>
            {error || validationError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
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
  );
}
