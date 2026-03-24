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
      className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-cover bg-center bg-background"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop')" 
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/80 to-transparent backdrop-blur-sm"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10"
      >
        <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary shadow-lg shadow-primary/30">
          <GraduationCap className="text-primary-foreground w-8 h-8" />
        </div>
        
        <h1 className="text-foreground text-2xl xl:text-5xl font-black leading-tight tracking-tight mb-6">
          Welcome to <br />
          <span className="text-primary">UniLearn</span>
        </h1>
        
        <p className="text-muted-foreground text-lg xl:text-xl font-light max-w-lg leading-relaxed opacity-90">
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
                className="w-10 h-10 rounded-full border-2 border-border object-cover"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-border bg-primary text-[10px] font-bold text-primary-foreground uppercase tracking-tighter">
              +2k
            </div>
          </div>
          <span className="text-muted-foreground text-sm font-medium tracking-wide">
            Trusted by students worldwide
          </span>
        </div>
      </motion.div>
    </div>
  );
}
