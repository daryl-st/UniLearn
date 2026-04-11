import { useMemo } from 'react';
import {
  Download,
  Brain,
  Database,
  Shield,
  Sparkles,
  Bolt,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

const StatsGrid = () => (
  <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div className="flex min-h-32 flex-col justify-between border border-outline-variant/30 bg-surface-low p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">Progress</span>
      <div className="flex items-baseline gap-2">
        <span className="font-headline text-4xl font-bold text-on-surface">84.2</span>
        <span className="font-headline text-base font-semibold text-on-surface-variant">%</span>
      </div>
      <div className="h-1 w-full overflow-hidden bg-surface-highest">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '84.2%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-primary"
        />
      </div>
    </div>

    <div className="flex min-h-32 flex-col justify-between border border-outline-variant/30 bg-surface-low p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">Time Spent</span>
      <div className="flex items-baseline gap-2">
        <span className="font-headline text-4xl font-bold text-on-surface">128.5</span>
        <span className="font-headline text-base font-semibold text-on-surface-variant">HRS</span>
      </div>
      <span className="font-mono text-[11px] text-secondary">+12% vs last month</span>
    </div>

    <div className="flex min-h-32 flex-col justify-between border border-outline-variant/30 bg-surface-low p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">Completion</span>
      <div className="flex items-baseline gap-2">
        <span className="font-headline text-4xl font-bold text-on-surface">12</span>
        <span className="font-headline text-base font-semibold text-on-surface-variant">MODS</span>
      </div>
      <span className="font-mono text-[11px] text-on-surface-variant">2 modules in progress</span>
    </div>

    <div className="flex min-h-32 flex-col justify-between border border-primary/20 bg-primary/15 p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">AI Readiness</span>
      <div className="flex items-baseline gap-2">
        <span className="font-headline text-4xl font-bold text-on-surface">Tier 1</span>
      </div>
      <span className="font-mono text-[11px] text-on-surface-variant">Top 5% percentile</span>
    </div>
  </section>
);

const PerformanceChart = () => (
  <div className="relative overflow-hidden border border-outline-variant/30 bg-surface-low p-8 lg:col-span-2">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">Performance Curve</h3>
        <p className="font-mono text-[11px] text-on-surface-variant">Historical assessment scoring (Jan-Jun)</p>
      </div>
      <div className="flex gap-4 font-mono text-[10px] text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          CURRENT
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-surface-highest" />
          AVERAGE
        </div>
      </div>
    </div>

    <div className="relative h-64 w-full">
      <svg className="h-full w-full" viewBox="0 0 800 200">
        <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="0" y2="0" />
        <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="50" y2="50" />
        <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="100" y2="100" />
        <line stroke="rgba(255,255,255,0.05)" x1="0" x2="800" y1="150" y2="150" />

        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          d="M0,120 Q200,100 400,110 T800,90"
          fill="none"
          stroke="#2A2A2C"
          strokeDasharray="4"
          strokeWidth="2"
        />

        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          d="M0,150 L100,140 L200,90 L300,110 L400,60 L500,70 L600,30 L700,45 L800,20"
          fill="none"
          stroke="#D0BCFF"
          strokeWidth="3"
        />

        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5 }}
          cx="600"
          cy="30"
          r="4"
          fill="#D0BCFF"
        />

        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ delay: 1.5 }}
          cx="600"
          cy="30"
          r="12"
          fill="none"
          stroke="#D0BCFF"
        />
      </svg>
      <div className="absolute top-5 left-[75%] border border-outline-variant/40 bg-surface-high px-2 py-1">
        <span className="font-mono text-[10px] text-primary">Peak 98.4</span>
      </div>
    </div>

    <div className="mt-4 flex justify-between px-1 font-mono text-[10px] text-on-surface-variant">
      {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((month) => (
        <span key={month}>{month}</span>
      ))}
    </div>
  </div>
);

const ActivityPulse = () => {
  const blocks = useMemo(() => Array.from({ length: 49 }, () => Math.random()), []);

  return (
    <div className="border border-outline-variant/30 bg-surface-low p-8">
      <h3 className="mb-6 font-headline text-lg font-bold uppercase tracking-tight text-on-surface">Activity Pulse</h3>
      <div className="grid grid-cols-7 gap-1">
        {blocks.map((opacity, i) => {
          let backgroundColor = 'rgba(53, 52, 55, 0.2)';
          if (opacity > 0.8) backgroundColor = '#D0BCFF';
          else if (opacity > 0.4) backgroundColor = 'rgba(208, 188, 255, 0.4)';

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01 }}
              className="aspect-square w-full"
              style={{
                backgroundColor,
                opacity: opacity > 0.2 ? 1 : 0.2,
              }}
            />
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 font-mono text-[9px] text-on-surface-variant">
          <span>LESS</span>
          <div className="h-2 w-2 bg-surface-highest/20" />
          <div className="h-2 w-2 bg-primary/40" />
          <div className="h-2 w-2 bg-primary/70" />
          <div className="h-2 w-2 bg-primary" />
          <span>MORE</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.04em] text-secondary">Max Intensity: 4.2h/day</span>
      </div>
    </div>
  );
};

const CognitiveVectors = () => {
  const vectors = [
    { label: 'Neural Networks', value: 94 },
    { label: 'Linear Algebra', value: 78 },
    { label: 'System Architecture', value: 88 },
    { label: 'Prompt Engineering', value: 92 },
  ];

  return (
    <div className="border border-outline-variant/30 bg-surface-low p-8">
      <h3 className="mb-6 font-headline text-lg font-bold uppercase tracking-tight text-on-surface">Cognitive Vectors</h3>
      <div className="space-y-5">
        {vectors.map((vector) => (
          <div key={vector.label} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-on-surface">{vector.label}</span>
              <span className="font-mono text-[11px] text-primary">{vector.value}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden bg-surface-highest">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${vector.value}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type DeploymentItem = {
  icon: typeof Brain;
  title: string;
  id: string;
  metricLabel: string;
  metricValue: string;
  status: string;
  completed: boolean;
};

const ActiveDeployments = () => {
  const deployments: DeploymentItem[] = [
    {
      icon: Brain,
      title: 'Advanced LLM Training',
      id: 'MOD_04_TUNING',
      metricLabel: 'ACCURACY',
      metricValue: '0.9982',
      status: '82% COMPLETE',
      completed: false,
    },
    {
      icon: Database,
      title: 'Vector Database Ops',
      id: 'MOD_07_QUERY',
      metricLabel: 'LATENCY',
      metricValue: '42ms',
      status: '14% COMPLETE',
      completed: false,
    },
    {
      icon: Shield,
      title: 'AI Governance & Policy',
      id: 'MOD_01_ETHICS',
      metricLabel: 'INTEGRITY',
      metricValue: 'STABLE',
      status: 'COMPLETED',
      completed: true,
    },
  ];

  return (
    <div className="border border-outline-variant/30 bg-surface-low p-8 lg:col-span-2">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">Active Deployments</h3>
        <span className="font-mono text-[10px] text-on-surface-variant">Last updated: 12:45 UTC</span>
      </div>

      <div className="space-y-4">
        {deployments.map((deployment) => (
          <div key={deployment.id} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-outline-variant/30 bg-surface-high">
                <deployment.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">{deployment.title}</p>
                <p className="font-mono text-[10px] text-on-surface-variant">{deployment.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
              <div className="hidden text-right sm:block">
                <p className="font-mono text-[10px] text-on-surface-variant">{deployment.metricLabel}</p>
                <p className="font-mono text-sm text-secondary">{deployment.metricValue}</p>
              </div>

              <div
                className={
                  deployment.completed
                    ? 'inline-flex items-center gap-1 border border-secondary/30 bg-secondary/10 px-3 py-1 font-mono text-[11px] text-secondary'
                    : 'inline-flex items-center gap-1 border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] text-primary'
                }
              >
                <span>{deployment.status}</span>
                {deployment.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PredictiveRecommendation = () => (
  <section className="glass-ai ghost-border relative overflow-hidden rounded-sm p-8">
    <div className="absolute right-0 top-0 p-6">
      <Sparkles className="h-10 w-10 text-primary/20" />
    </div>

    <div className="relative z-10 max-w-3xl">
      <div className="mb-3 inline-flex items-center gap-2">
        <Bolt className="h-4 w-4 text-primary" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Predictive Recommendation</span>
      </div>

      <h3 className="font-headline text-2xl font-bold text-on-surface">
        You&apos;re ready for the &quot;Autonomous Systems&quot; advanced track.
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
        Based on your 94% accuracy in Neural Networks and sustained activity peaks, our engine predicts a 92.4% mastery
        probability in Level 4 Autonomous Operations. Should we initiate enrollment?
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-sm bg-primary px-6 py-2 font-headline text-xs font-bold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90" type="button">
          Enroll Now
        </button>
        <button className="rounded-sm border border-on-surface/20 bg-transparent px-6 py-2 font-headline text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-white/10" type="button">
          Dismiss
        </button>
      </div>
    </div>
  </section>
);

export default function Analytics() {
  return (
    <div className="flex min-h-full flex-col gap-6 p-6 md:gap-8 md:p-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">System Monitor // Student_ID_0912</span>
          <h2 className="mt-1 font-headline text-4xl font-bold tracking-tighter text-on-surface">STUDENT ANALYTICS</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="ghost-border inline-flex items-center gap-2 rounded-sm bg-surface-low px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
            <span className="font-mono text-[11px] text-on-surface-variant">ENGINE_STABLE</span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-1.5 font-headline text-sm font-semibold text-on-primary transition-opacity hover:opacity-90" type="button">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </section>

      <StatsGrid />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PerformanceChart />
        <ActivityPulse />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CognitiveVectors />
        <ActiveDeployments />
      </section>

      <PredictiveRecommendation />
    </div>
  );
}