import React from 'react';
import { motion } from 'motion/react';
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
    id: 'UNLN-90231', 
    title: 'Neural Network Architectures v4', 
    lastSync: '2h ago', 
    date: 'Oct 14, 2023',
    students: '1,248',
    growth: '+12%',
    status: 'Published',
    image: 'https://picsum.photos/seed/nn/100/100'
  },
  { 
    id: 'UNLN-88122', 
    title: 'Advanced Quantum Cryptography', 
    lastSync: '1d ago', 
    date: 'Oct 10, 2023',
    students: '842',
    growth: '-3%',
    status: 'Draft',
    image: 'https://picsum.photos/seed/quantum/100/100'
  },
  { 
    id: 'UNLN-44501', 
    title: 'Ethical Frameworks in AI', 
    lastSync: '5d ago', 
    date: 'Sep 28, 2023',
    students: '4,302',
    growth: '+1.5%',
    status: 'Published',
    image: 'https://picsum.photos/seed/ethics/100/100'
  },
  { 
    id: 'UNLN-10129', 
    title: 'Legacy System Migration', 
    lastSync: '2w ago', 
    date: 'Aug 15, 2023',
    students: '124',
    growth: '0%',
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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-outline max-w-xl mt-2">Orchestrate your educational modules. Monitor deployment status and student engagement protocols across the infrastructure.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-sm active:scale-95 transition-all shadow-lg shadow-primary/10">
          <Plus size={20} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Active', value: '42', color: 'border-primary' },
          { label: 'Total Students', value: '12.4k', color: 'border-secondary' },
          { label: 'Pending Review', value: '08', color: 'border-outline' },
          { label: 'Completion Rate', value: '88.4%', color: 'border-primary' },
        ].map((stat, i) => (
          <div key={i} className={cn("bg-surface-low p-5 rounded-lg border-l-2", stat.color)}>
            <p className="text-xs font-mono text-outline uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-headline font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-surface-low p-4 rounded-lg flex flex-wrap items-center gap-4 shadow-sm border border-outline-variant/5">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input 
            type="text" 
            placeholder="Filter by course title, ID or instructor..."
            className="w-full bg-surface-high border-none text-sm pl-10 pr-4 py-2.5 rounded-sm focus:ring-1 focus:ring-primary outline-none text-on-surface placeholder:text-outline"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-surface-high border-none text-sm px-4 py-2.5 rounded-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer text-on-surface">
            <option>Status: All</option>
            <option>Draft</option>
            <option>Published</option>
            <option>Archived</option>
          </select>
          <select className="bg-surface-high border-none text-sm px-4 py-2.5 rounded-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer text-on-surface">
            <option>Category: All</option>
            <option>Neural Networks</option>
            <option>Quantum Computing</option>
          </select>
        </div>
        <button className="p-2.5 text-outline hover:bg-surface-high rounded-sm transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Table */}
        <div className="flex-1 w-full bg-surface-low rounded-lg overflow-hidden border border-outline-variant/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-high/50 text-outline text-[10px] font-mono uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Course Identity</th>
                  <th className="px-6 py-4">Metadata</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {courses.map((course) => (
                  <tr key={course.id} className={cn(
                    "group transition-colors",
                    course.id === 'UNLN-90231' ? "bg-surface-high" : "hover:bg-surface-high/40"
                  )}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-sm bg-surface-highest overflow-hidden shrink-0">
                          <img src={course.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="font-semibold leading-tight mb-1">{course.title}</div>
                          <div className="text-[10px] font-mono text-outline">ID: {course.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm">{course.date}</div>
                      <div className="text-xs text-outline">Last sync: {course.lastSync}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{course.students}</span>
                        <span className={cn(
                          "text-[10px] font-mono",
                          course.growth.startsWith('+') ? "text-secondary" : course.growth === '0%' ? "text-outline" : "text-error"
                        )}>{course.growth}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-mono uppercase rounded-sm border",
                        course.status === 'Published' ? "bg-secondary/10 text-secondary border-secondary/20" :
                        course.status === 'Draft' ? "bg-primary/10 text-primary border-primary/20" :
                        "bg-surface-highest text-outline border-outline/20"
                      )}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-outline hover:text-primary transition-colors"><Edit3 size={18} /></button>
                        <button className="p-2 text-outline hover:text-secondary transition-colors"><BarChart2 size={18} /></button>
                        <button className="p-2 text-outline hover:text-error transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Panel */}
        <aside className="w-full xl:w-96 glass-panel rounded-lg p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline font-bold text-lg text-primary">Curriculum Quick View</h2>
            <X size={20} className="text-outline cursor-pointer hover:text-on-surface transition-colors" />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-sm bg-surface-high overflow-hidden">
                <img src="https://picsum.photos/seed/curriculum/100/100" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Neural Network Architectures v4</h3>
                <p className="text-[10px] font-mono text-secondary mt-1 uppercase">MODULES: 12 | HOURS: 24.5</p>
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
              <button className="w-full py-2.5 bg-surface-high hover:bg-surface-highest text-sm font-medium rounded-sm transition-colors flex items-center justify-center gap-2">
                <Edit size={16} />
                Edit Full Curriculum
              </button>
              <button className="w-full py-2.5 border border-primary/20 text-primary text-sm font-medium rounded-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                <ExternalLink size={16} />
                Preview Student Experience
              </button>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
