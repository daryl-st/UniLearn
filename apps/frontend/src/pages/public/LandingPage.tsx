import { motion } from "motion/react"
import { HeroSection, ActiveRegistries } from "@/components/features/landing/HeroSection"
import { BentoGrid } from "@/components/features/landing/BentoGrid"
import { Link } from "react-router-dom"

// Needs refactoring
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface-variant font-sans antialiased selection:bg-brand/30 selection:text-on-surface">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Bento Grid Features */}
        <BentoGrid />
      
        {/* Active Registries */}
        < ActiveRegistries />

        {/* Glassmorphic CTA */}
        <section className="relative py-32 px-8 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto text-center glass-card p-16 rounded-xl"
          >
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-8 tracking-tighter">Ready to start learning?</h2>
            <p className="text-lg text-on-surface-variant mb-12 max-w-xl mx-auto">Join a centralized academic workspace for trusted resources, AI summaries, quizzes, and role-based access across the department.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register">
                <button className="px-10 py-4 bg-primary text-on-primary font-bold rounded-sm hover:opacity-90 transition-opacity">Create Account</button>
              </Link>
              <Link to="/login">
                <button className="px-10 py-4 border border-outline-variant text-on-surface font-bold rounded-sm hover:bg-surface-high transition-all">Sign In</button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}