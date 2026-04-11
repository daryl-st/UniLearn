import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Bell, 
  Sparkles, 
  CheckCircle,
  Plus,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Settings: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight mb-2">Instructor Settings</h1>
          <p className="text-outline text-sm">Configure your teaching environment and administrative protocols.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 rounded-sm border border-secondary/20">Platform Role</span>
          <span className="font-headline font-semibold text-primary">Lead Instructor</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-surface-low p-8 rounded-sm border border-outline-variant/5">
            <div className="flex items-center gap-4 mb-8">
              <User className="text-primary" size={24} />
              <h2 className="font-headline text-xl font-medium">Profile Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-outline uppercase tracking-wider">Avatar Representation</label>
                  <div className="flex items-center gap-6 group">
                    <div className="relative w-24 h-24 rounded-sm overflow-hidden bg-surface-high">
                      <img src="https://picsum.photos/seed/instructor/200/200" alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                    </div>
                    <button className="text-xs bg-surface-high px-4 py-2 hover:bg-surface-highest transition-colors font-semibold uppercase tracking-tighter">Update Artifact</button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-outline uppercase tracking-wider">Bio / Operational Summary</label>
                  <textarea 
                    className="bg-surface border-none text-sm p-4 focus:ring-1 focus:ring-primary rounded-sm text-on-surface resize-none h-32"
                    defaultValue="Specializing in high-density data visualization and neural architecture instruction. Over 12 cycles of experience in protocol management and academic delivery."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-outline uppercase tracking-wider">Specialties</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Neural Networks', 'Data Ethics', 'Quantum Computing'].map(s => (
                      <span key={s} className="bg-surface-high text-secondary text-[11px] font-mono px-2 py-1 rounded-sm">{s}</span>
                    ))}
                    <button className="border border-dashed border-outline text-outline text-[11px] px-2 py-1 rounded-sm hover:border-primary hover:text-primary transition-all">+ Add Module</button>
                  </div>
                </div>
                <div className="p-6 bg-surface rounded-sm border-l-2 border-primary">
                  <h4 className="text-xs font-bold text-primary mb-1">Public Recognition</h4>
                  <p className="text-[12px] text-outline">Your profile is currently indexed in the Global Instructor Registry. Your specialties are visible to all vetted students.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-low p-8 rounded-sm border border-outline-variant/5">
            <div className="flex items-center gap-4 mb-8">
              <Bell className="text-primary" size={24} />
              <h2 className="font-headline text-xl font-medium">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Student enrollment alerts', desc: 'Real-time feed for new protocol participants', active: true },
                { label: 'Quiz submissions', desc: 'Notify when assessment data is ready for verification', active: true },
                { label: 'System updates', desc: 'Critical platform patches and protocol shifts', active: false },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface hover:bg-surface-high/50 transition-colors cursor-pointer rounded-sm">
                  <div>
                    <div className="text-sm font-semibold">{pref.label}</div>
                    <div className="text-xs text-outline">{pref.desc}</div>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors",
                    pref.active ? "bg-primary" : "bg-surface-highest"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 bg-surface rounded-full transition-all",
                      pref.active ? "right-0.5" : "left-0.5"
                    )}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-low p-8 rounded-sm border border-outline-variant/5">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="text-primary" size={24} />
              <h2 className="font-headline text-xl font-medium">Privacy & Security</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-outline uppercase tracking-widest">Authentication Level</label>
                <div className="p-3 bg-surface rounded-sm flex items-center justify-between border-l border-secondary">
                  <span className="text-xs font-mono">MULTI-FACTOR ACTIVE</span>
                  <CheckCircle className="text-secondary" size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-outline uppercase tracking-widest">Data Visibility</label>
                <select className="w-full bg-surface border-none text-xs rounded-sm focus:ring-1 focus:ring-primary py-3">
                  <option>Limited (Internal Only)</option>
                  <option>Public (Marketplace)</option>
                  <option>Restricted (Admin Only)</option>
                </select>
              </div>
              <div className="pt-4 space-y-3">
                <button className="w-full bg-surface-high text-on-surface py-3 text-xs font-semibold uppercase tracking-wider hover:bg-surface-highest transition-all">Change Access Key</button>
                <button className="w-full bg-transparent text-error border border-error/30 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-all">Deactivate Protocol</button>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden p-6 rounded-sm bg-primary/5 backdrop-blur-[12px] border-t border-primary/15 glass-panel">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={18} />
              <span className="font-headline text-sm font-bold tracking-tight">AI PREDICTOR</span>
            </div>
            <p className="text-xs text-outline leading-relaxed mb-4">Based on your activity, student engagement in <span className="text-secondary">Data Ethics</span> is predicted to increase by 24% next cycle. Recommend updating course assets.</p>
            <div className="w-full bg-surface/40 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-2/3 shadow-[0_0_8px_#d0bcff]"></div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-end gap-4">
        <button className="px-6 py-2 text-sm font-medium text-outline hover:text-on-surface transition-colors">Discard Alterations</button>
        <button className="px-8 py-2 bg-primary text-on-primary text-sm font-bold rounded-sm active:scale-95 transition-transform">Commit Changes</button>
      </footer>
    </motion.div>
  );
};
