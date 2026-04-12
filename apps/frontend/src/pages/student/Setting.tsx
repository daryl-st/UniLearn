import { 
  Plus, 
  Copy, 
  Trash2, 
  User,
  Shield,
  KeyRound,
  Bell,
  CreditCard,
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';

const settingsNav = [
  { id: 'profile', label: 'Profile', mobileLabel: 'Profile', icon: User, active: false },
  { id: 'security', label: 'Security', mobileLabel: 'Security', icon: Shield, active: false },
  { id: 'api-key', label: 'API Key', mobileLabel: 'API', icon: KeyRound, active: true },
  { id: 'notification', label: 'Notification', mobileLabel: 'Notif', icon: Bell, active: false },
  { id: 'billing', label: 'Billing', mobileLabel: 'Billing', icon: CreditCard, active: false },
];

const apiKeys = [
  { label: 'Production_Main_01', token: 'uk-•••••••••••••v19', created: '24.05.2024', status: 'active' },
  { label: 'Staging_Test_Env', token: 'uk-•••••••••••••a42', created: '12.03.2024', status: 'active' },
];

const telemetry = [
  { label: 'TOTAL REQUESTS', value: '142,093', progress: 65, icon: Activity },
  { label: 'AVG LATENCY', value: '124ms', subtext: 'OPTIMIZED', icon: Zap },
  { label: 'ACTIVE SOCKETS', value: '4', subtext: 'REGIONAL: EU-CENTRAL', icon: Globe, pulse: true },
];

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 gap-8">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="grid grid-cols-5 gap-1 rounded-sm border border-outline-variant/10 bg-surface-low p-1 sm:gap-2 sm:p-2"
          aria-label="Settings sections"
        >
          {settingsNav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`inline-flex w-full items-center justify-center gap-1 rounded-sm border-b-2 px-1 py-2 text-[9px] font-mono uppercase tracking-[0.08em] transition-all sm:gap-2 sm:px-3 sm:text-xs sm:tracking-[0.14em] ${
                item.active
                  ? 'bg-surface-high text-primary border-b-primary'
                  : 'text-on-surface-variant border-b-transparent hover:bg-surface-high/60 hover:text-white'
              }`}
            >
              <item.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="sm:hidden">{item.mobileLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </motion.nav>

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

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-low rounded-sm p-8 border border-outline-variant/10"
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
            <div>
              <h4 className="font-headline text-xl text-white font-bold mb-2">API & Integration Keys</h4>
              <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed">
                Manage your secure access tokens for third-party integration and the UniLearn Developer SDK. Keep these keys secret.
              </p>
            </div>
            <button className="bg-primary text-on-primary font-bold px-5 py-2.5 rounded-sm text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/10 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              CREATE NEW KEY
            </button>
          </div>

          {/* API Key Table */}
          <div className="overflow-x-auto">
            <div className="min-w-150">
              <div className="grid grid-cols-12 px-5 py-3 border-b border-outline-variant/10 mb-4">
                <span className="col-span-5 font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Key Label</span>
                <span className="col-span-4 font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Secret Token</span>
                <span className="col-span-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Created</span>
                <span className="col-span-1"></span>
              </div>

              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div 
                    key={key.label}
                    className="grid grid-cols-12 items-center px-5 py-5 bg-surface-high/20 rounded-sm hover:bg-surface-high/40 transition-all group border border-outline-variant/5 hover:border-outline-variant/20"
                  >
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="font-mono text-xs text-white font-medium tracking-tight">{key.label}</span>
                    </div>
                    <div className="col-span-4 flex items-center gap-3">
                      <span className="font-mono text-xs text-on-surface-variant/70">{key.token}</span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-white p-1 hover:bg-primary/10 rounded-sm">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="col-span-2 font-mono text-xs text-on-surface-variant/50">{key.created}</div>
                    <div className="col-span-1 text-right">
                      <button className="text-on-surface-variant/40 hover:text-red-400 transition-colors p-1 hover:bg-red-400/10 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="mt-16">
            <h4 className="font-mono text-[10px] text-secondary tracking-[0.4em] mb-6 uppercase font-bold">Usage Telemetry</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {telemetry.map((stat) => (
                <div key={stat.label} className="p-6 rounded-sm border border-outline-variant/10 bg-surface-high/30 hover:border-primary/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-on-surface-variant text-[10px] font-mono font-bold tracking-[0.2em]">{stat.label}</p>
                    <stat.icon className={`w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors ${stat.pulse ? 'animate-pulse text-secondary' : ''}`} />
                  </div>
                  <p className="font-headline text-4xl font-bold text-white mb-3 tracking-tighter">{stat.value}</p>
                  {stat.progress !== undefined ? (
                    <div className="h-1 bg-surface-high rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  ) : (
                    <p className={`text-[10px] font-mono font-black tracking-widest ${stat.subtext === 'OPTIMIZED' ? 'text-secondary' : 'text-on-surface-variant/40'}`}>
                      {stat.subtext}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Webhook Configuration */}
          <div className="mt-16 pt-12 border-t border-outline-variant/10">
            <h4 className="font-headline text-lg text-white font-bold mb-8 uppercase tracking-tight">Webhook Configuration</h4>
            <div className="space-y-8 max-w-2xl">
              <div className="space-y-3">
                <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Payload URL</label>
                <input 
                  className="w-full bg-surface/60 border border-outline-variant/30 rounded-sm px-5 py-3.5 text-sm text-white focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all font-mono outline-none placeholder:text-on-surface-variant/30" 
                  placeholder="https://api.yourdomain.com/webhooks" 
                  type="url"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Event Triggers</label>
                  <select className="w-full bg-surface/60 border border-outline-variant/30 rounded-sm px-5 py-3.5 text-sm text-white focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer">
                    <option>All System Events</option>
                    <option>Course Completion</option>
                    <option>AI Model Ready</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Environment</label>
                  <div className="flex p-1.5 bg-surface/60 rounded-sm border border-outline-variant/30">
                    <button className="flex-1 py-2 text-xs font-bold rounded-sm bg-surface-high text-primary shadow-lg">STAGING</button>
                    <button className="flex-1 py-2 text-xs font-bold rounded-sm text-on-surface-variant hover:text-white transition-colors">PRODUCTION</button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full md:w-auto bg-surface-high text-white px-10 py-4 rounded-sm font-bold text-xs hover:bg-surface-high/80 active:scale-95 transition-all shadow-lg border border-outline-variant/20 tracking-widest">
                  SAVE CONFIGURATION
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
