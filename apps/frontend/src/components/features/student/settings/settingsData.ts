import {
  Activity,
  Bell,
  CreditCard,
  Globe,
  KeyRound,
  Shield,
  User,
  Zap,
} from "lucide-react";
import type {
  ApiKeyItem,
  SettingsNavItem,
  TelemetryItem,
} from "@/types/student/settings";

export const settingsNav: SettingsNavItem[] = [
  { id: "profile", label: "Profile", mobileLabel: "Profile", icon: User, active: false },
  { id: "security", label: "Security", mobileLabel: "Security", icon: Shield, active: false },
  { id: "api-key", label: "API Key", mobileLabel: "API", icon: KeyRound, active: true },
  { id: "notification", label: "Notification", mobileLabel: "Notif", icon: Bell, active: false },
  { id: "billing", label: "Billing", mobileLabel: "Billing", icon: CreditCard, active: false },
];

export const apiKeys: ApiKeyItem[] = [
  { label: "Production_Main_01", token: "uk-•••••••••••••v19", created: "24.05.2024", status: "active" },
  { label: "Staging_Test_Env", token: "uk-•••••••••••••a42", created: "12.03.2024", status: "active" },
];

export const telemetry: TelemetryItem[] = [
  { label: "TOTAL REQUESTS", value: "142,093", progress: 65, icon: Activity },
  { label: "AVG LATENCY", value: "124ms", subtext: "OPTIMIZED", icon: Zap },
  {
    label: "ACTIVE SOCKETS",
    value: "4",
    subtext: "REGIONAL: EU-CENTRAL",
    icon: Globe,
    pulse: true,
  },
];
