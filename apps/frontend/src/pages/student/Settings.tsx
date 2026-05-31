import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { asBackendRole, roleLabelForBackendRole } from '@/utils/auth';
import {
  defaultNotificationPrefs,
  mockApiKeys,
  mockUsageStats,
  settingsNavItems,
} from '@/data/student/mockSettings';
import { SettingsNav } from '@/components/features/student/settings/SettingsNav';
import { ProfileSection } from '@/components/features/student/settings/ProfileSection';
import { SecuritySection } from '@/components/features/student/settings/SecuritySection';
import { NotificationSection } from '@/components/features/student/settings/NotificationSection';
import { ApiKeysSection } from '@/components/features/student/settings/ApiKeysSection';
import { UsageStatsSection } from '@/components/features/student/settings/UsageStatsSection';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const user = useAuthStore((s) => s.user);
  const roleLabel = roleLabelForBackendRole(asBackendRole(user?.role));

  return (
    <div className="flex min-h-full flex-col gap-6 p-6 md:gap-8 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">Account</span>
          <h2 className="mt-1 font-headline text-4xl font-bold tracking-tighter text-on-surface">Settings</h2>
          <p className="mt-2 max-w-xl text-sm text-on-surface-variant">
            Manage your profile, security, and notification preferences. Changes are local until backend APIs are wired.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-sm border border-secondary/20 bg-secondary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-secondary">
            Platform role
          </span>
          <span className="font-headline font-semibold text-primary">{roleLabel}</span>
        </div>
      </header>

      <SettingsNav items={settingsNavItems} activeId={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' && <ProfileSection />}
      {activeTab === 'security' && <SecuritySection />}
      {activeTab === 'notifications' && <NotificationSection initialPrefs={defaultNotificationPrefs} />}
      {activeTab === 'api-key' && <ApiKeysSection keys={mockApiKeys} />}

      <UsageStatsSection stats={mockUsageStats} />
    </div>
  );
}
