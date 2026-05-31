import React, { useEffect, useMemo } from 'react';
import { Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/features/admin/StatCard';
import { DataTable } from '@/components/features/admin/DataTable';
import type { Course } from '@/types/admin';
import { useCourseStore } from '@/stores/courseStrore';
import { courseThumbUrl } from '@/lib/coursePlaceholders';
import type { CourseCatalogRow } from '@/api/course';

function toAdminTableCourse(c: CourseCatalogRow): Course {
  const owner = c.instructorName || `${c.instructorId.slice(0, 8)}…`;
  const parts = owner.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase()
      : (owner.slice(0, 2).toUpperCase() || '??');
  return {
    id: c.id,
    title: `${c.code} — ${c.name}`,
    category: `Year ${c.acadamicYear} • Computer Science`,
    owner,
    ownerInitials: initials,
    enrolled: 0,
    status: 'Published',
    lastSync: new Date().toISOString().slice(0, 10),
    image: courseThumbUrl(c.id),
  };
}

export const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  const tableCourses = useMemo(() => courses.map(toAdminTableCourse), [courses]);

  const handleExportAudit = () => {
    const header = 'course,status,lastSync\n';
    const lines = tableCourses.map((row) => `${row.title.replace(/,/g, ';')},${row.status},${row.lastSync}\n`).join('');
    const blob = new Blob([header + lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'course-audit.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight uppercase">Course Management</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">Manage Computer Science course records and instructor assignments (MVP: single department).</p>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-surface-low text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-border shadow-sm hover:bg-primary/10 transition-colors"
            onClick={() => navigate('/admin/courses')}
          >
            <Filter className="w-4 h-4" />
            Filter Courses
          </button>
          <button
            className="bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
            onClick={() => navigate('/admin/courses')}
          >
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Courses" value={String(tableCourses.length)} color="neutral" />
        <StatCard label="Catalog (live)" value={String(tableCourses.length)} color="secondary" />
        <StatCard label="Draft (n/a)" value="0" color="primary" />
        <StatCard label="Archived (n/a)" value="0" color="destructive" />
      </div>

      <DataTable type="courses" data={tableCourses} />

      <div className="mt-10 grid grid-cols-3 gap-8">
        <div className="col-span-2 glass-card p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline font-bold uppercase tracking-tight text-on-surface">Instructor Assignment Queue</h3>
            <span className="text-[10px] font-bold text-secondary px-2.5 py-1 bg-secondary/10 rounded-full uppercase">3 Pending Assignments</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-low/60 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Course: CoSc4411 Artificial Intelligence</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Status: Waiting for instructor assignment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">78%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-low/60 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-secondary rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Course: CoSc2221 Software Engineering</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Status: Instructor assigned successfully</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">100%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-low p-8 rounded-2xl border border-border shadow-sm">
          <h3 className="font-headline font-bold uppercase tracking-tight text-on-surface mb-8">Course Governance Health</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-2">
                <span className="text-on-surface-variant uppercase tracking-wider">Assignment Coverage</span>
                <span className="text-secondary">93%</span>
              </div>
              <div className="h-2 bg-surface w-full rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[93%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-2">
                <span className="text-on-surface-variant uppercase tracking-wider">Courses With Recent Update</span>
                <span className="text-on-surface">68 / 73</span>
              </div>
              <div className="h-2 bg-surface w-full rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[93%] rounded-full"></div>
              </div>
            </div>
            <button
              className="w-full py-4 bg-surface hover:bg-border transition-colors text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface rounded-xl border border-border"
              onClick={handleExportAudit}
            >
              Export Course Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};