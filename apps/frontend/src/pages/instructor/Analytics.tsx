import React from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  AlertCircle, 
  Video, 
  BookOpen, 
  Mail,
  Zap,
  Terminal
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

const dropoffData = [
  { mod: 'MOD_01', engagement: 100, status: 'normal' },
  { mod: 'MOD_02', engagement: 98, status: 'normal' },
  { mod: 'MOD_03', engagement: 94, status: 'normal' },
  { mod: 'MOD_04', engagement: 65, status: 'critical' },
  { mod: 'MOD_05', engagement: 62, status: 'normal' },
  { mod: 'MOD_06', engagement: 60, status: 'normal' },
  { mod: 'MOD_07', engagement: 58, status: 'normal' },
  { mod: 'MOD_08', engagement: 55, status: 'normal' },
  { mod: 'MOD_09', engagement: 40, status: 'critical' },
  { mod: 'MOD_10', engagement: 38, status: 'normal' },
];

const calibrationData = [
  { name: '0', actual: 90, target: 80 },
  { name: '25', actual: 85, target: 75 },
  { name: '50', actual: 60, target: 70 },
  { name: '75', actual: 55, target: 65 },
  { name: '100', actual: 45, target: 50 },
];

const atRiskCohort = [
  { id: '1', name: 'Elena Rodriguez', uid: '8849-PROTO', gap: '12 Days', score: '48%', image: 'https://picsum.photos/seed/elena/100/100' },
  { id: '2', name: 'Marcus Chen', uid: '1102-PROTO', gap: '09 Days', score: '52%', image: 'https://picsum.photos/seed/marcus/100/100' },
  { id: '3', name: 'Sarah Jenkins', uid: '4492-PROTO', gap: '07 Days', score: '61%', image: 'https://picsum.photos/seed/sarah/100/100' },
];

export const Analytics: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-end justify-between mb-10">
        <div>
          <nav className="flex gap-2 text-[10px] font-mono text-outline opacity-50 uppercase tracking-widest mb-1">
            <span>Root</span> / <span>Instructor</span> / <span>Performance</span>
          </nav>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Course Analytics</h1>
        </div>
        <button className="bg-primary text-on-primary px-5 py-2 rounded-sm font-semibold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95">
          <Download size={16} />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <section className="col-span-12 lg:col-span-8 bg-surface-low p-6 rounded-lg border border-outline-variant/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline text-lg font-bold">Module Drop-off Intensity</h2>
              <p className="text-xs text-outline">Engagement decay across curriculum sequence</p>
            </div>
            <div className="flex gap-1">
              {[0.2, 0.4, 0.6, 0.8, 1].map(o => (
                <div key={o} className="w-3 h-3 bg-primary rounded-full" style={{ opacity: o }}></div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-10 gap-2 h-48 items-end">
            {dropoffData.map((d, i) => (
              <div key={i} className="flex flex-col gap-1 items-center h-full group relative">
                <div 
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-500",
                    d.status === 'critical' ? "bg-error/60" : "bg-primary"
                  )} 
                  style={{ height: `${d.engagement}%`, opacity: d.status === 'critical' ? 1 : d.engagement / 100 }}
                ></div>
                <span className={cn(
                  "font-mono text-[9px] rotate-45 mt-4 origin-left whitespace-nowrap",
                  d.status === 'critical' ? "text-error" : "text-outline opacity-40"
                )}>
                  {d.mod}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-14 p-3 bg-surface-high/50 rounded flex items-start gap-3 border-l-2 border-error">
            <AlertCircle className="text-error shrink-0" size={18} />
            <p className="text-xs leading-relaxed">
              <strong className="text-on-surface">Critical Drop-off Detected:</strong> Module 4 (Advanced Logic) shows a 32% increase in churn.
            </p>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 bg-surface-low p-6 rounded-lg border border-outline-variant/5 flex flex-col">
          <h2 className="font-headline text-lg font-bold mb-1">Score Calibration</h2>
          <p className="text-xs text-outline mb-6">Actual Avg. vs. Protocol Benchmarks</p>
          <div className="flex-1 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calibrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2c" vertical={false} />
                <XAxis hide />
                <YAxis hide domain={[0, 100]} />
                <Line type="monotone" dataKey="target" stroke="#948f9a" strokeDasharray="4 4" strokeWidth={1.5} dot={false} opacity={0.4} />
                <Line type="monotone" dataKey="actual" stroke="#d0bcff" strokeWidth={3} dot={{ r: 4, fill: '#d0bcff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-tighter opacity-50">Current Avg</div>
              <div className="font-headline text-3xl font-bold text-primary">82.4%</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-tighter opacity-50">Protocol Delta</div>
              <div className="font-headline text-3xl font-bold text-secondary">+4.2%</div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <section className="col-span-12 lg:col-span-5 bg-surface-low p-6 rounded-lg border border-outline-variant/5">
          <h2 className="font-headline text-lg font-bold mb-1">Instructional Efficiency</h2>
          <div className="space-y-8 mt-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Video className="text-secondary" size={18} />
                  <span className="font-semibold text-sm">Video Completion</span>
                </div>
                <span className="font-mono text-xs text-secondary">92%</span>
              </div>
              <div className="w-full h-1 bg-surface-highest rounded-full overflow-hidden">
                <div className="bg-secondary h-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-primary" size={18} />
                  <span className="font-semibold text-sm">Documentation</span>
                </div>
                <span className="font-mono text-xs text-primary">64%</span>
              </div>
              <div className="w-full h-1 bg-surface-highest rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '64%' }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-7 bg-surface-low p-6 rounded-lg border border-outline-variant/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-lg font-bold">At-Risk Cohort</h2>
            <button className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest hover:underline">View All 42</button>
          </div>
          <div className="space-y-3">
            {atRiskCohort.map((student) => (
              <div key={student.id} className="group flex items-center justify-between p-3 rounded-sm hover:bg-surface-high transition-colors duration-150">
                <div className="flex items-center gap-4">
                  <img src={student.image} alt="" className="w-10 h-10 rounded-sm object-cover filter grayscale group-hover:grayscale-0" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-semibold text-sm">{student.name}</div>
                    <div className="text-[10px] font-mono opacity-40">UID: {student.uid}</div>
                  </div>
                </div>
                <div className="flex gap-8 text-right">
                  <div className="text-sm font-semibold text-error">{student.score}</div>
                  <button className="text-primary hover:bg-primary/10 p-2 rounded-sm"><Mail size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};
