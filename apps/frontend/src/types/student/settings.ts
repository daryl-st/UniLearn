import type { LucideIcon } from "lucide-react";

export interface SettingsNavItem {
  id: string;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
  active: boolean;
}

export interface ApiKeyItem {
  label: string;
  token: string;
  created: string;
  status: "active" | "inactive";
}

export interface TelemetryItem {
  label: string;
  value: string;
  progress?: number;
  subtext?: string;
  icon: LucideIcon;
  pulse?: boolean;
}
