import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  BarChart2, 
  Trash2, 
  X,
  Edit,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

const courses = [
  { 
    id: 'CoSc4411', 
    title: 'Artificial Intelligence - Search Algorithms Lecture', 
    lastSync: '2h ago', 
    date: 'Apr 14, 2026',
    students: '124',
    growth: 'v3',
    status: 'Published',
    image: 'https://picsum.photos/seed/nn/100/100'
  },
  { 
    id: 'CoSc3312', 
    title: 'Database Systems - Normalization Notes', 
    lastSync: '1d ago', 
    date: 'Apr 13, 2026',
    students: '98',
    growth: 'v2',
    status: 'Draft',
    image: 'https://picsum.photos/seed/quantum/100/100'
  },
  { 
    id: 'CoSc2221', 
    title: 'Software Engineering - Sprint Planning Slides', 
    lastSync: '5d ago', 
    date: 'Apr 10, 2026',
    students: '112',
    growth: 'v1',
    status: 'Published',
    image: 'https://picsum.photos/seed/ethics/100/100'
  },
  { 
    id: 'CoSc1205', 
    title: 'Programming Fundamentals - Intro Handout', 
    lastSync: '2w ago', 
    date: 'Mar 28, 2026',
    students: '136',
    growth: 'v1',
    status: 'Archived',
    image: 'https://picsum.photos/seed/legacy/100/100'
  },
];

const modules = [
  { id: 1, title: 'Foundations of Backpropagation', meta: '3 Lessons · Quiz Included', active: true },
  { id: 2, title: 'Convolutional Neural Layers', meta: '5 Lessons · Project', active: false },
  { id: 3, title: 'Recurrent Networks & LSTMs', meta: '4 Lessons · Lab', active: false },
  { id: 4, title: 'Transformer Architecture Foundations', meta: 'Locked · Level 4 Access', active: false, locked: true },
];

export const CourseManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Resource Management</h1>
          <p className="text-outline max-w-xl mt-2">Maintain high-quality learning materials for your courses and keep the latest version available to students.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-sm active:scale-95 transition-all shadow-lg shadow-primary/10"
          onClick={() => navigate('/instructor/content')}
        >
          <Plus size={20} />
          <span>Upload Resource</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'Managed Courses', value: '03', color: 'border-primary' },
          { label: 'Total Resources', value: '24', color: 'border-secondary' },
          { label: 'Pending Updates', value: '08', color: 'border-outline' },
          { label: 'Recent Uploads', value: '06', color: 'border-primary' },
        ].map((stat, i) => (
          <div key={i} className={cn("bg-surface-low p-5 rounded-lg border-l-2", stat.color)}>
            <p className="text-xs font-mono text-outline uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-headline font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-surface-low p-4 rounded-lg flex flex-wrap items-center gap-4 shadow-sm border border-outline-variant/5">
        <div className="flex-1 min-w-70 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input 
            type="text" 
            placeholder="Filter by resource title, course code, or file type..."
            className="w-full bg-surface-high border-none text-sm pl-10 pr-4 py-2.5 rounded-sm focus:ring-1 focus:ring-primary outline-none text-on-surface placeholder:text-outline"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-surface-high border-none text-sm px-4 py-2.5 rounded-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer text-on-surface">
            <option>Course: All</option>
            <option>CoSc4411</option>
            <option>CoSc3312</option>
            <option>CoSc2221</option>
          </select>
          <select className="bg-surface-high border-none text-sm px-4 py-2.5 rounded-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer text-on-surface">
            <option>Status: All</option>
            <option>Draft</option>
            <option>Published</option>
            <option>Archived</option>
          </select>
        </div>
        <button className="p-2.5 text-outline hover:bg-surface-high rounded-sm transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Table */}
        <div className="flex-1 w-full bg-surface-low rounded-lg overflow-hidden border border-outline-variant/10 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant/10 bg-surface-high/30">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-outline">Resource Inventory</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-outline">4 Items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <colgroup>
                <col className="w-[44%]" />
                <col className="w-[20%]" />
                <col className="w-[16%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead>
                <tr className="bg-surface-high/70 text-outline text-[10px] font-mono uppercase tracking-[0.18em] border-b border-outline-variant/10">
                  <th className="px-6 py-4 font-medium">Resource</th>
                  <th className="px-6 py-4 font-medium">Uploaded</th>
                  <th className="px-6 py-4 font-medium">Latest Version</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {courses.map((course) => (
                  <tr key={course.id} className={cn(
                    "group transition-all duration-200",
                    course.id === 'CoSc4411' ? "bg-primary/5" : "hover:bg-surface-high/55"
                  )}>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-surface-highest overflow-hidden shrink-0 border border-outline-variant/10">
                          <img src={course.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold leading-tight mb-1 group-hover:text-primary transition-colors truncate">{course.title}</div>
                          <div className="text-[10px] font-mono text-outline uppercase tracking-wider">Course: {course.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <div className="text-sm font-medium">{course.date}</div>
                      <div className="text-[11px] text-outline">Last sync: {course.lastSync}</div>
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-1 rounded-sm border border-secondary/20 bg-secondary/10 text-secondary uppercase">{course.growth}</span>
                        <span className="text-xs text-outline">{course.students} learners</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 align-middle">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase rounded-sm border",
                        course.status === 'Published' ? "bg-secondary/10 text-secondary border-secondary/20" :
                        course.status === 'Draft' ? "bg-primary/10 text-primary border-primary/20" :
                        "bg-surface-highest text-outline border-outline/20"
                      )}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right align-middle">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 rounded-sm text-outline hover:text-primary hover:bg-primary/10 transition-colors"
                          title="View Resource"
                          onClick={() => navigate('/instructor/content')}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          className="p-2 rounded-sm text-outline hover:text-secondary hover:bg-secondary/10 transition-colors"
                          title="Replace File"
                          onClick={() => navigate('/instructor/content')}
                        >
                          <BarChart2 size={18} />
                        </button>
                        <button
                          className="p-2 rounded-sm text-outline hover:text-error hover:bg-error/10 transition-colors"
                          title="Delete Resource"
                          onClick={() => navigate('/instructor/content')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-outline-variant/10 bg-surface-high/20 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-outline">Showing 4 Resources</span>
            <button className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary hover:underline" onClick={() => navigate('/instructor/content')}>
              View Full Library
            </button>
          </div>
        </div>

        {/* Sidebar Panel */}
        <aside className="w-full xl:w-96 glass-panel rounded-lg p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline font-bold text-lg text-primary">Selected Course Resources</h2>
            <X size={20} className="text-outline cursor-pointer hover:text-on-surface transition-colors" />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-sm bg-surface-high overflow-hidden">
                <img src="https://picsum.photos/seed/curriculum/100/100" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Artificial Intelligence (CoSc4411)</h3>
                <p className="text-[10px] font-mono text-secondary mt-1 uppercase">RESOURCES: 8 | LATEST: V3</p>
              </div>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-surface-high"></div>
              {modules.map((mod) => (
                <div key={mod.id} className={cn("relative pl-8", mod.locked && "opacity-40")}>
                  <div className={cn(
                    "absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center border-4 border-background",
                    mod.active ? "bg-primary" : "bg-surface-high"
                  )}>
                    <span className={cn("text-[8px] font-bold", mod.active ? "text-on-primary" : "text-outline")}>{mod.id}</span>
                  </div>
                  <h4 className="text-xs font-bold">{mod.title}</h4>
                  <p className="text-[10px] text-outline mt-0.5">{mod.meta}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-outline-variant/10 space-y-2">
              <button
                className="w-full py-2.5 bg-surface-high hover:bg-surface-highest text-sm font-medium rounded-sm transition-colors flex items-center justify-center gap-2"
                onClick={() => navigate('/instructor/content')}
              >
                <Edit size={16} />
                Update Resource Details
              </button>
              <button
                className="w-full py-2.5 border border-primary/20 text-primary text-sm font-medium rounded-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                onClick={() => navigate('/dashboard/courses')}
              >
                <ExternalLink size={16} />
                View Resource As Student
              </button>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
