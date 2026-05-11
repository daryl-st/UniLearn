import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Verified, Clock, Rocket, PlayCircle, Share2, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '@/stores/courseStrore';
import { CourseAPI } from '@/api/course';
import { courseThumbUrl } from '@/lib/coursePlaceholders';

export default function Dashboard() {
  const navigate = useNavigate();
  const { courses, fetchCourses, isLoading } = useCourseStore();
  const [materialCount, setMaterialCount] = useState<number | null>(null);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (courses.length === 0) {
      setMaterialCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const counts = await Promise.all(
          courses.map((c) =>
            CourseAPI.getResourcesByCourseId(c.id).then((r) => (Array.isArray(r) ? r.length : 0)),
          ),
        );
        if (!cancelled) setMaterialCount(counts.reduce((a, b) => a + b, 0));
      } catch {
        if (!cancelled) setMaterialCount(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courses]);

  const openCourseDetails = (courseId: string) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  const openLearningWorkspace = (courseId: string) => {
    navigate(`/dashboard/learning/${courseId}`);
  };

  const studentNotifications = [
    {
      id: 'sn-1',
      title: 'New resource added to CoSc4411',
      description: 'Your instructor uploaded an additional revision file for this week.',
      time: '2h ago',
      type: 'instructor',
    },
    {
      id: 'sn-2',
      title: 'Summary generated successfully',
      description: 'Your AI summary for Normalization Lecture is now available.',
      time: 'Yesterday',
      type: 'system',
    },
    {
      id: 'sn-3',
      title: 'Quiz feedback is ready',
      description: 'Review incorrect answers to improve your next attempt.',
      time: '2 days ago',
      type: 'sandbox',
    },
  ] as const;

  const stats = [
    {
      label: 'Courses in catalog',
      value: isLoading ? '…' : String(courses.length).padStart(2, '0'),
      detail: 'From GET /course (not enrollment)',
      icon: Rocket,
    },
    {
      label: 'Average quiz score',
      value: '—',
      status: 'Requires quiz / attempt APIs',
      icon: Verified,
    },
    {
      label: 'Learning materials',
      value: materialCount === null ? '…' : String(materialCount),
      status: 'Resources across catalog',
      icon: Clock,
    },
  ];

  const featured = courses[0];
  const secondary = courses.slice(1, 3);

  return (
    <div className="p-8 space-y-10">
      <section className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Student Dashboard</p>
        <h1 className="font-headline text-3xl font-bold text-white">Track your learning and continue your study plan.</h1>
        <p className="text-on-surface-variant text-sm max-w-3xl">
          Course and resource counts below come from the live Computer Science catalog APIs. Enrollment and quiz analytics are not implemented yet.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-low p-6 rounded-sm border border-outline-variant/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">{stat.label}</p>
            <h3 className="font-headline text-4xl font-bold text-white">{stat.value}</h3>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {'change' in stat && stat.change && (
                <span className="text-secondary font-mono text-xs">{stat.change}</span>
              )}
              {'status' in stat && stat.status && (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">{stat.status}</span>
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                </div>
              )}
              {'detail' in stat && stat.detail && (
                <span className="text-on-surface-variant font-mono text-xs">{stat.detail}</span>
              )}
              {'trend' in stat && stat.trend && (
                <span className="text-on-surface-variant/40 font-mono text-[10px]">vs last month</span>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h4 className="font-headline text-lg font-bold text-white uppercase tracking-tight">Continue learning</h4>
          <Link to="/dashboard/courses">
            <button type="button" className="text-primary text-[11px] font-mono uppercase tracking-widest hover:underline">
              View catalog
            </button>
          </Link>
        </div>

        {featured ? (
          <div
            className="glass-ai rounded-sm p-8 flex flex-col md:flex-row gap-8 items-center border border-primary/10 cursor-pointer"
            onClick={() => openCourseDetails(featured.id)}
          >
            <div className="w-full md:w-1/3 aspect-video rounded-sm overflow-hidden relative shadow-2xl group cursor-pointer">
              <img
                src={courseThumbUrl(featured.id)}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <PlayCircle className="text-white w-4 h-4" />
                <span className="text-white text-[10px] font-mono">Course: {featured.code}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono rounded-sm border border-secondary/20">
                    CATALOG
                  </span>
                  <span className="text-on-surface-variant font-mono text-[10px]">Year {featured.acadamicYear}</span>
                </div>
                <h3 className="font-headline text-3xl font-bold text-white leading-tight">{featured.name}</h3>
                <p className="text-on-surface-variant text-sm max-w-xl mt-2 font-mono">
                  Instructor: {featured.instructorName || featured.instructorId}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                    Progress tracking not available
                  </span>
                  <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Live catalog data</span>
                </div>
                <div className="w-full h-1 bg-surface-high rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="button"
                  className="px-8 py-3 bg-primary text-on-primary font-headline font-bold rounded-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10"
                  onClick={(event) => {
                    event.stopPropagation();
                    openLearningWorkspace(featured.id);
                  }}
                >
                  Continue learning
                </button>
                <button
                  type="button"
                  className="p-3 bg-surface-high text-on-surface rounded-sm hover:bg-surface-high/80 transition-colors border border-outline-variant/10"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-outline-variant/30 p-10 text-center text-on-surface-variant text-sm">
            {isLoading ? 'Loading catalog…' : 'No courses in the database yet.'}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-headline text-lg font-bold text-white uppercase tracking-tight">More courses</h4>
            <div className="flex gap-2">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-low text-on-surface-variant hover:text-white transition-colors border border-outline-variant/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-low text-on-surface-variant hover:text-white transition-colors border border-outline-variant/10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondary.map((course) => (
              <div
                key={course.id}
                onClick={() => openCourseDetails(course.id)}
                className="bg-surface-low rounded-sm p-4 group cursor-pointer hover:bg-surface-high transition-all border border-outline-variant/5"
              >
                <div className="aspect-video w-full rounded-sm mb-4 overflow-hidden relative">
                  <img
                    src={courseThumbUrl(course.id)}
                    alt=""
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-surface/60 backdrop-blur-md p-1.5 rounded-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <p className="font-mono text-[9px] text-primary uppercase tracking-[0.2em] mb-1">{course.code}</p>
                <h5 className="font-headline font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                  {course.name}
                </h5>
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(course.instructorId)}`}
                    alt=""
                    className="w-6 h-6 rounded-sm grayscale"
                  />
                  <span className="text-[11px] text-on-surface-variant truncate">
                    {course.instructorName || course.instructorId}
                  </span>
                  <span className="ml-auto text-on-surface-variant font-mono text-[10px]">Y{course.acadamicYear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-headline text-lg font-bold text-white uppercase tracking-tight">Recent activity</h4>
          <div className="bg-surface-low rounded-sm border border-outline-variant/5 divide-y divide-outline-variant/5">
            {studentNotifications.map((notif) => (
              <div key={notif.id} className="p-4 flex gap-4 hover:bg-surface-high/30 transition-colors">
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                    notif.type === 'system'
                      ? 'bg-secondary/10 text-secondary'
                      : notif.type === 'instructor'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-primary-fixed-dim/10 text-primary-fixed-dim'
                  }`}
                >
                  {notif.type === 'system' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : notif.type === 'instructor' ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-[13px] text-white font-medium">{notif.title}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{notif.description}</p>
                  <p className="text-[9px] font-mono text-on-surface-variant/40 mt-2 uppercase tracking-tighter">
                    {notif.time} · {notif.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="w-full py-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors bg-surface-high rounded-sm border border-outline-variant/10"
          >
            Clear notifications
          </button>
        </div>
      </div>
    </div>
  );
}
