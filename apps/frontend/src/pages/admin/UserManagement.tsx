import React from 'react';
import { Filter, UserPlus } from 'lucide-react';
import { StatCard } from '@/components/features/admin/StatCard';
import { DataTable } from '@/components/features/admin/DataTable';
import { AIInsightCard } from '@/components/features/admin/AlInsightsCard';
import type { User } from '@/types/admin';

const mockUsers: User[] = [
  { id: '1', name: 'Aria Vance', email: 'aria.v@uniproto.io', role: 'Instructor', status: 'Synchronized', lastAccess: '2m ago', avatar: 'https://picsum.photos/seed/aria/100/100' },
  { id: '2', name: 'Elias Thorne', email: 'e.thorne@uniproto.io', role: 'Student', status: 'Synchronized', lastAccess: '14m ago', avatar: 'https://picsum.photos/seed/elias/100/100' },
  { id: '3', name: 'Marcus Kovac', email: 'm.kovac@uniproto.io', role: 'Student', status: 'Suspended', lastAccess: '4d ago' },
  { id: '4', name: 'Sasha Grey', email: 's.grey@uniproto.io', role: 'Student', status: 'Synchronized', lastAccess: '1h ago', avatar: 'https://picsum.photos/seed/sasha/100/100' },
  { id: '5', name: 'Julian Thorne', email: 'j.thorne@uniproto.io', role: 'Instructor', status: 'Synchronized', lastAccess: 'Now', avatar: 'https://picsum.photos/seed/julian/100/100' },
];

export const UserManagement: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight">User Management</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">Global protocol access control and entity validation.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-low text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-border shadow-sm hover:bg-primary/10 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4" />
            Create Protocol
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Active nodes" value="12,402" change="4.2%" trend="up" color="secondary" />
        <StatCard label="Instructors" value="482" status="v1.2 Active" color="primary" />
        <StatCard label="Pending Sync" value="18" color="destructive" />
        <StatCard label="Data Uptime" value="99.9%" color="secondary" />
      </div>

      <DataTable type="users" data={mockUsers} />
      
      <AIInsightCard />
    </div>
  );
};
