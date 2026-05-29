import { useState } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationPref } from '@/types/student/settings';

type NotificationSectionProps = {
  initialPrefs: NotificationPref[];
};

export function NotificationSection({ initialPrefs }: NotificationSectionProps) {
  const [prefs, setPrefs] = useState(initialPrefs);

  const toggle = (id: string) => {
    setPrefs((current) =>
      current.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  };

  return (
    <div className="rounded-sm border border-outline-variant/10 bg-surface-low p-8">
      <div className="mb-8 flex items-center gap-4">
        <Bell className="text-primary" size={24} />
        <h2 className="font-headline text-xl font-medium text-on-surface">Notifications</h2>
      </div>

      <div className="space-y-4">
        {prefs.map((pref) => (
          <button
            key={pref.id}
            type="button"
            onClick={() => toggle(pref.id)}
            className="flex w-full cursor-pointer items-center justify-between rounded-sm bg-surface p-4 text-left transition-colors hover:bg-surface-high/50"
          >
            <div>
              <div className="text-sm font-semibold text-on-surface">{pref.label}</div>
              <div className="text-xs text-outline">{pref.description}</div>
            </div>
            <div
              className={cn(
                'relative h-5 w-10 shrink-0 rounded-full transition-colors',
                pref.active ? 'bg-primary/30' : 'bg-surface-highest',
              )}
            >
              <div
                className={cn(
                  'absolute top-1 h-3 w-3 rounded-full bg-on-surface shadow-sm transition-all',
                  pref.active ? 'right-1 bg-primary' : 'left-1 bg-on-surface-variant/40',
                )}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
