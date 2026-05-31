import { useState, useEffect, type FormEvent } from 'react';
import { GraduationCap, Lock, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { postAuthRedirectPath } from '@/utils/auth';
import { ROUTES } from '@/lib/route-paths';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, changePassword, isLoading, error, clearError } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN, { replace: true });
    } else if (!user.mustChangePassword) {
      navigate(postAuthRedirectPath(user), { replace: true });
    }
  }, [user, navigate]);

  const handleChange = () => {
    if (error) clearError();
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setValidationError("Both password fields are required");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    try {
      await changePassword(password);
      setSuccess(true);
      const u = useAuthStore.getState().user;
      navigate(postAuthRedirectPath(u), { replace: true });
    } catch (err) {
      console.log('Password update failed');
    }
  };

  return (
    <div className="flex w-full min-h-dvh lg:min-h-screen bg-background text-foreground font-lexend">
      {/* Left Side: Hero Image & Branding */}
      <div
        className="relative hidden overflow-hidden bg-background bg-cover bg-center lg:flex lg:w-1/2 items-center justify-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJTAWgxrrY_-p8LNIR2kP8fJg9EvVub81_qt8SphweHG16i3K_rUTe5wQ3FirPpP7sPj6NRL2m7x6OMVHfCJevH3TMS86QltDtwIicE13JTmffcH0jVSvK7tlQTuVTBwV7Hp0jTckWxMdAKhdy6Q03vh4naU_IhfRGhR4p_T1msbRBf9oOHfPNGfmK3zo_3cvNLBVo_Dc1XwgXgk4N5aBAzuI_u9qFquQa9qowQHTyrEGr9HofJNH4JgV57TYixtAP_MdfDs9Tu2P5')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/80 to-transparent backdrop-blur-sm" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-12 xl:px-24"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">UniLearn</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Secure Your <br /> Account
          </h1>
          
          <p className="text-xl text-foreground/90 max-w-md font-light leading-relaxed">
            Please replace the temporary password assigned to your account with a permanent, secure password to continue to your dashboard.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Change Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-background px-5 py-5 sm:px-6 sm:py-6 lg:py-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm lg:max-w-md"
        >
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center justify-left gap-3 mb-5">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">UniLearn</span>
          </div>

          <div className="mb-5 lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold mb-1.5 lg:mb-2">Update Password</h2>
            <p className="text-sm lg:text-base text-muted-foreground">Setup a secure password for your account access.</p>
          </div>

          {success ? (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              Password updated successfully! Redirecting you to your dashboard...
            </div>
          ) : (
            <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
              {(error || validationError) && (
                <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error || validationError}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="password">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-card border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground/70"
                    id="password"
                    name='password'
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); handleChange(); }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-card border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground/70"
                    id="confirmPassword"
                    name='confirmPassword'
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); handleChange(); }}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full py-2.5 lg:py-3 bg-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-primary-foreground font-semibold rounded-lg shadow-lg shadow-black/15 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
