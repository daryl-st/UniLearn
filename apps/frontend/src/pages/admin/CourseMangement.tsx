import React from 'react';
import { Filter, Plus } from 'lucide-react';
import { StatCard } from '@/components/features/admin/StatCard';
import { DataTable } from '@/components/features/admin/DataTable';
import type { Course } from '@/types/admin';

const mockCourses: Course[] = [
  { id: '1', title: 'CoSc2210 - Computer Networks', category: 'Year 3 • Computer Science', owner: 'Helen Kassa', ownerInitials: 'HK', enrolled: 124, status: 'Published', lastSync: '2026.04.15', image: 'https://picsum.photos/seed/neural/100/100' },
  { id: '2', title: 'CoSc4411 - Artificial Intelligence', category: 'Year 4 • Computer Science', owner: 'Elias Thorne', ownerInitials: 'ET', enrolled: 98, status: 'Draft', lastSync: '2026.04.14', image: 'https://picsum.photos/seed/quantum/100/100' },
  { id: '3', title: 'CoSc1205 - Programming Fundamentals', category: 'Year 1 • Computer Science', owner: 'Marcus Kane', ownerInitials: 'MK', enrolled: 136, status: 'Archived', lastSync: '2026.03.28', image: 'https://picsum.photos/seed/legacy/100/100' },
  { id: '4', title: 'CoSc3312 - Database Systems', category: 'Year 3 • Computer Science', owner: 'Sarah Connor', ownerInitials: 'SC', enrolled: 112, status: 'Published', lastSync: '2026.04.10', image: 'https://picsum.photos/seed/ethics/100/100' },
  { id: '5', title: 'CoSc2221 - Software Engineering', category: 'Year 2 • Computer Science', owner: 'Neil Miller', ownerInitials: 'NM', enrolled: 120, status: 'Published', lastSync: '2026.04.08', image: 'https://picsum.photos/seed/spatial/100/100' },
];

export const CourseManagement: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight uppercase">Course Management</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">Manage course records and instructor assignments across the department.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-low text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-border shadow-sm hover:bg-primary/10 transition-colors">
            <Filter className="w-4 h-4" />
            Filter Courses
          </button>
          <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Courses" value="73" color="neutral" />
        <StatCard label="Assigned Instructors" value="68" color="secondary" />
        <StatCard label="Draft Courses" value="7" color="primary" />
        <StatCard label="Archived Courses" value="5" color="destructive" />
      </div>

      <DataTable type="courses" data={mockCourses} />

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
            <button className="w-full py-4 bg-surface hover:bg-border transition-colors text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface rounded-xl border border-border">
              Export Course Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
