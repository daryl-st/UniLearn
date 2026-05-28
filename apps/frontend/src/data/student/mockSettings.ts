import { Activity, Bell, BookOpen, KeyRound, Shield, User, Zap } from 'lucide-react';
import type { ApiKeyItem, NotificationPref, SettingsNavItem, UsageStatItem } from '@/types/student/settings';

export const settingsNavItems: SettingsNavItem[] = [
  { id: 'profile', label: 'Profile', mobileLabel: 'Profile', icon: User },
  { id: 'security', label: 'Security', mobileLabel: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', mobileLabel: 'Notif', icon: Bell },
  { id: 'api-key', label: 'API access', mobileLabel: 'API', icon: KeyRound },
];

export const mockApiKeys: ApiKeyItem[] = [];

export const mockUsageStats: UsageStatItem[] = [
  { label: 'Resources opened', value: '24', progress: 48, icon: BookOpen },
  { label: 'AI questions', value: '18', subtext: 'This month', icon: Zap },
  {
    label: 'Courses in catalog',
    value: '6',
    subtext: 'Computer Science',
    icon: Activity,
    pulse: true,
  },
];

export const defaultNotificationPrefs: NotificationPref[] = [
  {
    id: 'n1',
    label: 'New course resources',
    description: 'When an instructor uploads materials to a course you follow.',
    active: true,
  },
  {
    id: 'n2',
    label: 'AI summary ready',
    description: 'Notify when a generated summary is available (when enabled).',
    active: true,
  },
  {
    id: 'n3',
    label: 'Platform updates',
    description: 'Maintenance windows and feature announcements.',
    active: false,
  },
];
