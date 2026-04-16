import { motion } from 'motion/react';
import { SettingsNav } from '@/components/features/student/settings/SettingsNav';
import { ApiKeysSection } from '@/components/features/student/settings/ApiKeysSection';
import { TelemetrySection } from '@/components/features/student/settings/TelemetrySection';
import { WebhookConfiguration } from '@/components/features/student/settings/WebhookConfiguration';
import { apiKeys, settingsNav, telemetry } from '@/components/features/student/settings/settingsData';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 gap-8">
        <SettingsNav items={settingsNav} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-sm border border-outline-variant/10 bg-surface-low p-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Workspace configuration</p>
          <h3 className="mt-3 font-headline text-2xl font-bold text-white">API and integration settings</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Manage your secure access tokens, telemetry preferences, and webhook destination in one place.
          </p>
        </motion.div>

        <ApiKeysSection keys={apiKeys} />
        <TelemetrySection telemetry={telemetry} />
        <WebhookConfiguration />
      </div>
    </div>
  );
}
