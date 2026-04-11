import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  Zap, 
  DollarSign,
  PlusCircle,
  UploadCloud,
  ClipboardCheck,
  CheckCircle,
  Brain,
  UserPlus,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Students', value: '12.4K', change: '+14.2%', trend: 'up', icon: Users },
  { label: 'Completion Rate', value: '84.3%', change: 'Optimal', trend: 'up', icon: CheckCircle2 },
  { label: 'Engagement Score', value: '9.2', subValue: '/10', change: 'Peak Sync', trend: 'up', icon: Zap },
  { label: 'Revenue (Enterprise)', value: '$42.8K', change: '+8.4%', trend: 'up', icon: DollarSign },
];

const chartData = [
  { name: 'Cycle 01', value: 42 },
  { name: 'Cycle 05', value: 55 },
  { name: 'Cycle 10', value: 70 },
  { name: 'Cycle 15', value: 60 },
  { name: 'Cycle 20', value: 85 },
  { name: 'Cycle 25', value: 95, isPeak: true },
  { name: 'Cycle 28', value: 75 },
  { name: 'Cycle 30', value: 80 },
];

const activities = [
  { id: '1', user: 'Alex Rivera', action: 'completed', target: 'Module 04: Logic Gates', time: '3m ago', status: 'Verified', type: 'success', icon: CheckCircle },
  { id: '2', user: 'Sarah Chen', action: 'attempted', target: 'Final Quiz: Neural Nets', time: '14m ago', status: 'Score: 98%', type: 'info', icon: Brain },
  { id: '3', user: 'Marcus Thorne', action: 'enrolled in', target: 'Advanced AI', time: '1h ago', type: 'neutral', icon: UserPlus },
  { id: '4', user: 'User #8901', action: 'failed authentication check', time: '2h ago', status: 'Logged', type: 'warning', icon: AlertTriangle },
];

const courses = [
  { 
    id: '1', 
    title: 'Neural Network Architectures', 
    description: 'Foundations of deep learning systems.', 
    progress: 64, 
    enrolled: '4,281', 
    tag: 'ADVANCED',
    image: 'https://picsum.photos/seed/neural/800/400'
  },
  { 
    id: '2', 
    title: 'Bio-Digital Interfaces', 
    description: 'Ethics and mechanics of neural links.', 
    progress: 32, 
    enrolled: '1,102', 
    tag: 'ESSENTIAL',
    image: 'https://picsum.photos/seed/bio/800/400'
  },
];

export const Dashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Instructor Dashboard</h1>
          <p className="text-outline font-sans mt-1">System operational. Performance metrics within nominal range.</p>
        </div>
        <div className="bg-surface-low px-3 py-1.5 rounded flex items-center gap-2 border border-outline-variant/10">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.5)]"></span>
          <span className="text-xs font-mono text-secondary uppercase tracking-widest">Live: 1,248 Nodes</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-low p-6 rounded-sm relative overflow-hidden group border border-outline-variant/5"
          >
            <div className="relative z-10">
              <span className="text-xs font-mono text-outline uppercase tracking-widest">{stat.label}</span>
              <div className="text-4xl font-headline font-bold mt-2 tracking-tighter">
                {stat.value}
                {stat.subValue && <span className="text-xl opacity-40">{stat.subValue}</span>}
              </div>
              <div className={cn(
                "flex items-center gap-1 mt-4 text-xs font-mono",
                stat.trend === 'up' ? "text-secondary" : "text-error"
              )}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Chart Section */}
          <section className="bg-surface-low p-6 rounded-sm border border-outline-variant/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-headline font-semibold text-lg">Engagement Over Time</h3>
                <p className="text-xs text-outline font-mono uppercase tracking-widest">Temporal Protocol Sync</p>
              </div>
              <div className="flex gap-2">
                {['7D', '30D', '90D'].map((t) => (
                  <button 
                    key={t}
                    className={cn(
                      "px-3 py-1 text-[10px] font-mono rounded-sm transition-colors",
                      t === '30D' ? "bg-primary text-on-primary" : "bg-surface-high text-outline hover:text-on-surface"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2c" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#948f9a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#948f9a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(208, 188, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: '#1f1f21', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isPeak ? '#d0bcff' : '#353437'} 
                        className="hover:fill-primary/60 transition-colors cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Active Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-semibold text-lg">Active Courses</h3>
              <button className="text-xs font-mono text-primary hover:underline">View All Protocols</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-surface-low rounded-sm overflow-hidden group border border-outline-variant/5">
                  <div className="h-32 bg-surface-high relative overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-low to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className={cn(
                        "backdrop-blur-md text-[10px] px-2 py-1 font-mono rounded-sm border",
                        course.tag === 'ADVANCED' ? "bg-primary/20 text-primary border-primary/20" : "bg-secondary/20 text-secondary border-secondary/20"
                      )}>
                        {course.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="font-headline font-medium group-hover:text-primary transition-colors">{course.title}</h4>
                      <p className="text-xs text-outline mt-1">{course.description}</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-wider">
                        <span className="text-outline">Avg. Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1 bg-surface-highest rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", course.tag === 'ADVANCED' ? "bg-primary" : "bg-secondary")} 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border border-surface bg-surface-highest flex items-center justify-center text-[8px] font-mono">
                            {i === 3 ? '+4k' : ''}
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] font-mono text-outline">{course.enrolled} Enrolled</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <section className="bg-surface-low p-6 rounded-sm border border-outline-variant/5">
            <h3 className="font-headline font-semibold text-lg mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-primary text-on-primary rounded-sm group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <PlusCircle size={20} />
                  <span className="font-semibold text-sm">Create New Course</span>
                </div>
                <ArrowRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-surface-high hover:bg-surface-highest rounded-sm group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <UploadCloud size={20} className="text-outline" />
                  <span className="font-semibold text-sm">Upload Assets</span>
                </div>
                <ArrowRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-surface-high hover:bg-surface-highest rounded-sm group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <ClipboardCheck size={20} className="text-outline" />
                  <span className="font-semibold text-sm">Review Quizzes</span>
                </div>
                <div className="bg-error-container text-error text-[10px] font-mono px-1.5 py-0.5 rounded">12</div>
              </button>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="bg-surface-low p-6 rounded-sm border border-outline-variant/5">
            <h3 className="font-headline font-semibold text-lg mb-6">Recent Student Activity</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-surface-highest"></div>
              {activities.map((activity) => (
                <div key={activity.id} className="relative flex gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10 border",
                    activity.type === 'success' ? "bg-secondary/10 border-secondary/20 text-secondary" :
                    activity.type === 'info' ? "bg-primary/10 border-primary/20 text-primary" :
                    activity.type === 'warning' ? "bg-error/10 border-error/20 text-error" :
                    "bg-surface-highest border-outline-variant/10 text-outline"
                  )}>
                    <activity.icon size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-on-surface">{activity.user}</span> {activity.action} <span className="text-primary">{activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-outline uppercase">{activity.time}</span>
                      {activity.status && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-surface-highest"></span>
                          <span className={cn(
                            "text-[10px] font-mono",
                            activity.type === 'success' ? "text-secondary" :
                            activity.type === 'info' ? "text-primary" :
                            activity.type === 'warning' ? "text-error" :
                            "text-outline"
                          )}>{activity.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2 border border-outline-variant/20 rounded-sm text-xs font-mono uppercase tracking-widest text-outline hover:bg-surface-high hover:text-on-surface transition-all">
              Download Log Protocol
            </button>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
