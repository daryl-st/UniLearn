// src/components/features/courses/CourseCard.tsx
import { Surface } from "@/components/ui/Surface";
import { Badge } from "@/components/ui/Badge";
import { motion } from "motion/react";

interface CourseCardProps {
    id: string,
    name: string,
    code: string,
    acadamicYear: number,
    image?: string,
}

// interface CourseCardProps {
//   id: string;
//   discipline: string;
//   title: string;
//   description: string;
//   instructor: { name: string; avatar: string };
//   image: string;
// }

// export function CourseCard({ id, discipline, title, description, instructor, image }: CourseCardProps) {
export function CourseCard({ id, name, code, acadamicYear, image }: CourseCardProps) {
  return (
    // let's wrap it with motion.div for hover effects
    <motion.div 
      whileHover={{ y: -10 }} 
      className="group cursor-pointer"
    >
    <Surface level={1} className="overflow-hidden group flex flex-col h-full border border-border/10">
      {/* Visual Input - Asymmetric aspect ratio */}
      <div className="aspect-[16/10] overflow-hidden relative">
        <img 
          // src={name}
          src={image} 
          alt={name} 
          className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
        />
        {/* Absolute Protocol ID - Section 5 Metadata Rule */}
        <Badge className="absolute top-3 right-3 font-mono text-[9px] bg-surface-high/70 backdrop-blur-sm border border-border/10">
          ID: {id}
        </Badge>
      </div>

      {/* Content Stack - Engineered Layout */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-6">
          <Badge variant="status" className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {code}
            {/* {discipline} */}
          </Badge>
          <h3 className="font-display text-xl font-bold text-on-surface leading-snug group-hover:text-brand transition-colors">
            {name}
            {/* {title} */}
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
            {acadamicYear}
            {/* {description} */}
          </p>
        </div>

        {/* Action/Instructor Node */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/10 mt-auto">
          {/* <div className="flex items-center gap-2.5">
            <img 
              src={instructor.avatar} 
              alt={instructor.name} 
              className="w-7 h-7 rounded-full object-cover grayscale" 
            />
            <span className="font-sans text-xs text-on-surface-variant/80">
              {instructor.name}
            </span>
          </div> */}
          <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/50">
            Enrollment Required
          </span>
        </div>
      </div>
    </Surface>
    </motion.div>
  );
}

// const CourseCard = ({ id, title, description, modules, level, image }: any) => (
//   <motion.div 
//     whileHover={{ y: -10 }}
//     className="group cursor-pointer"
//   >
//     <div className="relative overflow-hidden mb-6 aspect-[4/3] border border-outline-variant">
//       <img 
//         className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" 
//         src={image} 
//         alt={title}
//         referrerPolicy="no-referrer"
//       />
//       <div className="absolute top-4 right-4 px-2 py-1 bg-surface-highest text-secondary font-mono text-[10px] tracking-widest rounded-sm border border-outline-variant">
//         {id}
//       </div>
//     </div>
//     <div className="space-y-3">
//       <h4 className="text-xl font-headline font-bold text-white group-hover:text-primary transition-colors">{title}</h4>
//       <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
//       <div className="flex items-center gap-4 pt-2">
//         <span className="text-[10px] font-mono text-on-surface-variant uppercase">{modules} Modules</span>
//         <span className="text-[10px] font-mono text-on-surface-variant uppercase">{level}</span>
//       </div>
//     </div>
//   </motion.div>
// );