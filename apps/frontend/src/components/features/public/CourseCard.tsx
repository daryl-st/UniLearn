import { Surface } from "@/components/ui/Surface";
import { Badge } from "@/components/ui/Badge";
import { motion } from "motion/react";
import { courseThumbUrl, MVP_DEPARTMENT_LABEL } from "@/lib/coursePlaceholders";

type CourseCardProps = {
  id?: string;
  name: string;
  code: string;
  acadamicYear?: number;
  instructorId?: string;
  instructorName?: string;
};

const fallbackImage =
  "https://media.istockphoto.com/id/2215967400/vector/smart-education-and-online-learning-with-digital-graduation-cap-vector-illustration.jpg?s=612x612&w=0&k=20&c=cdM8xg9s0cP_26UweU1HD0TrP5q9bL9xGKXxHtnJdbM=";

// interface CourseCardProps {
//   id: string;
//   discipline: string;
//   title: string;
//   description: string;
//   instructor: { name: string; avatar: string };
//   image: string;
// }

// export function CourseCard({ id, discipline, title, description, instructor, image }: CourseCardProps) {
export function CourseCard({ id, name, code, acadamicYear, instructorId, instructorName }: CourseCardProps) {
  const cover = id ? courseThumbUrl(id) : fallbackImage;
  const instructorLabel = instructorName || instructorId || "Instructor";
  return (
    // let's wrap it with motion.div for hover effects
    <motion.div 
      whileHover={{ y: -10 }} 
      className="group cursor-pointer"
    >
    <Surface level={1} className="overflow-hidden group flex flex-col h-full border border-border/10">
      {/* Visual Input - Asymmetric aspect ratio */}
      <div className="aspect-16/10 overflow-hidden relative">
        <img src={cover} alt={name} className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
        {/* Absolute Protocol ID - Section 5 Metadata Rule */}
        <Badge className="absolute top-3 right-3 font-mono text-[9px] bg-surface-high/70 backdrop-blur-sm border border-border/10">
          Course Code: {code}
        </Badge>
      </div>

      {/* Content Stack - Engineered Layout */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-6">
          <Badge variant="status" className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Year {acadamicYear ?? 1} · {MVP_DEPARTMENT_LABEL}
          </Badge>
          <h3 className="font-display text-xl font-bold text-on-surface leading-snug group-hover:text-brand transition-colors">
            {name}
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
            Course overview available after sign-in.
          </p>
        </div>

        {/* Action/Instructor Node */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/10 mt-auto">
          <div className="flex items-center gap-2.5">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(instructorLabel)}`}
              alt=""
              className="w-7 h-7 rounded-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
            <span className="font-sans text-xs text-on-surface-variant/80 truncate max-w-[120px]">{instructorLabel}</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/50">
            Sign In for Resources
          </span>
        </div>
      </div>
    </Surface>
    </motion.div>
  );
}