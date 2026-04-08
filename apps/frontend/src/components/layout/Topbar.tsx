import { Search, Bell, HelpCircle } from 'lucide-react';

interface TopBarProps {
  title: string;
  hideTitle?: boolean;
}

export default function TopBar({ title, hideTitle }: TopBarProps) {
  return (
    <div className="flex items-center justify-between flex-1">
      <div className="flex items-center gap-8 flex-1">
        {!hideTitle && <h2 className="font-headline font-bold text-sm text-white uppercase tracking-widest">{title}</h2>}
        
        <div className="max-w-md w-full relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search protocol..." 
            className="w-full bg-surface-low border border-outline-variant/10 rounded-sm py-2 pl-10 pr-4 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/10">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold text-white leading-none">Dawit Spark</p>
            <p className="text-[10px] text-on-surface-variant font-mono uppercase mt-1">Lead Engineer</p>
          </div>
          <div className="w-9 h-9 rounded-sm overflow-hidden border border-outline-variant/30">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsnXf4k3f63rx2GPse2n0r6fz0pJoKdnvkz4q61rlAcIa7ILPPlpe6kvgw81QsLDYMWPyuc4_8F4LYtHMbucWRI733xlpASqqfgeRrjayOSzUTs00wyfvQ3r8AZ9NAJ7psl_EGinOFbAAccXoYP1twj_6uu-OXiwQ2oeFQPnwP859rCIE8_AioWxAp67PJzYoYfs6Yab9yAQQLqt5_aD55Cpjc9sZjD0-D8qcjRYCgKAPDaxeN9Oy6OD5zgcRqBbL-0qWkjPKDshTT" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
