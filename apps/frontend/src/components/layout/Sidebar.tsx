import { motion } from 'motion/react';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  BarChart3,
  Bot,
  Settings,
  Plus,
  HelpCircle,
  UserCircle,
  Layers,
  Library,
  ShieldCheck,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SidebarVariant = 'dashboard' | 'instructor' | 'admin';

function getSidebarVariant(pathname: string): SidebarVariant | null {
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return 'dashboard';
  }

  if (pathname === '/instructor' || pathname.startsWith('/instructor/')) {
    return 'instructor';
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'admin';
  }

  return null;
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const variant = getSidebarVariant(pathname);

  if (!variant) {
    return null;
  }

  const isDashboard = variant === 'dashboard';
  const isAdmin = variant === 'admin';

  const dashboardItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/dashboard/courses' },
    { id: 'learning', label: 'Learning', icon: BookOpen, path: '/dashboard/learning' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { id: 'ai-tools', label: 'AI Tools', icon: Bot, path: '/dashboard/ai-tools' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const instructorItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/instructor/dashboard' },
    { id: 'courses', label: 'Course Management', icon: Layers, path: '/instructor/courses' },
    { id: 'content', label: 'Content Library', icon: Library, path: '/instructor/content' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/instructor/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/instructor/settings' },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: ShieldCheck, path: '/admin/users' },
    { id: 'courses', label: 'Course Management', icon: Layers, path: '/admin/courses' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const menuItems = isDashboard ? dashboardItems : isAdmin ? adminItems : instructorItems;

  const activeTab = (() => {
    if (isDashboard) {
      if (pathname === '/dashboard') return 'dashboard';
      if (pathname.startsWith('/dashboard/courses')) return 'courses';
      if (pathname.startsWith('/dashboard/learning')) return 'learning';
      if (pathname.startsWith('/dashboard/analytics')) return 'analytics';
      if (pathname.startsWith('/dashboard/ai-tools')) return 'ai-tools';
      if (pathname.startsWith('/dashboard/settings')) return 'settings';
      return 'dashboard';
    }

    if (pathname === '/instructor/dashboard') return 'dashboard';
    if (pathname.startsWith('/instructor/courses')) return 'courses';
    if (pathname.startsWith('/instructor/content')) return 'content';
    if (pathname.startsWith('/instructor/analytics')) return 'analytics';
    if (pathname.startsWith('/instructor/settings')) return 'settings';
    if (pathname.startsWith('/admin/dashboard')) return 'dashboard';
    if (pathname.startsWith('/admin/users')) return 'users';
    if (pathname.startsWith('/admin/courses')) return 'courses';
    if (pathname.startsWith('/admin/analytics')) return 'analytics';
    if (pathname.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
  })();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 hidden w-64 flex-col overflow-hidden border-r border-outline-variant/10 bg-surface-low py-6 lg:flex">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded',
            isDashboard ? 'bg-primary' : 'bg-primary/20 text-primary'
          )}
        >
          {isDashboard ? (
            <GraduationCap className="h-6 w-6 text-on-primary" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
        </div>
        <div>
          <h1 className="font-headline text-xl font-bold tracking-tight text-white">
            {isDashboard ? 'UniLearn' : isAdmin ? 'Admin Hub' : 'Instructor Hub'}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
            {isDashboard ? 'Enterprise AI' : isAdmin ? 'Ops Console' : 'Teaching Console'}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.path)}
            className={cn(
              'group relative flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left transition-all duration-200',
              activeTab === item.id
                ? 'border-l-2 border-primary bg-surface-high text-primary'
                : 'text-on-surface-variant hover:bg-surface-high/50 hover:text-white'
            )}
          >
            <item.icon
              className={cn(
                'h-5 w-5 transition-colors',
                activeTab === item.id ? 'text-primary' : 'text-on-surface-variant group-hover:text-white'
              )}
            />
            <span className="font-medium text-[13px]">{item.label}</span>
            {activeTab === item.id && (
              <motion.div
                layoutId={`active-pill-${variant}`}
                className="absolute inset-0 -z-10 bg-primary/5"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4">
        {isDashboard ? (
          <button
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-2.5 font-headline text-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
            onClick={() => handleNavigate('/dashboard/learning')}
          >
            <Plus className="h-4 w-4" />
            <span>New Inquiry</span>
          </button>
        ) : isAdmin ? (
          <button
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-2.5 font-headline text-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
            onClick={() => handleNavigate('/admin/users')}
          >
            <Plus className="h-4 w-4" />
            <span>New User</span>
          </button>
        ) : (
          <button
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-2.5 font-headline text-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
            onClick={() => handleNavigate('/instructor/courses')}
          >
            <Plus className="h-4 w-4" />
            <span>New Course</span>
          </button>
        )}

        <div className="space-y-1 border-t border-outline-variant/10 pt-4">
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-on-surface-variant transition-all hover:text-white">
            <HelpCircle className="h-4 w-4" />
            <span>Support</span>
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-on-surface-variant transition-all hover:text-white">
            <UserCircle className="h-4 w-4" />
            <span>Account</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
