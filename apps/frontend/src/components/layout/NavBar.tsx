import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/route-paths";
import {
    asBackendRole,
    dashboardPathForBackendRole,
    settingsPathForBackendRole,
} from "@/utils/auth";
import { cn } from "@/lib/utils";

function initialsFromName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Navbar() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const close = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [menuOpen]);

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
            <div className="flex justify-between items-center h-16 px-8 w-full max-w-7xl mx-auto">
                <div className="flex justify-start gap-7">
                    <Link to="/" className="text-2xl font-bold text-primary tracking-tighter font-headline">
                        UniLearn
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        {["About", "Courses", "Pricing", "Contact"].map((item) => (
                            <a
                                key={item}
                                href={`${item.toLowerCase()}`}
                                className="font-headline font-bold tracking-tight text-on-surface-variant hover:text-white transition-colors text-sm"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((o) => !o)}
                                className={cn(
                                    "flex items-center gap-2 rounded-sm border border-outline-variant/20 px-3 py-2",
                                    "text-sm font-medium text-on-surface hover:bg-surface-high transition-colors",
                                )}
                                aria-expanded={menuOpen}
                                aria-haspopup="true"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/20 text-xs font-bold text-primary">
                                    {initialsFromName(user.name)}
                                </span>
                                <span className="hidden sm:inline max-w-[140px] truncate">{user.name}</span>
                                <ChevronDown className={cn("h-4 w-4 opacity-60 transition-transform", menuOpen && "rotate-180")} />
                            </button>
                            {menuOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 min-w-[200px] rounded-sm border border-outline-variant/20 bg-surface py-1 shadow-lg z-50"
                                    role="menu"
                                >
                                    <Link
                                        to={dashboardPathForBackendRole(asBackendRole(user.role))}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-high"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to={settingsPathForBackendRole(asBackendRole(user.role))}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-high"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-on-surface hover:bg-surface-high"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="px-4 py-2 rounded text-on-surface-variant hover:bg-surface-high transition-all duration-150 text-sm font-medium">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-5 py-2 rounded-sm bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity">
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
