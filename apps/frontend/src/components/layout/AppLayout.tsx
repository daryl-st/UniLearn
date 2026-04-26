import React from "react"
import { useLocation } from "react-router-dom"
import { Navbar } from "./NavBar"
import { Footer } from "./Footer"
import Sidebar from "./Sidebar"
import TopBar from "./Topbar"

interface AppLayoutProps {
  children: React.ReactNode
}

function isDashboardShell(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/instructor" ||
    pathname.startsWith("/instructor/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  )
}

function isAuthShell(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/register"
  )
}

function isPublicShell(pathname: string) {
  return !isDashboardShell(pathname) && !isAuthShell(pathname)
}

function getDashboardTitle(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname.startsWith("/dashboard/courses")) return "Courses"
  if (pathname.startsWith("/dashboard/learning")) return "Learning Workspace"
  if (pathname.startsWith("/dashboard/analytics")) return "Analytics"
  if (pathname.startsWith("/dashboard/ai-tools")) return "AI Tools"
  if (pathname.startsWith("/dashboard/settings")) return "Settings"
  if (pathname === "/instructor/dashboard") return "Instructor Dashboard"
  if (pathname.startsWith("/instructor/courses")) return "Course Management"
  if (pathname.startsWith("/instructor/content")) return "Content Library"
  if (pathname.startsWith("/instructor/analytics")) return "Analytics"
  if (pathname.startsWith("/instructor/settings")) return "Settings"
  if (pathname === "/admin/dashboard") return "Admin Dashboard"
  if (pathname.startsWith("/admin/users")) return "User Management"
  if (pathname.startsWith("/admin/courses")) return "Course Management"
  if (pathname.startsWith("/admin/analytics")) return "Analytics"
  if (pathname.startsWith("/admin/settings")) return "Settings"
  return "Dashboard"
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation()

  const showSidebarLayout = isDashboardShell(pathname)
  const showPublicLayout = isPublicShell(pathname)
  const showAuthLayout = isAuthShell(pathname)

  // render navbar and footer only on public pages, hide the shell on auth pages, and show sidebar layout on dashboard pages.
  if (!showSidebarLayout) {
    if (showAuthLayout) {
      return <>{children}</>
    }

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
    <div className="flex min-h-screen flex-col bg-surface text-on-surface font-sans antialiased">
      <div className="flex min-h-screen overflow-hidden">
        <Sidebar />

        {/* renders the top bar and main content area for dashboard pages */}
        <main className="flex min-h-screen flex-1 flex-col overflow-hidden lg:ml-64">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-outline-variant/10 bg-surface px-4 md:px-8">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <h2 className="truncate font-headline text-sm font-bold uppercase tracking-widest text-white">
                {getDashboardTitle(pathname)}
              </h2>
            </div>

            <TopBar title="" hideTitle />
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 md:px-8 md:py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}