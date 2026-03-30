import React from "react"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Surface } from "../components/ui/Surface"
import { Globe, Cpu, Navigation, Box, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface-variant font-sans antialiased selection:bg-brand/30 selection:text-on-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#49454f]/15 bg-surface/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl font-bold text-on-surface">UniLearn</span>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#" className="text-on-surface transition-colors">About</a>
              <a href="#" className="hover:text-on-surface transition-colors">Courses</a>
              <a href="#" className="hover:text-on-surface transition-colors">Pricing</a>
              <a href="#" className="hover:text-on-surface transition-colors">Contact</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="tertiary">Login</Button>
            <Button variant="primary">Sign Up</Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          {/* Subtle background glow mimicking the monolithic/ethereal vibe */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
            <Badge variant="status" className="mb-8">System Status: Operational</Badge>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-on-surface tracking-tight max-w-4xl mb-6">
              Protocol for <span className="text-brand">Enterprise Intelligence</span>
            </h1>
            <p className="text-lg max-w-2xl mb-10">
              Deploying specialized knowledge frameworks through neural vectors. Scale your workforce intelligence with the next generation of predictive curriculum.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="primary" className="h-12 px-8 text-base">Start Learning</Button>
              <Button variant="secondary" className="h-12 px-8 text-base">Explore Courses</Button>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Neural Processing - Col 8 */}
            <Surface level={1} className="md:col-span-8 p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <Globe className="w-6 h-6 text-brand mb-6" />
                <h3 className="font-display text-2xl font-bold text-on-surface mb-3">Neural Processing</h3>
                <p className="max-w-md">Synthesize knowledge acquisition utilizing high-density data mapping and cognitive feedback loops for enterprise-grade proficiency.</p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-1 bg-surface-high rounded-full overflow-hidden">
                  <div className="h-full bg-brand w-[65%]" />
                </div>
                <span className="font-mono text-xs">65% ACTIVE</span>
              </div>
            </Surface>

            {/* Cognitive Vectors - Col 4 */}
            <Surface level={1} className="md:col-span-4 p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <Cpu className="w-6 h-6 text-accent mb-6" />
                <h3 className="font-display text-xl font-bold text-on-surface mb-3">Cognitive Vectors</h3>
                <p className="text-sm">Adaptability patterns mapped in real-time based on individual neural performance metrics.</p>
              </div>
              <div className="mt-6 h-24 bg-surface-high rounded-md flex items-center justify-center border border-[#49454f]/15">
                 {/* Abstract representation placeholder */}
                 <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent opacity-50" />
              </div>
            </Surface>

            {/* Predictive Curriculum - Col 3 */}
            <Surface level={1} className="md:col-span-3 p-8">
              <Navigation className="w-6 h-6 text-on-surface mb-6" />
              <h3 className="font-display text-lg font-bold text-on-surface mb-3">Predictive Curriculum</h3>
              <p className="text-sm">Outpace the curve. Define the market shifts. Stay ahead of technical demands through algorithmic foresight.</p>
            </Surface>

            {/* Architecture of Mind - Col 6 */}
            <Surface level={1} className="md:col-span-6 p-8 flex flex-col justify-center">
              <h3 className="font-display text-2xl font-bold text-on-surface mb-4">Architecture of Mind</h3>
              <p className="mb-6 max-w-lg text-sm">Our protocol isn't just content; it's a structural realignment of professional expertise. Designed for high-precision environments.</p>
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" /> 300 TB+ DATA MODELS
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" /> HYPER-DENSE RETENTION
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" /> CONTINUOUS DEPLOYMENT
                </li>
              </ul>
            </Surface>

            {/* Cube Graphic - Col 3 */}
            <Surface level={2} className="md:col-span-3 p-8 flex items-center justify-center">
              <Box className="w-16 h-16 text-brand" strokeWidth={1.5} />
            </Surface>

          </div>
        </section>

        {/* Active Registries */}
        <section className="container mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-on-surface mb-2">Active Registries</h2>
              <p>Select a protocol to begin your integration into the enterprise intelligence network.</p>
            </div>
            <Button variant="tertiary" className="font-mono text-xs uppercase tracking-wider shrink-0">
              View All Protocols
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Algorithmic Governance", desc: "Frameworks for automated decision systems and ethical alignment in autonomous organizations.", meta: "AI PROTOCOL / ENTERPRISE" },
              { title: "Neural Synthesis", desc: "Mastering the intersection of human cognitive patterns and large scale model orchestration.", meta: "ML RESEARCH / APPLIED" },
              { title: "Vector Economics", desc: "Understanding value flow within high-frequency digital ecosystems and tokenized ecosystems.", meta: "ECONOMICS / ADVANCED" }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <Surface level={1} className="aspect-[4/3] mb-4 relative overflow-hidden ring-1 ring-[#49454f]/15">
                  {/* Image Placeholder - Dark Abstract */}
                  <div className="absolute inset-0 bg-surface-high/50 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-300" />
                  <img 
                    src={`https://images.unsplash.com/photo-1633621412960-6df85ce8e060?q=80&w=800&auto=format&fit=crop&sig=${i}`}
                    alt={item.title}
                    className="object-cover w-full h-full opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge variant="status">Live</Badge>
                  </div>
                </Surface>
                <h3 className="font-display text-xl font-bold text-on-surface mb-2 group-hover:text-brand transition-colors">{item.title}</h3>
                <p className="text-sm mb-4">{item.desc}</p>
                <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-widest">{item.meta}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Glassmorphic CTA */}
        <section className="container mx-auto px-6 pb-32">
          <Surface glass className="max-w-4xl mx-auto p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand/20 blur-[60px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/10 blur-[60px] rounded-full" />
            
            <div className="relative z-10">
              <Zap className="w-8 h-8 text-brand mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-4">Ready to initialize?</h2>
              <p className="text-lg mb-10 max-w-xl mx-auto">
                Join 10,000+ enterprise architects deploying advanced intelligence protocols through UniLearn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" className="w-full sm:w-auto h-12 px-8">Get Started</Button>
                <Button variant="ghost" className="w-full sm:w-auto h-12 px-8">Schedule Demo</Button>
              </div>
            </div>
          </Surface>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#49454f]/15 bg-surface py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
             <span className="font-display font-bold text-on-surface">UniLearn</span>
             <span className="text-xs text-on-surface-variant/70">© 2026 UniLearn Protocol. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-on-surface transition-colors">Cookie Settings</a>
            <a href="#" className="hover:text-on-surface transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  )
}