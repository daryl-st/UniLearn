import React from 'react';
import { Filter, Plus } from 'lucide-react';
import { StatCard } from '@/components/features/admin/StatCard';
import { DataTable } from '@/components/features/admin/DataTable';
import type { Course } from '@/types/admin';

const mockCourses: Course[] = [
  { id: '1', title: 'Neural Network Architectures', category: 'Advanced Machine Learning', owner: 'Dr. Aris Thorne', ownerInitials: 'DA', enrolled: 4291, status: 'Published', lastSync: '2023.10.24', image: 'https://picsum.photos/seed/neural/100/100' },
  { id: '2', title: 'Quantum Interface Design', category: 'Human-Computer Interaction', owner: 'Elena Vance', ownerInitials: 'EL', enrolled: 1052, status: 'Draft', lastSync: '2023.11.02', image: 'https://picsum.photos/seed/quantum/100/100' },
  { id: '3', title: 'Legacy Protocol Analysis', category: 'System Security', owner: 'Marcus Kane', ownerInitials: 'MK', enrolled: 0, status: 'Archived', lastSync: '2022.05.15', image: 'https://picsum.photos/seed/legacy/100/100' },
  { id: '4', title: 'Synthetic Intelligence Ethics', category: 'Sociology & Systems', owner: 'Sarah Connor', ownerInitials: 'SC', enrolled: 8922, status: 'Published', lastSync: '2023.11.10', image: 'https://picsum.photos/seed/ethics/100/100' },
  { id: '5', title: 'Spatial Computing Intro', category: 'Mixed Reality UX', owner: 'Neil Miller', ownerInitials: 'NM', enrolled: 540, status: 'Published', lastSync: '2023.11.08', image: 'https://picsum.photos/seed/spatial/100/100' },
];

export const CourseManagement: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight uppercase">Course Management</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">Registry oversight and deployment protocols for UniLearn active educational units.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-low text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-border shadow-sm hover:bg-primary-surface transition-colors">
            <Filter className="w-4 h-4" />
            Filter Registry
          </button>
          <button className="bg-primary-brand text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary-brand/20">
            <Plus className="w-4 h-4" />
            New Protocol
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Assets" value="1,284" color="neutral" />
        <StatCard label="Active Deployment" value="842" color="secondary" />
        <StatCard label="Staging/Draft" value="312" color="primary" />
        <StatCard label="Archived Units" value="130" color="error" />
      </div>

      <DataTable type="courses" data={mockCourses} />

      <div className="mt-10 grid grid-cols-3 gap-8">
        <div className="col-span-2 glass-effect p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline font-bold uppercase tracking-tight text-on-surface">Deployment Queue</h3>
            <span className="text-[10px] font-bold text-secondary-accent px-2.5 py-1 bg-secondary-accent/10 rounded-full uppercase">3 Pending Syncs</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-low/60 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-primary-brand rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Course: Bio-Synthetic Integration</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Status: Propagating to Edge Servers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">78%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-low/60 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-secondary-accent rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Update: Legacy Database Patch</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Status: Integrity Check Complete</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">100%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-low p-8 rounded-2xl border border-border shadow-sleek">
          <h3 className="font-headline font-bold uppercase tracking-tight text-on-surface mb-8">System Health</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-2">
                <span className="text-on-surface-variant uppercase tracking-wider">Protocol Latency</span>
                <span className="text-secondary-accent">14ms</span>
              </div>
              <div className="h-2 bg-surface w-full rounded-full overflow-hidden">
                <div className="h-full bg-secondary-accent w-[15%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-2">
                <span className="text-on-surface-variant uppercase tracking-wider">Storage Capacity</span>
                <span className="text-on-surface">4.2 PB / 10 PB</span>
              </div>
              <div className="h-2 bg-surface w-full rounded-full overflow-hidden">
                <div className="h-full bg-primary-brand w-[42%] rounded-full"></div>
              </div>
            </div>
            <button className="w-full py-4 bg-surface hover:bg-border transition-colors text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface rounded-xl border border-border">
              Generate Full Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
