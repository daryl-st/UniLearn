import type { LucideIcon } from 'lucide-react';

export type SettingsNavItem = {
  id: string;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
};

export type ApiKeyItem = {
  label: string;
  token: string;
  created: string;
  status: string;
};

export type UsageStatItem = {
  label: string;
  value: string;
  progress?: number;
  subtext?: string;
  icon: LucideIcon;
  pulse?: boolean;
};

export type NotificationPref = {
  id: string;
  label: string;
  description: string;
  active: boolean;
};
