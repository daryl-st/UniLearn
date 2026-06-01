import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, UserPlus, Edit2, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/features/admin/StatCard';
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

type EditUserForm = {
  name: string;
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
};

function formatVerified(isVerified?: boolean): string {
  return isVerified ? 'Verified' : 'Unverified';
}

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
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
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<SafeUserRow | null>(null);
  const [editForm, setEditForm] = useState<EditUserForm>({
    name: '',
    email: '',
    role: 'STUDENT',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<SafeUserRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const pendingReview = useMemo(
    () => users.filter((u) => u.mustChangePassword).length,
    [users],
  );

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (!term) return true;
      return (
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.id && u.id.toLowerCase().includes(term))
      );
    });
  }, [users, roleFilter, searchTerm]);

  const openEditDialog = (user: SafeUserRow) => {
    setEditingUser(user);
    setEditError(null);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role as "ADMIN" | "INSTRUCTOR" | "STUDENT",
    });
  };

  const closeEditDialog = () => {
    setEditingUser(null);
    setEditError(null);
  };

  const openDeleteDialog = (user: SafeUserRow) => {
    setDeletingUser(user);
    setDeleteError(null);
  };

  const closeDeleteDialog = () => {
    setDeletingUser(null);
    setDeleteError(null);
  };

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;

    setEditLoading(true);
    setEditError(null);

    try {
      await UsersAPI.update(editingUser.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        role: editForm.role,
      });
      closeEditDialog();
      await loadData();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await UsersAPI.remove(deletingUser.id);
      closeDeleteDialog();
      await loadData();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUserCreated = () => {
    void loadData();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight">User Management</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">
            Control access, update user details, and safely remove instructors without deleting uploaded resources.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-border bg-surface-low px-3 py-2 text-sm text-on-surface"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT')}
              className="rounded-xl border border-border bg-surface-low px-3 py-2 text-sm text-on-surface"
              aria-label="Filter by role"
            >
              <option value="ALL">All roles</option>
              <option value="ADMIN">Admin</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="STUDENT">Student</option>
            </select>
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total users" value={loading ? '…' : String(stats?.totalUsers ?? 0)} color="secondary" />
        <StatCard label="Instructors" value={loading ? '…' : String(stats?.totalInstructors ?? 0)} status="Active accounts" color="primary" />
        <StatCard label="Pending review" value={loading ? '…' : String(pendingReview)} color="destructive" />
        <StatCard
          label="Database resources"
          value={loading ? '…' : String(stats?.totalResources ?? 0)}
          status="Course assets"
          color="secondary"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive font-medium mb-6" role="alert">
          {error}
        </p>
      )}

      {showForm && <CreateUserForm onCreated={handleUserCreated} />}

      <div className="overflow-hidden rounded-3xl border border-border shadow-sm bg-surface-low">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-[11px] font-bold text-on-surface-variant uppercase tracking-wider h-14">
                <th className="px-6 py-4">User</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Verified</th>
                <th className="px-4 py-4">Updated</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-on-surface">{user.name}</span>
                        <span className="text-xs text-on-surface-variant">{user.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant">{formatVerified(user.isVerified)}</td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant">{formatDate(user.updatedAt)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-on-surface-variant hover:bg-primary/10 transition-colors"
                          onClick={() => openEditDialog(user)}
                          aria-label={`Edit ${user.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => openDeleteDialog(user)}
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="max-w-lg w-full rounded-3xl bg-surface p-6 border border-border shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Edit user</h2>
                <p className="text-sm text-on-surface-variant">Update name, email, or role for this account.</p>
              </div>
              <button
                type="button"
                onClick={closeEditDialog}
                className="rounded-full p-2 bg-surface-low border border-border text-on-surface-variant hover:bg-surface transition-colors"
                aria-label="Close edit dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Full name</span>
                  <input
                    value={editForm.name}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-border bg-surface-low px-4 py-3 text-sm text-on-surface"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Email</span>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-border bg-surface-low px-4 py-3 text-sm text-on-surface"
                    required
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Role</span>
                <select
                  value={editForm.role}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, role: event.target.value as EditUserForm['role'] }))}
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-low px-4 py-3 text-sm text-on-surface"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="STUDENT">Student</option>
                </select>
              </label>
              {editError && <p className="text-sm text-destructive">{editError}</p>}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  className="rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:brightness-110 disabled:opacity-50"
                >
                  {editLoading ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="max-w-md w-full rounded-3xl bg-surface p-6 border border-border shadow-xl">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-on-surface">Delete user</h2>
              <p className="text-sm text-on-surface-variant mt-2">
                This will remove the account for <strong>{deletingUser.name}</strong>.
                Uploaded resources will remain available but will no longer be attached to a deleted instructor account.
              </p>
            </div>
            {deleteError && <p className="mb-4 text-sm text-destructive">{deleteError}</p>}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                className="rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-low"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="rounded-2xl bg-destructive px-4 py-3 text-sm font-semibold text-on-primary hover:brightness-110 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting…' : 'Delete user'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
