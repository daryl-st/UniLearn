import { Box, ArrowUpRight, Layers, Activity, Brain } from "lucide-react"
import { motion } from "motion/react"
import { CourseCard } from "@/components/features/public_pages/CourseCard"

// Needs refactoring
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface-variant font-sans antialiased selection:bg-brand/30 selection:text-on-surface">
      <main>
        {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAk-JlfxBZM975WbHKsB0AJFL-aq7SoY3NIv_p8pmw5gzUKPc_2ZwJ10O4XabvZloONv5W8pEX43edNz_uvBcmx8tdv90fNMWFgbj7GxrNHgIfHIUTEtYPx_xXRnCMoRO2oLiE2_00HJJ0p0dYgAL1buL1pNoccOeZGHbH57ueGph1afkhbxs2k4Nd_ftEZSNyO5ZGPECfljYDQZSoOWkkr1ATZi0YzOzYD3XUgiebmHieX6lq8PgvThGDMpHhUnH6A-D-sd2soxTc" 
                alt="Hero Background"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 obsidian-gradient"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-4xl text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-high rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant">System Status: Operational</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white leading-tight">
                Protocol for <span className="text-primary">Enterprise Intelligence</span>
              </h1>
              
              <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Deploying specialized knowledge frameworks through neural vectors. Scale your workforce intelligence with the next generation of predictive curriculum.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-sm font-bold tracking-tight hover:opacity-90 transition-all">
                  Start Learning
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-surface-highest text-on-surface rounded-sm font-bold tracking-tight hover:bg-surface-high transition-all border border-outline-variant">
                  Explore Courses
                </button>
              </div>
            </motion.div>
          </section>

        {/* Bento Grid Features */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Neural Processing */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-surface-low p-10 flex flex-col justify-between min-h-[400px] border border-outline-variant"
            >
              <div>
                <Brain className="text-primary w-10 h-10 mb-6" />
                <h3 className="text-3xl font-headline font-bold text-white mb-4">Neural Processing</h3>
                <p className="text-on-surface-variant max-w-md">Synchronous knowledge acquisition utilizing high-density data mapping and cognitive feedback loops for enterprise-grade proficiency.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="h-1 flex-1 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className="font-mono text-xs text-primary">75% SYNCED</span>
                </div>
              </div>
            </motion.div>

            {/* Cognitive Vectors */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-surface-high p-10 flex flex-col justify-between border border-outline-variant"
            >
              <div>
                <Activity className="text-secondary w-10 h-10 mb-6" />
                <h3 className="text-2xl font-headline font-bold text-white mb-4">Cognitive Vectors</h3>
                <p className="text-on-surface-variant text-sm">Adaptive learning paths that pivot in real-time based on individual neural performance metrics.</p>
              </div>
              <img 
                className="w-full h-32 object-cover rounded opacity-40 mt-8" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6sq7WHv5P2er1UiflWb7H4G_7aaMkprfuUumI_IRKNkiDqjJgnezRsf66sOGio_qmp8XtEzeCZ29fEUOip2bcatxWFKOTyYRyZyVc2C7cCCzyORUcey93eJ2AB20viKc_vSMiEU0Ocz1AifmqJEuOzsYwqTXeAHAourFHDqF2-1V4cA9YlLQEmB3P-yRNKMJb1wST7045w0CP2P5psBYNScDl7AgyOfyoIzRnqH9SJG9-JvEt9immeSTZRjtKxfNRUk9vXB_bnJkb" 
                alt="Network Visualization"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Predictive Curriculum */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-surface-high p-10 flex flex-col justify-between border border-outline-variant"
            >
              <div>
                <Layers className="text-primary w-10 h-10 mb-6" />
                <h3 className="text-2xl font-headline font-bold text-white mb-4">Predictive Curriculum</h3>
                <p className="text-on-surface-variant text-sm">Courses that evolve before the market shifts. Stay ahead of industrial demands through algorithmic foresight.</p>
              </div>
              <div className="mt-8 flex justify-end">
                <ArrowUpRight className="text-on-surface-variant w-6 h-6" />
              </div>
            </motion.div>

            {/* Architecture of Mind */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-surface-low p-10 flex flex-col md:flex-row gap-10 items-center border border-outline-variant"
            >
              <div className="flex-1">
                <h3 className="text-3xl font-headline font-bold text-white mb-4">Architecture of Mind</h3>
                <p className="text-on-surface-variant mb-6">Our protocol isn't just content; it's a structural realignment of professional expertise. Designed for high-precision environments.</p>
                <ul className="space-y-3 font-mono text-xs uppercase tracking-tighter">
                  {["Quantum Logic Modules", "Synthetic Context Generation", "Hyper-Scale Certification"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-secondary rounded-full"></span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-64 aspect-square bg-surface-highest rounded flex items-center justify-center p-8">
                <Box className="text-primary w-32 h-32" />
              </div>
            </motion.div>
          </div>
        </section>
      

        {/* Active Registries */}
          <section className="bg-surface-low py-24">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                <div className="space-y-4">
                  <h2 className="text-4xl font-headline font-bold text-white tracking-tighter">Active Registries</h2>
                  <p className="text-on-surface-variant max-w-md">Select a protocol to begin your integration into the enterprise intelligence network.</p>
                </div>
                <button className="font-mono text-xs uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all">
                  View All Protocols
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Will be edited */}
                <CourseCard 
                  id="L-01"
                  name="Algorithmic Governance"
                  // description="Frameworks for automated decision systems and ethical alignment in autonomous organizations."
                  acadamicYear={86}
                  code="Intermediate"
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuA7LCvhxVDiHX0r1T3j7SdeYYY4hy6hJW7sDxHN_E6bwwJHHipx8eUWmciFkgmDRTkhNb-xywkuh79xpo301EvHwKeA1w9fs0s9e85imNHsS-XiQUgmFhtRsZmKAaXUj9Ymf1TPPyqf6axfz8tPcIL2iy_vOLU2XlsQg5TwLChAq3R0aTfUdBDfBsG1AnBVII65wpH_GUg2N51UDsUXv9OW3FfcbBjRoXULuu5rjRbgBnLO5OIdEs_KrDV-3nNOik39T8L4gJl0rGfE"
                />
                <CourseCard 
                  id="L-02"
                  name="Neural Synthesis"
                  // description="Mastering the intersection of human cognitive patterns and large-scale model optimization."
                  acadamicYear={112}
                  code="Advanced"
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuDOwFxb3LEAoQPrKB-wxhHni_2xVt1q0LZuLkmCpRRYynn7eJYyWAi4ciSrPEiRdIu5Ez8j3oEyhmBtbrZBoNJEirbND7wMSUnexOKSthx7KIb8R13V__mVKIHVWMV6ux-wmww8MDnHVrmOQKIS-kMkeDhJoCpFEAIAk63zhcVKGNzDTEHUdJwN8QNzsU7xg47FSVm7PqWIo5P1nEy2Nx64xHaEHMiYTe1QStwA_QYKRhIAo1DRIHTePVPGDBVOVZVHBZRDDu_E7SWz"
                />
                <CourseCard 
                  id="L-03"
                  name="Vector Economics"
                  // description="Understanding value flow within high-frequency digital economies and tokenized ecosystems."
                  acadamicYear={54} 
                  code="Strategic"
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuAaFUNsa5KoQGKFVgtJLXfesn_Vl907lzr6MXB6G-f_nTB7wqgZwhYOIk3cV6gvMtLeyqUjPCJTm-uDqHn361h849S7ICVJYu0ihkP5fsOuxgluXb4DWzCLAgs44Gls0yuotQPEB8bb0UGgQ5QTrWYUVxCAQGrdV0TL7qH_dss64pdU17gUPq-UNzlCDDs_2yjWDjcXhPKLpyFcBn9G0q6mXDHAj_KLmvIMhgsAStXtBjVeFMYWlGCsH1Fym-FI2l5gnYb7wwBV5SZM"
                />
              </div>
            </div>
          </section>

        {/* Glassmorphic CTA */}
        <section className="relative py-32 px-8 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto text-center glass-card p-16 rounded-xl"
          >
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-8 tracking-tighter">Ready to initialize?</h2>
            <p className="text-lg text-on-surface-variant mb-12 max-w-xl mx-auto">Join 12,000+ enterprise architects deploying advanced intelligence protocols through UniLearn.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-10 py-4 bg-primary text-on-primary font-bold rounded-sm hover:opacity-90 transition-opacity">Get Started</button>
              <button className="px-10 py-4 border border-outline-variant text-on-surface font-bold rounded-sm hover:bg-surface-high transition-all">Schedule Demo</button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}