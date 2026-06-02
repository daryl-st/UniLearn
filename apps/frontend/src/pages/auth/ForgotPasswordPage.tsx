import React, { useState, type FormEvent } from 'react';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { authAPI } from '@/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('University email is required.');
      return;
    }

    // Basic AAU email check locally to prevent obvious typos before submitting to backend
    if (!email.trim().toLowerCase().endsWith('@aau.edu.et')) {
      setError('Please enter a valid university email (e.g., name@aau.edu.et).');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(email.trim());
      setSuccess(true);
      setSuccessMessage(response.message || 'Verification link sent successfully. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
        {/* Decorative subtle ambient glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
            <GraduationCap className="text-primary-foreground w-6 h-6" />
          </div>
          
          {!success ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Enter your university credentials and we'll email you a recovery link to reset your password.
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

                <div>
                  <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="email">
                    University Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      className="w-full pl-11 pr-4 py-2.5 bg-card border border-input text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-muted-foreground/70"
                      id="email"
                      type="email"
                      placeholder="name@aau.edu.et"
                      value={email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  className="w-full py-2.5 bg-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-primary-foreground font-semibold rounded-lg shadow-lg shadow-black/15 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Sending Link...' : 'Send Recovery Link'}</span>
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
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed px-2">
                {successMessage}
              </p>
              <p className="text-xs text-muted-foreground/75 mb-2">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </motion.div>
          )}

          <div className="mt-8 pt-5 border-t border-border flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
