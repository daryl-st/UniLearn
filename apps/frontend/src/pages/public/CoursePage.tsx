import { useEffect, useState } from "react";
import { CourseCard } from "@/components/features/public/CourseCard";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Loader, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseStore } from "@/stores/courseStrore";
// skeleton needs ajustment to match the course card design
// import { CourseSkeleton, CourseSkeletonGrid } from "@/components/features/public_pages/CourseSkeleton";

// Placeholder data - representative of technical protocols
const disciplines = ["All Disciplines", "Quantum Logic", "Neural Architecture", "Bio-Engineering", "Deep Space Ethics"];
// const catalogData = [
//   { id: "UN-882", discipline: "NEURAL SYSTEMS", title: "Advanced Synthetic Cognition", description: "Master the core protocols of recursive neural grafting and ethical AI containment in modular environments.", instructor: { name: "Dr. Elias Thorne", avatar: "/avatar- Thorne.jpg" }, image: "/course-neural.jpg" },
//   { id: "UN-419", discipline: "QUANTUM COMPUTING", title: "Quantum Cryptography Foundations", description: "Implementation of uncrackable communication channels using polarized entanglement and recursive proofing.", instructor: { name: "Prof. Sarah Chen", avatar: "/avatar-chen.jpg" }, image: "/course-quantum.jpg" },
//   { id: "UN-283", discipline: "HARDWARE DESIGN", title: "Bio-Organic Processor Design", description: "Exploring the interface between silicon substrates and cellular computing arrays for hyper-efficient execution.", instructor: { name: "Marcus Vane", avatar: "/avatar-vane.jpg" }, image: "/course-hardware.jpg" },
//   { id: "UN-771", discipline: "MACRO-ETHICS", title: "Sovereignty in Low Earth Orbit", description: "A comprehensive study of legal precedents and territorial claims in the age of commercial orbital habitats.", instructor: { name: "Dr. Helena Rossi", avatar: "/avatar-rossi.jpg" }, image: "/course-orbit.jpg" },
//   { id: "UN-115", discipline: "DISTRIBUTED LEDGERS", title: "Hyper-Scale Consensus Protocols", description: "Optimizing transaction throughput for billion-node networks using sharding and recursive proofing.", instructor: { name: "Arthur Sterling", avatar: "/avatar-sterling.jpg" }, image: "/course-consensus.jpg" },
//   { id: "UN-556", discipline: "BIO-SECURITY", title: "Viral Sequence Logic & Patching", description: "Techniques for identifying and neutralizing malignant genetic code using CRISPR-automated patching.", instructor: { name: "Dr. Maya Ishii", avatar: "/avatar-ishii.jpg" }, image: "/course-bio.jpg" }
// ];

// const fetchCourses = async () => {
//   return await CourseAPI.getAllCourses();
// }

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All Disciplines");

  // const courses = fetchCourses().then((course) => course);
  // console.log(courses);

  const { courses, isLoading, error, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Add this check
  if (!useCourseStore) {
    return <div>Store not initialized</div>;
  }

  if( isLoading ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading courses...</span>
        {/* <CourseSkeletonGrid count={6} /> */}
      </div>
    );
  }

  if( error ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24">
      {/* Header & Technical Meta */}
      <section className="mb-12 border-b border-border/10 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-on-surface mb-6">
              Public Catalog
            </h1>
            <p className="text-on-surface-variant text-base leading-relaxed">
              Explore the vanguard of decentralized education. Access specialized protocols and technical masterclasses designed for the next era of development.
            </p>
          </div>
          {/* Asymmetric Sidebar per DESIGN.md Section 7 */}
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">System Status: Optimal</span>
          </div>
        </div>
      </section>

      {/* Search & Filtering Operations */}
      <section className="mb-16 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
          <input 
            type="search" 
            placeholder="Search specialized protocols..." 
            className="w-full h-14 bg-surface-low rounded-sm pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant/40 border border-border/10 focus:ring-1 focus:ring-brand outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/50 mr-2 shrink-0">Filter by:</span>
          {disciplines.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={cn(
                "px-4 py-2.5 font-mono text-xs uppercase tracking-widest rounded-sm border border-border/10 transition-all whitespace-nowrap",
                activeFilter === item
                  ? "bg-brand/20 text-brand border-brand/30 font-semibold"
                  : "bg-surface-low text-on-surface-variant hover:border-brand/40 hover:text-on-surface"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* if no courses available show 'no courses available' message */}
      {courses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-on-surface-variant">No courses available.</p>
        </div>
      )}

      {/* Catalog Grid - High-Density Operations HUD */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </section>

      {/* Load Next Sequence Action */}
      <div className="text-center">
        <Button variant="secondary" className="px-10 h-14 font-mono text-xs uppercase tracking-widest flex items-center gap-3 mx-auto">
          <span className="animate-spin text-brand/70">↻</span> Load Next Sequence
        </Button>
      </div>
    </div>
  );
}