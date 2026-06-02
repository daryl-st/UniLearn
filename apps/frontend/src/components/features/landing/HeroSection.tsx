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

// TODO: Refactor this to fetch a few courses from the backend and display them here as featured courses.
export function ActiveRegistries() {
    return (
        <section className="bg-surface-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="space-y-4">
                  <h2 className="text-4xl font-headline font-bold text-white tracking-tighter">Featured Courses</h2>
                  <p className="text-on-surface-variant max-w-md">A few representative Computer Science courses from the catalog to help students begin exploring available resources.</p>
              </div>
              <Link to="/courses">
                <button className="font-mono text-xs uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all">
                  Browse Full Catalog
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Will be edited */}
              <CourseCard
                id="L-01"
                name="Machine Learning Basics"
                instructorName="Jane Smith"
                code="CoSc4411"
                acadamicYear={1}
              />
              <CourseCard
                id="L-02"
                name="Data Mining"
                instructorName="Lucy Maine"
                code="CoSc4510"
                acadamicYear={2}
              />
              <CourseCard
                id="L-03"
                name="Database Systems"
                instructorName="John Doe"
                code="CoSc3213"
                acadamicYear={2}
              />
            </div>
          </div>
        </section>
    )
};