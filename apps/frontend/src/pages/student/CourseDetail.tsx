import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  Clock,
  BarChart,
  BookOpen,
  Play,
  CheckCircle2,
  Share2,
  Bookmark,
  ArrowRight,
  Info,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { Course, Resource } from '@unilearn/shared-types';
import { CourseAPI } from '@/api/course';
import { courseThumbUrl } from '@/lib/coursePlaceholders';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function CourseDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [c, r] = await Promise.all([
          CourseAPI.getCourse(courseId),
          CourseAPI.getResourcesByCourseId(courseId),
        ]);
        if (cancelled) return;
        setCourse(c);
        setResources(Array.isArray(r) ? r : []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load course');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!activeResource || activeResource.type !== 'PDF') {
      return undefined;
    }

    let cancelled = false;
    let loadingTask = getDocument(String(activeResource.fileUrl));

    setPdfLoading(true);
    setPdfError(null);
    setPdfPageCount(0);
    setPdfPageNumber(1);

    loadingTask.promise
      .then((doc: PDFDocumentProxy) => {
        if (cancelled) return;
        setPdfDocument(doc);
        setPdfPageCount(doc.numPages);
        setPdfPageNumber(1);
        setPdfLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setPdfError(err instanceof Error ? err.message : 'Failed to load PDF');
        setPdfLoading(false);
        setPdfDocument(null);
      });

    return () => {
      cancelled = true;
      if (loadingTask) {
        loadingTask.destroy();
      }
    };
  }, [activeResource]);

  useEffect(() => {
    const renderPdfPage = async () => {
      if (!pdfDocument || !canvasRef.current) return;

      try {
        const page = await pdfDocument.getPage(pdfPageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderTask = (page as any).render({ canvasContext: context, viewport });
        await renderTask.promise;
      } catch (err) {
        setPdfError(err instanceof Error ? err.message : 'Failed to render PDF page');
      }
    };

    renderPdfPage();
  }, [pdfDocument, pdfPageNumber]);

  const handleBack = () => {
    navigate('/dashboard/courses');
  };

  const handleStart = () => {
    if (course) navigate(`/dashboard/learning/${course.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-surface p-12 text-on-surface-variant font-mono text-sm">Loading course…</div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-full bg-surface p-12 space-y-4">
        <p className="text-error text-sm">{error || 'Course not found.'}</p>
        <button type="button" onClick={handleBack} className="text-primary text-sm font-mono underline">
          Back to catalog
        </button>
      </div>
    );
  }

  const thumb = courseThumbUrl(course.id);
  const instructorLabel = course.instructorId;

  return (
    <div className="min-h-full bg-surface">
      <section className="relative h-100 w-full overflow-hidden">
        <img src={thumb} alt="" className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/60 to-transparent" />

        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end max-w-7xl mx-auto w-full">
          <button
            type="button"
            onClick={handleBack}
            className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to My Courses
          </button>

          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-sm bg-primary/20 text-primary text-[10px] font-mono font-bold tracking-tighter uppercase border border-primary/30">
                {course.code}
              </span>
              <span className="text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">
                Year {course.acadamicYear}
              </span>
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter">{course.name}</h1>

            <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-mono text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Catalog course
              </span>
              <span className="flex items-center gap-2">
                <BarChart className="w-4 h-4" /> Live API
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> {resources.length} resource{resources.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <h3 className="font-headline text-xl font-bold text-white uppercase tracking-tight">Course materials</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Resources uploaded for this course. Click "Open" to view materials inline; download if needed for offline study.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-surface-low rounded-sm border border-outline-variant/5 overflow-hidden">
              <div className="p-5 flex items-center justify-between bg-surface-high/30">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-on-surface-variant/40">01</span>
                  <h4 className="font-headline font-bold text-white text-sm uppercase tracking-wide">Repository</h4>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant uppercase">{resources.length} files</span>
              </div>

              <div className="divide-y divide-outline-variant/5">
                {resources.length === 0 ? (
                  <div className="p-6 text-on-surface-variant text-sm">No resources for this course yet.</div>
                ) : (
                  resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 flex items-center justify-between group hover:bg-surface-high/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-surface-high text-on-surface-variant shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] text-white font-medium truncate">{res.title}</p>
                          <p className="text-[10px] font-mono text-on-surface-variant uppercase mt-0.5">
                            {res.type} · v{res.version}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveResource(res)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-sm"
                          title="Open resource"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary hover:bg-primary/10 rounded-sm"
                          onClick={handleStart}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {activeResource ? (
                <div className="mt-4 p-4 bg-surface-low rounded-sm border border-outline-variant/10">
                  {activeResource.type === 'PDF' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3 text-sm text-on-surface-variant">
                        <span>Page {pdfPageNumber} of {pdfPageCount}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPdfPageNumber((page) => Math.max(page - 1, 1))}
                            disabled={pdfPageNumber <= 1 || pdfLoading}
                            className="px-3 py-2 bg-surface-high text-on-surface rounded disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={() => setPdfPageNumber((page) => Math.min(page + 1, pdfPageCount))}
                            disabled={pdfPageNumber >= pdfPageCount || pdfLoading}
                            className="px-3 py-2 bg-surface-high text-on-surface rounded disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-[640px] bg-black/5 rounded border border-outline-variant/10 overflow-auto flex items-center justify-center">
                        {pdfLoading ? (
                          <div className="text-on-surface-variant">Loading PDF…</div>
                        ) : pdfError ? (
                          <div className="text-error text-sm">{pdfError}</div>
                        ) : (
                          <canvas ref={canvasRef} className="w-full" />
                        )}
                      </div>
                      <div className="flex justify-end">
                        <a href={String(activeResource.fileUrl)} className="px-4 py-2 bg-primary text-on-primary rounded" download>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  ) : activeResource.type === 'PPT' ? (
                    <div className="space-y-3">
                      <div className="w-full h-[640px] bg-black/5 rounded border border-outline-variant/10">
                        <iframe
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(String(activeResource.fileUrl))}`}
                          title={activeResource.title}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex justify-end">
                        <a href={String(activeResource.fileUrl)} className="px-4 py-2 bg-primary text-on-primary rounded" download>
                          Download Presentation
                        </a>
                      </div>
                    </div>
                  ) : activeResource.type === 'DOC' ? (
                    <div className="space-y-3">
                      <div className="w-full h-[640px] bg-black/5 rounded border border-outline-variant/10">
                        <iframe
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(String(activeResource.fileUrl))}`}
                          title={activeResource.title}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex justify-end">
                        <a href={String(activeResource.fileUrl)} className="px-4 py-2 bg-primary text-on-primary rounded" download>
                          Download Document
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-on-surface-variant">This file type cannot be previewed inline. Use the download button below.</p>
                      <div className="flex justify-end">
                        <a href={String(activeResource.fileUrl)} className="px-4 py-2 bg-primary text-on-primary rounded" download>
                          Download File
                        </a>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveResource(null);
                      setPdfDocument(null);
                      setPdfPageCount(0);
                      setPdfPageNumber(1);
                      setPdfError(null);
                    }}
                    className="w-full mt-3 px-4 py-2 bg-surface-high text-on-surface rounded text-sm"
                  >
                    Close Viewer
                  </button>
                </div>
              ) : null}

            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-low rounded-sm p-8 border border-outline-variant/5 space-y-8 sticky top-24">
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleStart}
                className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
              >
                <Play className="w-4 h-4 fill-current" />
                Open learning workspace
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="py-3 bg-surface-high text-on-surface-variant hover:text-white rounded-sm border border-outline-variant/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Summary
                </button>
                <button
                  type="button"
                  className="py-3 bg-surface-high text-on-surface-variant hover:text-white rounded-sm border border-outline-variant/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Quiz
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-outline-variant/5 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(instructorLabel)}`}
                  alt=""
                  className="w-12 h-12 rounded-sm grayscale"
                />
                <div>
                  <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Instructor account</p>
                  <p className="text-sm font-bold text-white font-mono truncate max-w-[200px]">{instructorLabel}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Learning tools</h5>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[13px] text-on-surface-variant">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Open course resources inline. PDFs, presentations, and documents render inside the app.</span>
                  </li>
                  <li className="flex items-center gap-3 text-[13px] text-on-surface-variant opacity-60">
                    <CheckCircle2 className="w-4 h-4 text-on-surface-variant shrink-0" />
                    <span>AI summary & quiz generation require backend AI routes (not available yet).</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-outline-variant/5">
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-sm flex gap-4">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Course metadata and resources are loaded from <span className="font-mono text-primary">GET /course/:id</span> and{' '}
                  <span className="font-mono text-primary">GET /course/resource?courseId=…</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
