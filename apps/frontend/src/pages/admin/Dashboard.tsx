import React, { useEffect, useState } from 'react';
import { Download, Plus, Users, Layers, Database, Activity, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardAPI, type AdminStats } from '@/api/dashboard';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalResources: 0,
    totalQuizAttempts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    DashboardAPI.getAdminStats()
      .then((data) => {
        if (active) {
          setStats(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load admin dashboard stats:", err);
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleExportReport = () => {
    const blob = new Blob([
      `section,value\nTotal Users,${stats.totalUsers}\nTotal Courses,${stats.totalCourses}\nTotal Resources,${stats.totalResources}\nDaily Quiz Attempts,${stats.totalQuizAttempts}\n`
    ], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-on-surface">Admin Dashboard</h1>
          <p className="text-on-surface-variant text-sm">Monitor platform operations and maintain quality standards from one centralized view.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-surface-low px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-high transition-colors flex items-center gap-2 border border-border shadow-sm"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button
            className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-primary/20"
            onClick={() => navigate('/admin/users')}
          >
            <Plus className="w-4 h-4" /> Manage Users
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-4 gap-6">
          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Users</span>
              <Users className="text-primary w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">{isLoading ? "..." : stats.totalUsers.toLocaleString()}</span>
              <span className="text-secondary text-xs font-bold mt-1">+24 in the last 7 days</span>
            </div>
          </div>

          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Courses</span>
              <Layers className="text-primary w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">{isLoading ? "..." : stats.totalCourses.toLocaleString()}</span>
              <span className="text-secondary text-xs font-bold mt-1">+3 this semester</span>
            </div>
          </div>

          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Resources</span>
              <Database className="text-primary w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">{isLoading ? "..." : stats.totalResources.toLocaleString()}</span>
              <span className="text-on-surface-variant text-xs font-medium mt-1">Files across all managed courses</span>
            </div>
          </div>

          <div className="col-span-2 bg-surface-low p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Daily Quiz Attempts</span>
              <Activity className="text-secondary w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-on-surface">{isLoading ? "..." : stats.totalQuizAttempts.toLocaleString()}</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Updated in real time</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-low p-8 rounded-2xl relative overflow-hidden border border-border shadow-sm">
          <h3 className="text-xs font-bold text-on-surface-variant mb-6 flex items-center gap-2 uppercase tracking-widest">
            <TrendingUp className="text-primary w-4 h-4" /> Platform Activity
          </h3>
          <div className="h-48 w-full flex items-end gap-1.5">
            {[30, 45, 35, 60, 55, 80, 95].map((h, i) => (
              <div 
                key={i} 
                className={`w-full transition-all cursor-help rounded-t-lg ${i === 6 ? 'bg-primary' : 'bg-surface hover:bg-primary/30'}`} 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-surface-low rounded-2xl overflow-hidden border border-border shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Recent Course Additions</h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Catalog</span>
          </div>
          <div className="divide-y divide-border">
            {stats.recentCourses && stats.recentCourses.length > 0 ? (
              stats.recentCourses.map((course, i) => (
                <div key={course.id || i} className="p-5 flex items-center gap-4 hover:bg-primary/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-primary text-xs uppercase font-mono">
                    {course.code?.slice(0, 4) || 'COSC'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">{course.name}</p>
                    <p className="text-xs text-on-surface-variant">Course Code: {course.code}</p>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    {new Date(course.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-6 text-sm text-on-surface-variant text-center">No recent courses found.</p>
            )}
          </div>
          <button
            className="w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-colors border-t border-border"
            onClick={() => navigate('/admin/courses')}
          >
            Manage Courses
          </button>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-surface-low rounded-2xl overflow-hidden border border-border shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Recent Resource Activity</h3>
            <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Materials</span>
          </div>
          <div className="divide-y divide-border">
            {stats.recentResources && stats.recentResources.length > 0 ? (
              stats.recentResources.map((res, i) => (
                <div key={res.id || i} className="p-5 flex items-center gap-4 hover:bg-primary/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center">
                    <Database className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{res.title}</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-mono">{res.type}</p>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    {new Date(res.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-6 text-sm text-on-surface-variant text-center">No recent resources found.</p>
            )}
          </div>
          <button
            className="w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary hover:bg-secondary/10 transition-colors border-t border-border"
            onClick={() => navigate('/admin/analytics')}
          >
            View Resource Analytics
          </button>
        </div>

        <div className="col-span-12 h-64 rounded-2xl relative overflow-hidden glass-card">
          <img 
            src="https://picsum.photos/seed/network/1200/400" 
            alt="Global Data Network" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h2 className="text-2xl font-bold text-primary mb-2 uppercase tracking-tight">Platform Operations Snapshot</h2>
            <p className="text-on-surface-variant max-w-md text-sm font-medium">Track growth, activity, and governance with centralized visibility. Current operational latency remains within expected limits ( <span className="text-secondary font-bold">14ms</span> ).</p>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-8">
            <div className="text-right">
              <p className="text-[10px] font-mono text-on-surface-variant uppercase mb-1">Pending Reviews</p>

            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-on-surface-variant uppercase mb-1">Resolved Today</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
