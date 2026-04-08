import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Bot, 
  Settings, 
  Plus, 
  HelpCircle, 
  UserCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-tools', label: 'AI Tools', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-outline-variant/10 bg-surface-low py-6">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
          <GraduationCap className="text-on-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="font-headline text-xl font-bold text-white tracking-tight">UniLearn</h1>
          <p className="text-[10px] text-on-surface-variant tracking-[0.2em] uppercase font-mono opacity-60">Enterprise AI</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group relative ${
              activeTab === item.id 
                ? 'text-primary bg-surface-high border-l-2 border-primary' 
                : 'text-on-surface-variant hover:text-white hover:bg-surface-high/50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary' : 'text-on-surface-variant group-hover:text-white'}`} />
            <span className="font-medium text-[13px]">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute inset-0 bg-primary/5 -z-10"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 mb-6 rounded-sm bg-primary text-on-primary font-headline font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10">
          <Plus className="w-4 h-4" />
          <span>New Inquiry</span>
        </button>
        
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-white transition-all text-[13px]">
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-white transition-all text-[13px]">
            <UserCircle className="w-4 h-4" />
            <span>Account</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
