import React, { useEffect, useMemo, useState } from 'react';
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
import { useCourseStore } from '@/stores/courseStrore';
import { CourseAPI } from '@/api/course';
import { courseThumbUrl } from '@/lib/coursePlaceholders';
import type { Resource } from '@unilearn/shared-types';

export const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = useCourseStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarResources, setSidebarResources] = useState<Resource[]>([]);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const activeCourseId = selectedId ?? courses[0]?.id ?? null;

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (!activeCourseId) return;
    let cancelled = false;
    void (async () => {
      const r = await CourseAPI.getResourcesByCourseId(activeCourseId);
      if (!cancelled) setSidebarResources(Array.isArray(r) ? r : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeCourseId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (courses.length === 0) {
        setTotalMaterials(0);
        return;
      }
      try {
        const counts = await Promise.all(
          courses.map((c) =>
            CourseAPI.getResourcesByCourseId(c.id).then((r) => (Array.isArray(r) ? r.length : 0)),
          ),
        );
        if (!cancelled) setTotalMaterials(counts.reduce((a, b) => a + b, 0));
      } catch {
        if (!cancelled) setTotalMaterials(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courses]);

  const rows = useMemo(
    () =>
      courses.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.name,
        lastSync: 'Live API',
        date: 'Catalog',
        students: '—',
        growth: `Y${c.acadamicYear}`,
        status: 'Published' as const,
        image: courseThumbUrl({ code: c.code, name: c.name }),
      })),
    [courses],
  );

  const selected = courses.find((c) => c.id === activeCourseId);

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
          { label: 'Managed Courses', value: String(courses.length).padStart(2, '0'), color: 'border-primary' },
          { label: 'Total Resources', value: String(totalMaterials).padStart(2, '0'), color: 'border-secondary' },
          { label: 'Catalog source', value: 'API', color: 'border-outline' },
          { label: 'Courses listed', value: String(rows.length).padStart(2, '0'), color: 'border-primary' },
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
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-outline">{rows.length} Items</p>
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
                {rows.map((course) => (
                  <tr
                    key={course.id}
                    onClick={() => setSelectedId(course.id)}
                    className={cn(
                      "group transition-all duration-200 cursor-pointer",
                      course.id === activeCourseId ? "bg-primary/5" : "hover:bg-surface-high/55",
                    )}
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-surface-highest overflow-hidden shrink-0 border border-outline-variant/10">
                          <img src={course.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold leading-tight mb-1 group-hover:text-primary transition-colors truncate">{course.title}</div>
                          <div className="text-[10px] font-mono text-outline uppercase tracking-wider">Course: {course.code}</div>
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
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-outline">Showing {rows.length} courses</span>
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
                {selected ? (
                  <img
                    src={courseThumbUrl({ code: selected.code, name: selected.name })}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{selected ? `${selected.name} (${selected.code})` : 'Select a course'}</h3>
                <p className="text-[10px] font-mono text-secondary mt-1 uppercase">
                  RESOURCES: {sidebarResources.length}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative max-h-64 overflow-y-auto subtle-scrollbar">
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-surface-high" />
              {sidebarResources.length === 0 ? (
                <p className="text-[11px] text-outline pl-8">No resources for this course.</p>
              ) : (
                sidebarResources.map((res, i) => (
                  <div key={res.id} className="relative pl-8">
                    <div
                      className={cn(
                        'absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center border-4 border-background',
                        i === 0 ? 'bg-primary' : 'bg-surface-high',
                      )}
                    >
                      <span className={cn('text-[8px] font-bold', i === 0 ? 'text-on-primary' : 'text-outline')}>
                        {i + 1}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold truncate">{res.title}</h4>
                    <p className="text-[10px] text-outline mt-0.5 font-mono">
                      {res.type} ·{' '}
                      <a className="text-primary underline" href={String(res.fileUrl)} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    </p>
                  </div>
                ))
              )}
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
