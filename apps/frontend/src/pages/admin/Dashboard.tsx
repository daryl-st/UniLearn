import React from 'react';
import { Download, Plus, Users, Layers, Database, Activity, Shield, FileCheck, AlertTriangle, TrendingUp } from 'lucide-react';
// import { StatCard } from '@/components/StatCard';

export const Dashboard: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-on-surface">Operations Dashboard</h1>
          <p className="text-on-surface-variant text-sm">Welcome back, Admin. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-low px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-white transition-colors flex items-center gap-2 border border-border shadow-sm">
            <Download className="w-4 h-4" /> Export Protocol
          </button>
          <button className="bg-primary-brand text-white px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-primary-brand/20">
            <Plus className="w-4 h-4" /> New Provision
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-4 gap-6">
          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sleek">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Active Users</span>
              <Users className="text-primary-brand w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">128,492</span>
              <span className="text-secondary-accent text-xs font-bold mt-1">+14.2% since last week</span>
            </div>
          </div>

          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sleek">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Active Modules</span>
              <Layers className="text-primary-brand w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">3,812</span>
              <span className="text-secondary-accent text-xs font-bold mt-1">+8.1% vs target</span>
            </div>
          </div>

          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sleek">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Storage Cluster</span>
              <Database className="text-primary-brand w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">4.2 <span className="text-xl">PB</span></span>
              <span className="text-on-surface-variant text-xs font-medium mt-1">92% capacity utilized</span>
            </div>
          </div>

          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sleek">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">System Health</span>
              <Activity className="text-secondary-accent w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">99.98%</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary-accent animate-pulse"></span>
                <span className="text-[10px] font-bold text-secondary-accent uppercase tracking-wider">Nodes Operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-low p-8 rounded-2xl relative overflow-hidden border border-border shadow-sleek">
          <h3 className="text-xs font-bold text-on-surface-variant mb-6 flex items-center gap-2 uppercase tracking-widest">
            <TrendingUp className="text-primary-brand w-4 h-4" /> Growth Vector
          </h3>
          <div className="h-48 w-full flex items-end gap-1.5">
            {[30, 45, 35, 60, 55, 80, 95].map((h, i) => (
              <div 
                key={i} 
                className={`w-full transition-all cursor-help rounded-t-lg ${i === 6 ? 'bg-primary-brand' : 'bg-surface hover:bg-primary-brand/30'}`} 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-surface-low rounded-2xl overflow-hidden border border-border shadow-sleek">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Protocol Audit Log</h3>
            <span className="text-[10px] font-bold text-primary-brand bg-primary-surface px-2.5 py-1 rounded-full uppercase tracking-wider">LIVE STREAM</span>
          </div>
          <div className="divide-y divide-border">
            {[
              { icon: Shield, label: 'Role Elevation: Admin_Alpha', sub: 'Subject: user_88291 • Initiated by System_Root', time: '02m ago', color: 'text-primary-brand' },
              { icon: FileCheck, label: 'Course Audit Completed', sub: 'Module: Advanced Quantum Theory • Status: VERIFIED', time: '14m ago', color: 'text-secondary-accent' },
              { icon: AlertTriangle, label: 'Anomaly Detected: Multiple Login', sub: 'Endpoint: 192.168.1.1 • Location: Virtual Node 7', time: '31m ago', color: 'text-error' },
            ].map((event, i) => (
              <div key={i} className="p-5 flex items-center gap-4 hover:bg-primary-surface/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center">
                  <event.icon className={`w-5 h-5 ${event.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">{event.label}</p>
                  <p className="text-xs text-on-surface-variant">{event.sub}</p>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">{event.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-brand hover:bg-primary-surface/30 transition-colors border-t border-border">View Full Audit History</button>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-surface-low p-8 rounded-2xl border border-border shadow-sleek">
          <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-8">Top Performing Clusters</h3>
          <div className="space-y-8">
            {[
              { label: 'Neuro-Tech Academy', sub: '98.2% Completion Rate', val: 98, rank: 'TOP 1' },
              { label: 'Cohort Sigma-9', sub: '94.5% Engagement Index', val: 94, rank: 'TOP 2' },
              { label: 'Cyber Defense Institute', sub: '91.0% Success Rate', val: 91, rank: 'TOP 3' },
            ].map((cluster, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{cluster.label}</p>
                    <p className="text-xs text-on-surface-variant">{cluster.sub}</p>
                  </div>
                  <span className="text-[10px] font-bold text-secondary-accent bg-secondary-accent/10 px-2 py-0.5 rounded uppercase">{cluster.rank}</span>
                </div>
                <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-primary-brand h-full transition-all duration-1000 rounded-full" style={{ width: `${cluster.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 h-64 rounded-2xl relative overflow-hidden glass-effect">
          <img 
            src="https://picsum.photos/seed/network/1200/400" 
            alt="Global Data Network" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h2 className="text-2xl font-bold text-primary-brand mb-2 uppercase tracking-tight">System Core Pulse</h2>
            <p className="text-on-surface-variant max-w-md text-sm font-medium">Real-time data synchronization across 14 decentralized nodes. Latency is currently within optimal parameters ( <span className="text-secondary-accent font-bold">14ms</span> ).</p>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-8">
            <div className="text-right">
              <p className="text-[10px] font-mono text-on-surface-variant uppercase mb-1">Compute Load</p>
              <p className="text-xl font-headline font-bold">24.2%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-on-surface-variant uppercase mb-1">API Throughput</p>
              <p className="text-xl font-headline font-bold">12.8k/s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
