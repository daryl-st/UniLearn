import { useState } from 'react';
import { GraduationCap, Mail, Lock, LogIn } from 'lucide-react';
import {SiGooglechrome, SiApple} from 'react-icons/si';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/route-paths';
import { useAuth } from '@/auth/useAuth';
import { roleHomePath } from '@/auth/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const user = await signIn({ email, password });
      navigate(fromPath ?? roleHomePath(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in right now.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full min-h-dvh lg:min-h-screen bg-background text-foreground font-lexend">
      {/* Left Side: Hero Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJTAWgxrrY_-p8LNIR2kP8fJg9EvVub81_qt8SphweHG16i3K_rUTe5wQ3FirPpP7sPj6NRL2m7x6OMVHfCJevH3TMS86QltDtwIicE13JTmffcH0jVSvK7tlQTuVTBwV7Hp0jTckWxMdAKhdy6Q03vh4naU_IhfRGhR4p_T1msbRBf9oOHfPNGfmK3zo_3cvNLBVo_Dc1XwgXgk4N5aBAzuI_u9qFquQa9qowQHTyrEGr9HofJNH4JgV57TYixtAP_MdfDs9Tu2P5"
          alt="Modern university library"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/80 to-transparent dark:from-black/90 dark:via-black/70" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-12 xl:px-24 dark:text-white"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-black dark:bg-primary p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">UniLearn</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Welcome back to <br /> UniLearn
          </h1>
          
          <p className="text-xl text-foreground/90 dark:text-white/90 max-w-md font-light leading-relaxed">
            Your AI-powered study companion. Access course materials, generate smart summaries, and track your performance in one place.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-primary"
                  src={`https://picsum.photos/seed/student${i}/100/100`}
                  alt={`Student ${i}`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground dark:text-white/80">
              Joined by 5,000+ students this semester
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-background px-5 py-5 sm:px-6 sm:py-6 lg:py-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm lg:max-w-md"
        >
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center justify-left gap-3 mb-5">
            <div className="bg-black dark:bg-primary p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">UniLearn</span>
          </div>

          <div className="mb-5 lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold mb-1.5 lg:mb-2">Sign In</h2>
            <p className="text-sm lg:text-base text-muted-foreground">Enter your university credentials to continue.</p>
          </div>

          <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
            {errorMessage ? (
              <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errorMessage}
              </p>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="email">
                University Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-card border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground/70"
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-foreground/90" htmlFor="password">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-400 visited:text-blue-400 hover:text-blue-300 active:text-blue-200 decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-sm"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-card border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground/70"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                className="w-4 h-4 text-primary bg-card border-input rounded focus:ring-primary"
                id="remember"
                type="checkbox"
              />
              <label className="ml-2 text-sm text-muted-foreground" htmlFor="remember">
                Keep me logged in
              </label>
            </div>

            <button
              className="w-full py-2.5 lg:py-3 dark:bg-blue-600 bg-black hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 text-white font-semibold rounded-lg shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-5 lg:mt-8">
            <div className="relative flex items-center justify-center mb-5 lg:mb-8">
              <div className="w-full h-px bg-border" />
              <span className="absolute px-4 bg-background text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 lg:py-3 px-4 bg-card border border-input rounded-lg hover:bg-accent transition-colors">
                <SiGooglechrome className="w-5 h-5 text-[#4285F4]" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 lg:py-3 px-4 bg-card border border-input rounded-lg hover:bg-accent transition-colors">
                <SiApple className="w-5 h-5" />
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-5 lg:mt-10 text-center">
            <p className="text-muted-foreground">
              Don't have an account?
              <Link
                className="ml-1 text-blue-400 visited:text-blue-400 hover:text-blue-300 active:text-blue-200 font-semibold decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-sm"
                to={ROUTES.REGISTER}
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="hidden sm:flex mt-6 lg:mt-12 pt-5 lg:pt-8 border-t border-border justify-center gap-6 text-xs text-muted-foreground font-medium">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Help Center</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
