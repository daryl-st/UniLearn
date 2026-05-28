import { Shield } from 'lucide-react';

export function SecuritySection() {
  return (
    <div className="rounded-sm border border-outline-variant/10 bg-surface-low p-8">
      <div className="mb-8 flex items-center gap-4">
        <Shield className="text-primary" size={24} />
        <h2 className="font-headline text-xl font-medium text-on-surface">Security</h2>
      </div>

      <div className="max-w-md space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-wider text-outline">Current password</label>
          <input
            type="password"
            disabled
            placeholder="••••••••"
            className="cursor-not-allowed rounded-sm border border-outline-variant/10 bg-surface p-3 text-sm text-on-surface-variant opacity-60"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-wider text-outline">New password</label>
          <input
            type="password"
            disabled
            placeholder="Not available in demo"
            className="cursor-not-allowed rounded-sm border border-outline-variant/10 bg-surface p-3 text-sm text-on-surface-variant opacity-60"
          />
        </div>
        <p className="text-xs text-on-surface-variant">
          Password changes will be available when account management APIs are connected.
        </p>
        <div className="rounded-sm border border-outline-variant/10 bg-surface p-4">
          <p className="text-sm font-semibold text-on-surface">Two-factor authentication</p>
          <p className="mt-1 text-xs text-on-surface-variant">Coming soon for student accounts.</p>
        </div>
      </div>
    </div>
  );
}
