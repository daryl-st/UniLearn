import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Clock, 
  BarChart, 
  BookOpen, 
  Play, 
  Lock, 
  CheckCircle2, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  ArrowRight,
  Info
} from 'lucide-react';
import { COURSES } from '@/utils/constants';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  onStart: () => void;
}

// Needs refactrowing - too much hardcoded data and UI logic in one component, but good enough for MVP phase. 
// Will break down into smaller components in future iterations.
export default function CourseDetail({ courseId, onBack, onStart }: CourseDetailProps) {
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];

  return (
    <div className="min-h-full bg-surface">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
        
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end max-w-7xl mx-auto w-full">
          <button 
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Catalog
          </button>

          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-sm bg-primary/20 text-primary text-[10px] font-mono font-bold tracking-tighter uppercase border border-primary/30">
                {course.category}
              </span>
              <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">
                Protocol ID: {course.id.toUpperCase()}
              </span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter">
              {course.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-mono text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="flex items-center gap-2"><BarChart className="w-4 h-4" /> {course.level}</span>
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.lessonsCount} Lessons</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-8 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Curriculum */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <h3 className="font-headline text-xl font-bold text-white uppercase tracking-tight">Curriculum Overview</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="space-y-4">
            {course.modules?.map((module, idx) => (
              <div 
                key={module.id} 
                className={`bg-surface-low rounded-sm border border-outline-variant/5 overflow-hidden transition-all ${module.isLocked ? 'opacity-60' : ''}`}
              >
                <div className="p-5 flex items-center justify-between bg-surface-high/30">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-on-surface-variant/40">0{idx + 1}</span>
                    <h4 className="font-headline font-bold text-white text-sm uppercase tracking-wide">{module.title}</h4>
                  </div>
                  {module.isLocked ? (
                    <Lock className="w-4 h-4 text-on-surface-variant/40" />
                  ) : (
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase">{module.lessons.length} Lessons</span>
                  )}
                </div>
                
                <div className="divide-y divide-outline-variant/5">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="p-4 flex items-center justify-between group hover:bg-surface-high/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${lesson.isCompleted ? 'bg-secondary/10 text-secondary' : 'bg-surface-high text-on-surface-variant'}`}>
                          {lesson.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className="text-[13px] text-white font-medium group-hover:text-primary transition-colors">{lesson.title}</p>
                          <p className="text-[10px] font-mono text-on-surface-variant uppercase mt-0.5">{lesson.type} • {lesson.duration}</p>
                        </div>
                      </div>
                      {!module.isLocked && (
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary hover:bg-primary/10 rounded-sm">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-low rounded-sm p-8 border border-outline-variant/5 space-y-8 sticky top-24">
            <div className="space-y-4">
              <button 
                onClick={onStart}
                className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Learning
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 bg-surface-high text-on-surface-variant hover:text-white rounded-sm border border-outline-variant/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <Bookmark className="w-3.5 h-3.5" />
                  Save
                </button>
                <button className="py-3 bg-surface-high text-on-surface-variant hover:text-white rounded-sm border border-outline-variant/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-outline-variant/5 space-y-6">
              <div className="flex items-center gap-4">
                <img 
                  src={course.instructorImage} 
                  alt={course.instructor} 
                  className="w-12 h-12 rounded-sm grayscale"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Lead Instructor</p>
                  <p className="text-sm font-bold text-white">{course.instructor}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Course Includes</h5>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[13px] text-on-surface-variant">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-3 text-[13px] text-on-surface-variant">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-3 text-[13px] text-on-surface-variant">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Access on mobile and TV</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-outline-variant/5">
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-sm flex gap-4">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  This protocol is part of the <span className="text-white font-bold">UniLearn Enterprise Tier</span>. Your organization has full clearance for all modules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
