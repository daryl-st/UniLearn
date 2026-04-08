import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { Navbar } from "./NavBar"
import { Footer } from "./Footer"
import Sidebar from "./Sidebar"
import TopBar from "./Topbar"

interface AppLayoutProps {
  children: React.ReactNode
}

function isDashboardShell(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/")
}

function isPublicShell(pathname: string) {
  return !isDashboardShell(pathname)
}

function getActiveTabFromPath(pathname: string) {
  if (pathname === "/dashboard") return "dashboard"
  if (pathname.startsWith("/dashboard/courses")) return "courses"
  if (pathname.startsWith("/dashboard/learning")) return "learning"
  if (pathname.startsWith("/dashboard/analytics")) return "analytics"
  if (pathname.startsWith("/dashboard/ai-tools")) return "ai-tools"
  if (pathname.startsWith("/dashboard/settings")) return "settings"
  return "dashboard"
}

function getDashboardTitle(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname.startsWith("/dashboard/courses")) return "Courses"
  if (pathname.startsWith("/dashboard/learning")) return "Learning Workspace"
  if (pathname.startsWith("/dashboard/analytics")) return "Analytics"
  if (pathname.startsWith("/dashboard/ai-tools")) return "AI Tools"
  if (pathname.startsWith("/dashboard/settings")) return "Settings"
  return "Dashboard"
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeTab = getActiveTabFromPath(pathname)
  const showSidebarLayout = isDashboardShell(pathname)
  const showPublicLayout = isPublicShell(pathname)

  // render navbar and footer only on public pages, and sidebar layout on dashboard pages.
  if (!showSidebarLayout) {
    if (!showPublicLayout) {
      return <>{children}</>
    }

    return (
      <div className="flex min-h-screen flex-col bg-surface text-on-surface font-sans antialiased">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface text-on-surface font-sans antialiased">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-70 w-64 transform transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}
      >
        <Sidebar
          activeTab={activeTab}
          onNavigate={() => setIsMobileMenuOpen(false)}
        />
      </div>
        
      {/* // renders the top bar and main content area for dashboard pages */}
      <main className="flex min-h-screen flex-1 flex-col overflow-hidden md:ml-64">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-outline-variant/10 bg-surface px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-on-surface-variant hover:text-white md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="truncate font-headline text-sm font-bold uppercase tracking-widest text-white">
              {getDashboardTitle(pathname)}
            </h2>
          </div>

          <TopBar title="" hideTitle />
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}