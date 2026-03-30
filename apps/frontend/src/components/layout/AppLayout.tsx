import React from "react"
import { Navbar } from "./NavBar"
import { Footer } from "./Footer"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface-variant font-sans antialiased">
        {/* Needs conditional rendering on some screens */}
        <Navbar />
        {/* The 'main' tag ensures semantic HTML and pushes the footer down */}
        <main className="flex-1">
            {children}
        </main>
        <Footer />
    </div>
  )
}