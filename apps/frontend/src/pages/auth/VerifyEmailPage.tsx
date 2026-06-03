import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '@/api/auth';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const hasToken = token.length > 0;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() =>
    hasToken ? 'loading' : 'error',
  );
  const [message, setMessage] = useState(() =>
    hasToken ? 'Verifying your email…' : 'Invalid verification token',
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!hasToken) return;

    let cancelled = false;

    void (async () => {
      try {
        const result = await authAPI.verifyEmail(token);
        if (cancelled) return;
        setStatus('success');
        setMessage(result.message);
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Invalid or expired verification link');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, hasToken]);

  useEffect(() => {
    if (status !== 'success') return;

    const timer = window.setTimeout(() => {
      navigate('/login', { replace: true });
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [status, navigate]);

  return (
    <div className="flex w-full min-h-dvh lg:min-h-screen bg-background text-foreground font-lexend items-center justify-center px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl border border-input bg-card p-8 text-center shadow-lg"
      >
        <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
          <GraduationCap className="text-primary-foreground w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold mb-2">Email verification</h1>
        <p
          className={
            status === 'error'
              ? 'text-sm text-red-300'
              : status === 'success'
                ? 'text-sm text-green-300'
                : 'text-sm text-muted-foreground'
          }
        >
          {message}
        </p>
        {status !== 'loading' ? (
          <Link
            to="/login"
            className="mt-6 inline-block text-blue-400 visited:text-blue-400 hover:text-blue-300 font-semibold"
          >
            Go to sign in
          </Link>
        ) : null}
      </motion.div>
    </div>
  );
}
