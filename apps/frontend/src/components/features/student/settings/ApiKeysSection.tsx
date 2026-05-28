import { motion } from 'motion/react';
import { Copy, KeyRound } from 'lucide-react';
import type { ApiKeyItem } from '@/types/student/settings';

type ApiKeysSectionProps = {
  keys: ApiKeyItem[];
};

export function ApiKeysSection({ keys }: ApiKeysSectionProps) {
  if (keys.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-sm border border-outline-variant/10 bg-surface-low p-8"
      >
        <div className="flex items-start gap-4">
          <KeyRound className="mt-1 h-6 w-6 shrink-0 text-primary" />
          <div>
            <h4 className="mb-2 font-headline text-xl font-bold text-on-surface">Developer API access</h4>
            <p className="max-w-lg text-sm leading-relaxed text-on-surface-variant">
              API keys are not available for student accounts. Use the learning workspace for resource Q&A, or contact
              your administrator if you need programmatic access.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="rounded-sm border border-outline-variant/10 bg-surface-low p-8"
    >
      <h4 className="mb-6 font-headline text-xl font-bold text-on-surface">API keys</h4>
      <div className="space-y-3">
        {keys.map((key) => (
          <div
            key={key.label}
            className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-outline-variant/5 bg-surface-high/20 px-5 py-4"
          >
            <span className="font-mono text-xs text-on-surface">{key.label}</span>
            <span className="font-mono text-xs text-on-surface-variant">{key.token}</span>
            <button type="button" className="text-primary hover:text-white" aria-label="Copy token">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
