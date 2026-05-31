import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/features/admin/StatCard';
import { DataTable } from '@/components/features/admin/DataTable';
import { AIInsightCard } from '@/components/features/admin/AlInsightsCard';
import { CreateUserForm } from '@/components/features/admin/CreateUserForm';
import type { User } from '@/types/admin';
import { UsersAPI, type SafeUserRow } from '@/api/users';
import { DashboardAPI } from '@/api/dashboard';

function formatRole(role: string): User['role'] {
  const r = role.toUpperCase();
  if (r === 'INSTRUCTOR') return 'Instructor';
  if (r === 'ADMIN') return 'Admin';
  return 'Student';
}

function formatLastAccess(updatedAt?: string): string {
  if (!updatedAt) return '—';
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toTableUser(u: SafeUserRow): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: formatRole(u.role),
    status: u.mustChangePassword ? 'Pending password' : 'Synchronized',
    lastAccess: formatLastAccess(u.updatedAt),
  };
}

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<SafeUserRow[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalInstructors: number;
    totalResources: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRows, adminStats] = await Promise.all([
        UsersAPI.list(),
        DashboardAPI.getAdminStats(),
      ]);
      setUsers(userRows);
      setStats({
        totalUsers: adminStats.totalUsers,
        totalInstructors: adminStats.totalInstructors,
        totalResources: adminStats.totalResources,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const tableUsers = useMemo(() => users.map(toTableUser), [users]);
  const pendingReview = useMemo(
    () => users.filter((u) => u.mustChangePassword).length,
    [users],
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight">User Management</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">Control user access and role assignments for students and instructors.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-surface-low text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-border shadow-sm hover:bg-primary/10 transition-colors"
            onClick={() => navigate('/admin/users')}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            className="bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
            onClick={() => setShowForm((v) => !v)}
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Total users" value={loading ? '…' : String(stats?.totalUsers ?? 0)} color="secondary" />
        <StatCard label="Instructors" value={loading ? '…' : String(stats?.totalInstructors ?? 0)} status="Active accounts" color="primary" />
        <StatCard label="Pending review" value={loading ? '…' : String(pendingReview)} color="destructive" />
        <StatCard
          label="Account uptime"
          value={loading ? '…' : String(stats?.totalResources ?? 0)}
          status="Database resources"
          color="secondary"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive font-medium mb-6" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <CreateUserForm
          onCreated={() => {
            void loadData();
          }}
        />
      )}

      {loading ? (
        <p className="text-sm text-on-surface-variant font-medium mb-6">Loading users…</p>
      ) : null}

      <DataTable type="users" data={tableUsers} />
      
      <AIInsightCard />
    </div>
  );
};
