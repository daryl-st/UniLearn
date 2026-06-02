import React, { useState, useEffect, type FormEvent } from 'react';
import { GraduationCap, Lock, EyeOff, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Local token error check
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token. Please check your recovery link.');
    }
  }, [token]);

  // Handle successful redirect
  useEffect(() => {
    if (!success) return;

    const timer = window.setTimeout(() => {
      navigate('/login', { replace: true });
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Cannot reset password without a valid token.');
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError('Both password fields are required.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.resetPassword(token, formData.password);
      
      // Clean up any stale client sessions to prevent automatic dashboard redirect
      try {
        await useAuthStore.getState().logout();
      } catch (logoutErr) {
        console.warn('Silent logout during password reset failed:', logoutErr);
      }
      
      setSuccess(true);
      setSuccessMessage(response.message || 'Your password has been reset successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-dvh lg:min-h-screen bg-background text-foreground font-lexend items-center justify-center px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl border border-input bg-card p-8 shadow-lg relative overflow-hidden"
      >
        {/* Decorative ambient glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
            <GraduationCap className="text-primary-foreground w-6 h-6" />
          </div>

          {!success ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Choose a new secure password for your UniLearn account.
              </p>

              <form className="space-y-5 text-left" onSubmit={handleSubmit}>
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  >
                    {error}
                  </motion.div>
                ) : null}

                {/* Password input */}
                <div>
                  <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      className="w-full pl-11 pr-12 py-2.5 bg-card border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground/70"
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading || !token}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                      type="button"
                      disabled={!token}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password input */}
                <div>
                  <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      className="w-full pl-11 pr-12 py-2.5 bg-card border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground/70"
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading || !token}
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                      type="button"
                      disabled={!token}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  className="w-full py-2.5 bg-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-primary-foreground font-semibold rounded-lg shadow-lg shadow-black/15 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isLoading || !token}
                >
                  <span>{isLoading ? 'Resetting Password...' : 'Reset Password'}</span>
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="py-4"
            >
              <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20">
                <CheckCircle2 className="text-green-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Password Reset Successful</h1>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed px-2">
                {successMessage}
              </p>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/80 animate-pulse">
                <span>Redirecting to Login Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          )}

          <div className="mt-8 pt-5 border-t border-border flex justify-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
