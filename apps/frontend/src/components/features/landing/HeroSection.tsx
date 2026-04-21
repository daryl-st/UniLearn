import { motion } from "motion/react"; 
import { CourseCard } from "@/components/features/public/CourseCard"
import { Link } from "react-router-dom";

export function HeroSection() {
    return (
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
                <span className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant">Centralized Learning Portal</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white leading-tight">
                Learn Smarter with <span className="text-primary">AI-Powered Academic Support</span>
              </h1>
              
              <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Centralized course materials, instant summaries, and auto-generated quizzes help students find trusted resources, revise faster, and track progress over time.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {/* lets make a link that redirect to either courses page (/course) or /register on the button using Link*/}
                <Link to="/courses">
                  <button className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-sm font-bold tracking-tight hover:opacity-90 transition-all">
                    Browse Courses
                  </button>
                </Link>
                <Link to="/register">
                  <button className="w-full sm:w-auto px-8 py-4 bg-surface-highest text-on-surface rounded-sm font-bold tracking-tight hover:bg-surface-high transition-all border border-outline-variant">
                    Create Account
                  </button>
                </Link>
              </div>
            </motion.div>
        </section>
    );
}

export function ActiveRegistries() {
    return (
        <section className="bg-surface-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="space-y-4">
                  <h2 className="text-4xl font-headline font-bold text-white tracking-tighter">Featured Courses</h2>
                  <p className="text-on-surface-variant max-w-md">A few representative courses from the department catalog to help students begin exploring available resources.</p>
              </div>
              <button className="font-mono text-xs uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all">
                  Browse Full Catalog
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Will be edited */}
              <CourseCard 
                id="L-01"
                name="Machine Learning Basics"
                discipline="Computer Science"
                instructor="Jane Smith"
                // instructor="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80"
                code="CoSc4411"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuA7LCvhxVDiHX0r1T3j7SdeYYY4hy6hJW7sDxHN_E6bwwJHHipx8eUWmciFkgmDRTkhNb-xywkuh79xpo301EvHwKeA1w9fs0s9e85imNHsS-XiQUgmFhtRsZmKAaXUj9Ymf1TPPyqf6axfz8tPcIL2iy_vOLU2XlsQg5TwLChAq3R0aTfUdBDfBsG1AnBVII65wpH_GUg2N51UDsUXv9OW3FfcbBjRoXULuu5rjRbgBnLO5OIdEs_KrDV-3nNOik39T8L4gJl0rGfE"
              />
              <CourseCard 
                id="L-02"
                name="Data Mining"
                discipline="Computer Science"
                instructor="Lucy Maine"
                // instructor="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80"
                code="CoSc4510"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDOwFxb3LEAoQPrKB-wxhHni_2xVt1q0LZuLkmCpRRYynn7eJYyWAi4ciSrPEiRdIu5Ez8j3oEyhmBtbrZBoNJEirbND7wMSUnexOKSthx7KIb8R13V__mVKIHVWMV6ux-wmww8MDnHVrmOQKIS-kMkeDhJoCpFEAIAk63zhcVKGNzDTEHUdJwN8QNzsU7xg47FSVm7PqWIo5P1nEy2Nx64xHaEHMiYTe1QStwA_QYKRhIAo1DRIHTePVPGDBVOVZVHBZRDDu_E7SWz"
              />
              <CourseCard 
                id="L-03"
                name="Database Systems"
                discipline="Computer Science"
                instructor="John Doe"
                // instructor="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80"
                code="CoSc3213"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAaFUNsa5KoQGKFVgtJLXfesn_Vl907lzr6MXB6G-f_nTB7wqgZwhYOIk3cV6gvMtLeyqUjPCJTm-uDqHn361h849S7ICVJYu0ihkP5fsOuxgluXb4DWzCLAgs44Gls0yuotQPEB8bb0UGgQ5QTrWYUVxCAQGrdV0TL7qH_dss64pdU17gUPq-UNzlCDDs_2yjWDjcXhPKLpyFcBn9G0q6mXDHAj_KLmvIMhgsAStXtBjVeFMYWlGCsH1Fym-FI2l5gnYb7wwBV5SZM"
              />
            </div>
          </div>
        </section>
    )
};