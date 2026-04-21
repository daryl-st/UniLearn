import { motion } from "motion/react"
import { Box, ArrowUpRight, Layers, Activity, Brain } from "lucide-react"
import { Link } from "react-router-dom"

export function BentoGrid() {
    return (
        <section className="max-w-7xl mx-auto px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Neural Processing */}
                <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-surface-low p-10 flex flex-col justify-between min-h-100 border border-outline-variant"
                >
                    <div>
                        <Brain className="text-primary w-10 h-10 mb-6" />
                        <h3 className="text-3xl font-headline font-bold text-white mb-4">Centralized Repository</h3>
                        <p className="text-on-surface-variant max-w-md">A single trusted space for course materials organized by department, academic year, and course so students and instructors can avoid scattered file sharing.</p>
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
                    <h3 className="text-2xl font-headline font-bold text-white mb-4">AI Learning Tools</h3>
                    <p className="text-on-surface-variant text-sm">Summaries and quizzes are generated directly from selected course content to support faster revision and more active study sessions.</p>
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
                    <Link to="/courses">
                        <div>
                            <Layers className="text-primary w-10 h-10 mb-6" />
                            <h3 className="text-2xl font-headline font-bold text-white mb-4">Resource Discovery</h3>
                            <p className="text-on-surface-variant text-sm">Students can browse, search, and filter courses using practical criteria such as department, course code, and academic year.</p>
                        </div>
                    
                        <div className="mt-8 flex justify-end">
                            <ArrowUpRight className="text-on-surface-variant w-6 h-6" />
                        </div>
                    </Link>
                </motion.div>

                {/* Architecture of Mind */}
                <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-surface-low p-10 flex flex-col md:flex-row gap-10 items-center border border-outline-variant"
                >
                <div className="flex-1">
                    <h3 className="text-3xl font-headline font-bold text-white mb-4">Study Workflow</h3>
                    <p className="text-on-surface-variant mb-6">Access materials, request a concise summary, generate a quiz, and review feedback in one continuous learning flow.</p>
                    <ul className="space-y-3 font-mono text-xs uppercase tracking-tighter">
                    {["Centralized course materials", "AI summaries and quizzes", "Progress tracking and feedback"].map((item) => (
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
    )
}