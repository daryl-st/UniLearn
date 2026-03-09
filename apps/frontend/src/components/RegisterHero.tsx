import { GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegisterHero() {
  const students = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&h=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
  ];

  return (
    <div 
      className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-cover bg-center bg-white dark:bg-black"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop')" 
      }}
    >
      <div className="absolute inset-0 bg-white/78 dark:bg-black/93 backdrop-blur-sm"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 dark:text-white"
      >
        <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-black dark:bg-primary shadow-lg shadow-primary/30">
          <GraduationCap className="text-white w-8 h-8" />
        </div>
        
        <h1 className="text-foreground dark:text-white text-4xl xl:text-6xl font-black leading-tight tracking-tight mb-6">
          Welcome to <br />
          <span className="text-primary">UniLearn</span>
        </h1>
        
        <p className="text-muted-foreground dark:text-slate-200 text-lg xl:text-xl font-light max-w-lg leading-relaxed opacity-90">
          Join thousands of students across the globe. Access exclusive resources, 
          collaborate on projects, and accelerate your academic journey.
        </p>
        
        <div className="mt-16 flex items-center gap-6">
          <div className="flex -space-x-4">
            {students.map((src, i) => (
              <img 
                key={i}
                src={src} 
                alt="Student avatar" 
                className="w-12 h-12 rounded-full border-2 border-black/30 dark:border-background-dark object-cover"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-black/30 dark:border-background-dark bg-primary text-[10px] font-bold text-white uppercase tracking-tighter">
              +2k
            </div>
          </div>
          <span className="text-muted-foreground dark:text-slate-300 text-sm font-medium tracking-wide">
            Trusted by students worldwide
          </span>
        </div>
      </motion.div>
    </div>
  );
}
