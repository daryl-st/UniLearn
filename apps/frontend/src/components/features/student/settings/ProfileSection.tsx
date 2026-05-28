import { User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name?.trim() || 'Student User';
  const email = user?.email || 'student@unilearn.edu';

  return (
    <div className="rounded-sm border border-outline-variant/10 bg-surface-low p-8">
      <div className="mb-8 flex items-center gap-4">
        <User className="text-primary" size={24} />
        <h2 className="font-headline text-xl font-medium text-on-surface">Profile</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-outline">Display name</label>
            <input
              type="text"
              readOnly
              value={name}
              className="rounded-sm border border-outline-variant/10 bg-surface p-3 text-sm text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-outline">Email</label>
            <input
              type="email"
              readOnly
              value={email}
              className="rounded-sm border border-outline-variant/10 bg-surface p-3 text-sm text-on-surface"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-outline">Bio</label>
            <textarea
              className="h-32 resize-none rounded-sm border border-outline-variant/10 bg-surface p-4 text-sm text-on-surface focus:ring-1 focus:ring-primary"
              placeholder="Tell instructors a little about your learning goals…"
              defaultValue="Computer Science student using UniLearn for course materials, summaries, and revision."
            />
          </div>
          <button
            type="button"
            className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-primary transition-opacity hover:opacity-90"
          >
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
}
