import { Search, Bell, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/stores/authStore";
import { asBackendRole, roleLabelForBackendRole } from "@/utils/auth";

interface TopBarProps {
    title: string;
    hideTitle?: boolean;
}

function initialsFromName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function settingsPathFromPathname(pathname: string): string {
    if (pathname.startsWith("/admin")) return "/admin/settings";
    if (pathname.startsWith("/instructor")) return "/instructor/settings";
    return "/dashboard/settings";
}

export default function TopBar({ title, hideTitle }: TopBarProps) {
    const { pathname } = useLocation();
    const user = useAuthStore((s) => s.user);
    const settingsPath = settingsPathFromPathname(pathname);

    const displayName = user?.name?.trim() || "User";
    const roleLabel = roleLabelForBackendRole(asBackendRole(user?.role));

    return (
        <div className="flex items-center justify-between flex-1">
            <div className="flex items-center gap-8 flex-1">
                {!hideTitle && title ? (
                    <h2 className="font-headline font-bold text-sm text-white uppercase tracking-widest">{title}</h2>
                ) : null}

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
                <div className="flex items-center gap-3">
                    <button className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
                    </button>
                    <ThemeToggle />
                    <button className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>

                <Link
                    to={settingsPath}
                    className="flex items-center gap-3 pl-6 border-l border-outline-variant/10 hover:opacity-90 transition-opacity"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-[12px] font-bold text-white leading-none">{displayName}</p>
                        <p className="text-[10px] text-on-surface-variant font-mono uppercase mt-1">{roleLabel}</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-outline-variant/30 bg-primary/15 text-xs font-bold text-primary">
                        {initialsFromName(displayName)}
                    </div>
                </Link>
            </div>
        </div>
    );
}
