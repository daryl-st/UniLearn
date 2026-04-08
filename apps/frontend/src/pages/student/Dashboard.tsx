import { motion } from 'motion/react';
import { Verified, Clock, Rocket, PlayCircle, Share2, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { COURSES, NOTIFICATIONS } from '@/utils/constants';

// i need to understand the need for this
// interface DashboardProps {
//   onCourseSelect: (id: string) => void;
// }

// needs refactoring - too much hardcoded data and UI logic in one component, but good enough for MVP phase. 
// Will break down into smaller components in future iterations.
// export default function Dashboard({ onCourseSelect }: DashboardProps) {
export default function Dashboard() {
  const stats = [
    { label: 'Completion Rate', value: '92.4%', change: '+4.2%', trend: 'up', icon: Verified },
    { label: 'Total Hours', value: '148.5', status: 'Active session', icon: Clock },
    { label: 'Active Courses', value: '04', detail: '2 due this week', icon: Rocket },
  ];

  return (
    <div className="p-8 space-y-10">
      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-low p-6 rounded-sm border border-outline-variant/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">{stat.label}</p>
            <h3 className="font-headline text-4xl font-bold text-white">{stat.value}</h3>
            <div className="mt-4 flex items-center gap-2">
              {stat.change && <span className="text-secondary font-mono text-xs">{stat.change}</span>}
              {stat.status && (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">{stat.status}</span>
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                </div>
              )}
              {stat.detail && <span className="text-on-surface-variant font-mono text-xs">{stat.detail}</span>}
              {stat.trend && <span className="text-on-surface-variant/40 font-mono text-[10px]">vs last month</span>}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Continue Learning */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h4 className="font-headline text-lg font-bold text-white uppercase tracking-tight">Continue Learning</h4>
          <button className="text-primary text-[11px] font-mono uppercase tracking-widest hover:underline">View All History</button>
        </div>
        
        <div className="glass-ai rounded-sm p-8 flex flex-col md:flex-row gap-8 items-center border border-primary/10 cursor-pointer" onClick={() => onCourseSelect(COURSES[0].id)}>
          <div className="w-full md:w-1/3 aspect-video rounded-sm overflow-hidden relative shadow-2xl group cursor-pointer">
            <img 
              src={COURSES[0].thumbnail} 
              alt="Neural networks" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <PlayCircle className="text-white w-4 h-4" />
              <span className="text-white text-[10px] font-mono">Module 08: Backpropagation</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono rounded-sm border border-secondary/20">ADVANCED</span>
                <span className="text-on-surface-variant font-mono text-[10px]">CO-P049</span>
              </div>
              <h3 className="font-headline text-3xl font-bold text-white leading-tight">{COURSES[0].title}</h3>
              <p className="text-on-surface-variant text-sm max-w-xl mt-2">{COURSES[0].description}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Progress: {COURSES[0].progress}%</span>
                <span className="text-[10px] font-mono text-primary uppercase tracking-widest">12h 45m left</span>
              </div>
              <div className="w-full h-1 bg-surface-high rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${COURSES[0].progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
            
            <div className="pt-4 flex items-center gap-4">
              <button className="px-8 py-3 bg-primary text-on-primary font-headline font-bold rounded-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10">
                Resume Session
              </button>
              <button className="p-3 bg-surface-high text-on-surface rounded-sm hover:bg-surface-high/80 transition-colors border border-outline-variant/10">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recommended */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-headline text-lg font-bold text-white uppercase tracking-tight">Recommended for your Path</h4>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-low text-on-surface-variant hover:text-white transition-colors border border-outline-variant/10">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-low text-on-surface-variant hover:text-white transition-colors border border-outline-variant/10">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSES.slice(1, 3).map((course) => (
              <div 
                key={course.id} 
                // onClick={() => onCourseSelect(course.id)}
                className="bg-surface-low rounded-sm p-4 group cursor-pointer hover:bg-surface-high transition-all border border-outline-variant/5"
              >
                <div className="aspect-video w-full rounded-sm mb-4 overflow-hidden relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-surface/60 backdrop-blur-md p-1.5 rounded-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <p className="font-mono text-[9px] text-primary uppercase tracking-[0.2em] mb-1">{course.category}</p>
                <h5 className="font-headline font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors">{course.title}</h5>
                <div className="flex items-center gap-3 mt-4">
                  <img src={course.instructorImage} alt={course.instructor} className="w-6 h-6 rounded-sm grayscale" referrerPolicy="no-referrer" />
                  <span className="text-[11px] text-on-surface-variant">{course.instructor}</span>
                  <span className="ml-auto text-on-surface-variant font-mono text-[10px]">{course.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Feed */}
        <div className="space-y-6">
          <h4 className="font-headline text-lg font-bold text-white uppercase tracking-tight">System Feed</h4>
          <div className="bg-surface-low rounded-sm border border-outline-variant/5 divide-y divide-outline-variant/5">
            {NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="p-4 flex gap-4 hover:bg-surface-high/30 transition-colors">
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                  notif.type === 'system' ? 'bg-secondary/10 text-secondary' :
                  notif.type === 'instructor' ? 'bg-primary/10 text-primary' :
                  'bg-primary-fixed-dim/10 text-primary-fixed-dim'
                }`}>
                  {notif.type === 'system' ? <CheckCircle2 className="w-4 h-4" /> :
                   notif.type === 'instructor' ? <MessageSquare className="w-4 h-4" /> :
                   <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-[13px] text-white font-medium">{notif.title}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{notif.description}</p>
                  <p className="text-[9px] font-mono text-on-surface-variant/40 mt-2 uppercase tracking-tighter">{notif.time} • {notif.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors bg-surface-high rounded-sm border border-outline-variant/10">
            Clear Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
