import React from 'react';
import { Calendar, Download, TrendingUp, Users, Zap, Database, Shield, Router, Cpu, Globe } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useThemeStore } from '@/stores/themeStore';

export const Analytics: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const data = [
    { name: 'M', value: 400, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'T', value: 300, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'W', value: 600, color: isDarkMode ? '#A78BFA' : '#7C3AED' },
    { name: 'T', value: 200, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'F', value: 500, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'S', value: 800, color: '#10B981' },
    { name: 'S', value: 700, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'M', value: 450, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'T', value: 350, color: isDarkMode ? '#A78BFA' : '#7C3AED' },
    { name: 'W', value: 550, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'T', value: 250, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'F', value: 650, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'S', value: 400, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'S', value: 600, color: isDarkMode ? '#A78BFA' : '#7C3AED' },
    { name: 'M', value: 300, color: isDarkMode ? '#334155' : '#E2E8F0' },
    { name: 'T', value: 800, color: '#10B981' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight mb-2 uppercase">Platform Analytics</h1>
          <p className="text-on-surface-variant font-mono text-xs uppercase tracking-[0.2em]">
            Operational Status: <span className="text-secondary-accent">Nominal</span> // Data Sync: Active
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-high text-on-surface px-4 py-2 rounded flex items-center gap-2 hover:bg-primary-surface transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-mono">L30D</span>
          </button>
          <button className="bg-primary-brand text-white px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Export Protocol</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-5 mb-10">
        <div className="col-span-12 lg:col-span-8 bg-surface-low rounded-lg p-6 flex flex-col h-[400px] border border-border">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline text-xl font-bold uppercase">Active Processing Nodes</h3>
              <p className="text-on-surface-variant text-xs font-mono">Concurrent Session Throughput</p>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <span className="block text-secondary-accent font-mono text-lg font-bold">12,482</span>
                <span className="text-[10px] text-on-surface-variant uppercase">Current</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div>
                <span className="block text-primary-brand font-mono text-lg font-bold">+18.4%</span>
                <span className="text-[10px] text-on-surface-variant uppercase">Growth</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', 
                    border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, 
                    borderRadius: '8px',
                    color: isDarkMode ? '#F8FAFC' : '#1E293B'
                  }}
                  itemStyle={{ color: isDarkMode ? '#F8FAFC' : '#1E293B', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <div className="glass-effect rounded-lg p-6 flex-1 border border-primary-brand/10">
            <div className="flex justify-between items-start mb-4">
              <Zap className="text-primary-brand w-5 h-5 fill-primary-brand" />
              <span className="text-[10px] font-mono text-primary-brand/80 px-2 py-0.5 bg-primary-brand/10 rounded uppercase">Peak Load</span>
            </div>
            <h4 className="text-on-surface-variant text-xs font-mono uppercase tracking-widest mb-1">Compute Efficiency</h4>
            <p className="text-4xl font-headline font-bold text-on-surface">98.2<span className="text-primary-brand text-xl">%</span></p>
            <div className="mt-4 h-1 w-full bg-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-primary-brand w-[98.2%]"></div>
            </div>
          </div>
          <div className="bg-surface-low rounded-lg p-6 flex-1 border border-border">
            <div className="flex justify-between items-start mb-4">
              <Users className="text-secondary-accent w-5 h-5 fill-secondary-accent" />
              <span className="text-[10px] font-mono text-secondary-accent/80 px-2 py-0.5 bg-secondary-accent/10 rounded uppercase">Engagement</span>
            </div>
            <h4 className="text-on-surface-variant text-xs font-mono uppercase tracking-widest mb-1">Daily Active Users</h4>
            <p className="text-4xl font-headline font-bold text-on-surface">42,091</p>
            <p className="text-secondary-accent text-[10px] font-mono mt-2 uppercase">↑ 4.2% from yesterday</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h3 className="font-headline text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary-brand rounded-full"></span>
            Activity Heatmap (Regional)
          </h3>
          <div className="bg-surface-low rounded-lg p-6 overflow-hidden relative min-h-[320px] border border-border">
            <div className="grid grid-cols-12 gap-1 opacity-80">
              {Array.from({ length: 72 }).map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-square rounded-sm" 
                  style={{ backgroundColor: `rgba(124, 58, 237, ${Math.random() * 0.8})` }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-surface-high/60 backdrop-blur p-3 rounded-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest">Global Interaction Density</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-mono text-on-surface-variant">MIN</span>
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary-brand/10"></div>
                  <div className="w-2 h-2 rounded-full bg-primary-brand/40"></div>
                  <div className="w-2 h-2 rounded-full bg-primary-brand"></div>
                </div>
                <span className="text-[8px] font-mono text-on-surface-variant">MAX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-headline text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-secondary-accent rounded-full"></span>
            Operational Intelligence
          </h3>
          <div className="bg-surface-low rounded-lg p-1 divide-y divide-border border border-border">
            {[
              { icon: Database, label: 'Data Ingest Rate', sub: 'Storage Cluster A', val: '840 MB/s', status: 'Normal Params', color: 'text-secondary-accent' },
              { icon: Shield, label: 'Auth Requests', sub: 'Token Validator', val: '12.8k/min', status: 'Verified 99.9%', color: 'text-primary-brand' },
              { icon: Router, label: 'Edge Latency', sub: 'Nodes 1-14', val: '14 ms', status: 'Optimized', color: 'text-secondary-accent' },
              { icon: Cpu, label: 'CPU Allocation', sub: 'Neural Engine', val: '92%', status: 'High Load', color: 'text-error' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-high transition-colors">
                <div className="flex items-center gap-4">
                  <item.icon className="text-on-surface-variant w-5 h-5" />
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-[10px] font-mono text-on-surface-variant uppercase">{item.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono ${item.color}`}>{item.val}</p>
                  <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 bg-surface-low rounded-lg overflow-hidden group border border-border">
          <div className="h-48 relative overflow-hidden">
            <img 
              src="https://picsum.photos/seed/data/800/400" 
              alt="Data Mesh" 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-low to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <span className="bg-secondary-accent/20 text-secondary-accent text-[10px] px-2 py-0.5 rounded font-mono uppercase">Predictive</span>
              <h4 className="text-2xl font-headline font-bold uppercase mt-2">Next Cycle Growth</h4>
            </div>
          </div>
          <div className="p-6 pt-0">
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Neural forecasting models indicate a potential <span className="text-primary-brand font-bold">14.2% spike</span> in user onboarding within the APAC region over the next 72 hours based on current content velocity.
            </p>
            <div className="flex items-center justify-between font-mono text-[11px] uppercase border-t border-border pt-4">
              <span className="text-on-surface-variant">Confidence Index</span>
              <span className="text-secondary-accent">94% Highly Probable</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-5">
          <div className="bg-surface-high rounded-lg p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-transform border border-border">
            <h5 className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-4">Retention Rate</h5>
            <div>
              <p className="text-5xl font-headline font-bold text-on-surface mb-2">88.4<span className="text-primary-brand text-2xl">%</span></p>
              <div className="flex items-center gap-1 text-secondary-accent text-xs font-mono">
                <TrendingUp className="w-4 h-4" />
                <span>+1.2% VS LY</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-high rounded-lg p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-transform border border-border">
            <h5 className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.2em] mb-4">Avg. Session</h5>
            <div>
              <p className="text-5xl font-headline font-bold text-on-surface mb-2">42<span className="text-primary-brand text-2xl">m</span></p>
              <div className="flex items-center gap-1 text-on-surface-variant text-xs font-mono">
                <span className="w-4 h-0.5 bg-on-surface-variant"></span>
                <span>STABLE</span>
              </div>
            </div>
          </div>
          <div className="bg-primary-brand rounded-lg p-6 col-span-2 flex items-center justify-between text-white">
            <div>
              <h5 className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-80 mb-1">Global System Reach</h5>
              <p className="text-2xl font-headline font-bold uppercase">142 Countries Operational</p>
            </div>
            <Globe className="w-12 h-12 opacity-20" />
          </div>
        </div>
      </section>
    </div>
  );
};
