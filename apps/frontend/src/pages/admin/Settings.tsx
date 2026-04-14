import React from 'react';
import { Plus, Shield, Terminal, Settings as SettingsIcon, CheckCircle2, Lock, Cpu } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight mb-2">Protocol Settings</h1>
          <p className="text-on-surface-variant max-w-xl">Configure the core parameters of the UniLearn autonomous learning engine and manage administrative hierarchies.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2 rounded bg-surface-high text-on-surface font-medium hover:bg-surface-highest transition-colors active:scale-95">Discard</button>
          <button className="px-5 py-2 rounded bg-primary text-on-primary font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/10">Apply Protocol</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 rounded-xl p-6 bg-primary/5 backdrop-blur-xl border border-primary/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">System Pulse</span>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-2">Core Connectivity</h3>
            <p className="text-sm text-on-surface-variant opacity-70">Neural engine synchronization is at 98.4% capacity. All clusters operational.</p>
          </div>
          <div className="mt-8">
            <div className="flex justify-between text-[10px] font-mono mb-2">
              <span>LATENCY</span>
              <span>14MS</span>
            </div>
            <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-4/5"></div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-surface-low rounded-xl p-8 border border-outline-variant/10">
          <h2 className="font-headline text-2xl font-semibold mb-6">General Configuration</h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-on-surface-variant tracking-wider uppercase">Instance Name</label>
                <input 
                  className="w-full bg-surface-high border-none rounded p-3 text-on-surface focus:ring-1 focus:ring-primary transition-all" 
                  type="text" 
                  defaultValue="UniLearn Global Mainframe"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono text-on-surface-variant tracking-wider uppercase">Administrative Email</label>
                <input 
                  className="w-full bg-surface-high border-none rounded p-3 text-on-surface focus:ring-1 focus:ring-primary transition-all" 
                  type="email" 
                  defaultValue="admin@unilearn.protocol"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-high rounded-lg group hover:bg-surface-highest transition-colors cursor-pointer">
                <div>
                  <div className="font-medium">Autonomous Moderation</div>
                  <div className="text-xs text-on-surface-variant">Enable AI-driven content filtering for community nodes</div>
                </div>
                <div className="w-12 h-6 bg-secondary/20 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-secondary rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-high rounded-lg group hover:bg-surface-highest transition-colors cursor-pointer">
                <div>
                  <div className="font-medium">Deep Search Indexing</div>
                  <div className="text-xs text-on-surface-variant">Allow the system to index vector embeddings for complex queries</div>
                </div>
                <div className="w-12 h-6 bg-surface-high rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-surface-low rounded-xl p-8 border border-outline-variant/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-2xl font-semibold">Roles & Hierarchies</h2>
            <button className="flex items-center gap-2 text-xs font-mono bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-all">
              <Plus className="w-4 h-4" />
              NEW ROLE
            </button>
          </div>
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, label: 'Super Admin', tags: ['ALL_ACCESS', 'PROTOCOL_WRITE'], count: '3 USERS', color: 'text-secondary' },
              { icon: SettingsIcon, label: 'Content Curator', tags: ['COURSE_READ', 'MOD_QUEUE'], count: '12 USERS', color: 'text-on-surface-variant' },
              { icon: Terminal, label: 'Lead Instructor', tags: ['STUDENT_MGMT'], count: '48 USERS', color: 'text-on-surface-variant' },
            ].map((role, i) => (
              <div key={i} className="grid grid-cols-12 items-center p-4 bg-surface rounded hover:bg-surface-high transition-all group border border-outline-variant/10">
                <div className="col-span-4 flex items-center gap-3">
                  <role.icon className={`${role.color} opacity-60 w-5 h-5`} />
                  <span className="font-medium">{role.label}</span>
                </div>
                <div className="col-span-5 flex gap-1">
                  {role.tags.map(tag => (
                    <span key={tag} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-mono">{tag}</span>
                  ))}
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-xs text-on-surface-variant font-mono opacity-50">{role.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-surface-low rounded-xl p-8 relative overflow-hidden border border-outline-variant/10">
          <h2 className="font-headline text-2xl font-semibold mb-2">Security Matrix</h2>
          <p className="text-xs text-on-surface-variant font-mono mb-8 opacity-60">ENCRYPTION LEVEL: AES-512 QUANTUM</p>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center bg-secondary/5">
                <Shield className="text-secondary w-6 h-6 fill-secondary/20" />
              </div>
              <div>
                <div className="text-sm font-bold">2FA Protocol</div>
                <div className="text-[10px] text-on-surface-variant">Mandatory for all administrative accounts</div>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-1 rounded font-mono">ACTIVE</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
                <Lock className="text-primary w-6 h-6 fill-primary/20" />
              </div>
              <div>
                <div className="text-sm font-bold">SSH Tunneling</div>
                <div className="text-[10px] text-on-surface-variant">Secure access for database modification</div>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] bg-surface-high text-on-surface-variant px-2 py-1 rounded font-mono">LOCKED</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 opacity-10">
            <Cpu className="w-full h-full text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};
