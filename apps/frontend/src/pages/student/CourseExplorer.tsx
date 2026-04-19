import { motion } from 'motion/react';
import { ChevronDown, Play, Clock, BarChart, Terminal, BookOpen, Plus, Box } from 'lucide-react';
import { COURSES } from '@/utils/constants';

interface CoursesProps {
  onCourseSelect: (id: string) => void;
}

// TODO: Refactor this component into smaller components like course card and catalog grid.
// TODO: Implement the onCourseSelect callback and pass it to the course cards.

// Needs refactroring - too much hardcoded data and UI logic in one component, but good enough for MVP phase.
// export default function Courses({ onCourseSelect }: CoursesProps) {
export default function Courses() {
  const { onCourseSelect }: CoursesProps = {
    onCourseSelect: (id: string) => alert(`Selected course ID: ${id} (this will navigate to the course detail page in future iterations)`)
  };

  const categories = ['All Courses', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];

  return (
    <div className="p-8 space-y-8">
      {/* Filter Bar */}
      <section className="flex flex-wrap items-center gap-3">
        {categories.map((cat, i) => (
          <button 
            key={cat}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all ${
              i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-high text-on-surface-variant hover:text-white border border-outline-variant/10'
            }`}
          >
            {cat}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Sort by:</span>
            <button className="flex items-center gap-1 text-xs font-medium text-on-surface hover:text-primary transition-colors">
              Latest
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Hero Feature */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 group relative overflow-hidden rounded-sm bg-surface-low p-1 border border-outline-variant/5 cursor-pointer" onClick={() => onCourseSelect(COURSES[0].id)}>
          <div className="relative h-100 w-full overflow-hidden rounded-sm">
            <img 
              src={COURSES[0].thumbnail} 
              alt="Featured" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded-sm bg-secondary/20 text-secondary text-[10px] font-mono font-bold tracking-tighter uppercase border border-secondary/30">Course Spotlight</span>
                <span className="text-on-surface-variant font-mono text-[10px]">Academic Year: 3</span>
              </div>
              <h3 className="font-headline text-4xl font-bold text-white mb-3 leading-tight tracking-tighter">{COURSES[0].title}</h3>
              <p className="text-on-surface-variant max-w-xl text-sm mb-8 leading-relaxed">{COURSES[0].description}</p>
              
              <div className="flex items-center gap-8">
                <button className="bg-primary text-on-primary px-8 py-3 rounded-sm font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/20">
                  <Play className="w-4 h-4 fill-current" />
                  Open Course
                </button>
                <div className="flex gap-6 text-on-surface-variant font-mono text-[11px] uppercase tracking-wider">
                  <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Last updated this week</span>
                  <span className="flex items-center gap-2"><BarChart className="w-3.5 h-3.5" /> {COURSES[0].level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-high rounded-sm p-6 border border-primary/10 glass-ai flex-1">
            <h4 className="font-headline text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="text-secondary w-5 h-5" />
              Quick Actions
            </h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-sm bg-surface-low border border-outline-variant/10 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">Filter by Department</p>
                  <p className="text-[10px] font-mono text-on-surface-variant mt-1">Computer Science</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-sm bg-surface-low border border-outline-variant/10 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">Reset Filters</p>
                  <p className="text-[10px] font-mono text-on-surface-variant mt-1">Show all enrolled courses</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-low rounded-sm p-6 border border-outline-variant/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Box className="w-16 h-16" />
            </div>
            <h4 className="font-headline text-[11px] font-bold text-on-surface-variant mb-6 uppercase tracking-[0.2em]">Course Progress</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[11px] mb-2 font-mono">
                  <span className="text-white">Database Systems</span>
                  <span className="text-on-surface-variant">68%</span>
                </div>
                <div className="h-1 bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[68%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-2 font-mono">
                  <span className="text-white">Software Engineering</span>
                  <span className="text-on-surface-variant">12%</span>
                </div>
                <div className="h-1 bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[12%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="space-y-6 pt-8">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-headline text-2xl font-bold text-white tracking-tight">My Courses</h3>
            <p className="text-on-surface-variant text-[11px] font-mono mt-1 uppercase tracking-widest">Access all courses assigned to your academic track</p>
          </div>
          <button className="text-primary text-xs font-bold hover:underline uppercase tracking-widest">Reset Filters</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {COURSES.map((course) => (
            <motion.div 
              key={course.id}
              whileHover={{ y: -4 }}
              onClick={() => onCourseSelect(course.id)}
              className="group cursor-pointer bg-surface-low rounded-sm overflow-hidden flex flex-col border border-outline-variant/5 hover:bg-surface-high transition-all"
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-black/60 backdrop-blur text-[9px] text-white font-mono uppercase tracking-widest border border-white/10">
                  {course.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-headline text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h4>
                <p className="text-on-surface-variant text-[13px] line-clamp-2 mb-6 leading-relaxed">{course.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-outline-variant/5">
                  <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-wider">{course.lessonsCount} Lessons</span>
                  <span className="text-on-surface-variant font-mono text-[10px] px-2 py-0.5 border border-outline-variant/20 rounded-sm uppercase tracking-tighter">{course.level}</span>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="xl:col-span-2 bg-surface-low rounded-sm p-8 border border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-center opacity-40 grayscale hover:opacity-60 transition-opacity">
            <div className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-headline text-lg font-bold text-white">No Courses Found</h4>
            <p className="text-on-surface-variant text-xs max-w-xs mt-2 leading-relaxed">No courses found for your current filters.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const Sparkles = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);
