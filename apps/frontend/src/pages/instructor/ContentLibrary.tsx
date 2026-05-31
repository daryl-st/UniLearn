import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  Upload,
  Video,
  FileText,
  Package,
  MoreVertical,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCourseStore } from '@/stores/courseStrore';
import { useAuthStore } from '@/stores/authStore';
import { CourseAPI } from '@/api/course';
import type { FileType, Resource } from '@unilearn/shared-types';
import { resourceStatusClass, resourceStatusLabel } from '@/lib/resourceStatus';

const iconForType = (t: FileType) => {
  if (t === 'PPT') return Video;
  if (t === 'DOC') return Package;
  return FileText;
};

const colorForType = (t: FileType) => {
  if (t === 'PPT') return 'text-primary';
  if (t === 'DOC') return 'text-secondary';
  return 'text-primary';
};

const inferFileType = (file: File): FileType => {
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'PDF';
  if (
    mime === 'application/vnd.ms-powerpoint' ||
    mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    name.endsWith('.ppt') ||
    name.endsWith('.pptx')
  ) {
    return 'PPT';
  }

  if (
    mime === 'application/msword' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.doc') ||
    name.endsWith('.docx') ||
    name.endsWith('.odt') ||
    name.endsWith('.odf')
  ) {
    return 'DOC';
  }

  if (mime.startsWith('image/') || mime.startsWith('video/')) return 'DOC';
  return 'DOC';
};

export const ContentLibrary: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('No file selected');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { courses, fetchCourses } = useCourseStore();
  const authUser = useAuthStore((s) => s.user);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formType, setFormType] = useState<FileType>('PDF');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id);
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const r = await CourseAPI.getResourcesByCourseId(selectedCourseId);
        if (!cancelled) setResources(Array.isArray(r) ? r : []);
      } catch {
        if (!cancelled) setResources([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const totalPages = Math.max(1, Math.ceil(resources.length / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageEnd = pageStart + itemsPerPage;
  const paginatedAssets = useMemo(() => resources.slice(pageStart, pageEnd), [resources, pageStart, pageEnd]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCourseId, resources.length]);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const inferredType = inferFileType(file);
      setSelectedFileName(file.name);
      setSelectedFile(file);
      setFormType(inferredType);
      setFormTitle((previousTitle) =>
        previousTitle.trim() === '' || previousTitle === selectedFileName
          ? file.name.replace(/\.[^/.]+$/, '')
          : previousTitle,
      );
    }
  };

  const handleSubmitMetadata = async () => {
    if (!selectedCourseId || !selectedCourse) return;
    const title = formTitle.trim();
    const fileUrl = formUrl.trim();
    if (!title) return;
    setSubmitting(true);
    setUploadSuccess(null);
    try {
      if (selectedFile) {
        const duplicateFile = resources.some(
          (resource) =>
            resource.courseId === selectedCourseId &&
            resource.title === title,
        );
        if (duplicateFile) {
          alert('A resource with this title already exists for this course.');
          return;
        }

        const fd = new FormData();
        fd.append('file', selectedFile);
        fd.append('title', title);
        fd.append('type', inferFileType(selectedFile));
        fd.append('courseId', selectedCourseId);
        fd.append('instructorId', authUser?.id ?? selectedCourse.instructorId);

        const response = await CourseAPI.uploadResource(fd as any);
        const ingestNote =
          response.ingestStatus === 'pending'
            ? ' Indexing for AI may take a moment.'
            : '';
        setUploadSuccess(`Uploaded "${response.resource.title}".${ingestNote}`);
      } else {
        if (!fileUrl) return;
        const duplicateUrl = resources.some(
          (resource) =>
            resource.courseId === selectedCourseId &&
            resource.fileUrl === fileUrl,
        );
        if (duplicateUrl) {
          alert('This resource URL already exists for this course.');
          return;
        }

        await CourseAPI.uploadResource({
          title,
          type: formType,
          fileUrl,
          courseId: selectedCourseId,
          instructorId: authUser?.id ?? selectedCourse.instructorId,
        });
        setUploadSuccess(`Saved "${title}" from URL.`);
      }

      const r = await CourseAPI.getResourcesByCourseId(selectedCourseId);
      setResources(Array.isArray(r) ? r : []);
      setFormUrl('');
      setFormTitle('');
      setSelectedFileName('No file selected');
      setSelectedFile(null);
      setFormType('PDF');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const firstResource = resources[0];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tight">Content upload</h1>
          <p className="text-outline max-w-xl mt-2">
            Upload PDF, PowerPoint, or Word files to Cloudinary. Office files are converted to PDF automatically.
            You can also paste a public URL for externally hosted materials.
          </p>
          {uploadSuccess ? (
            <p className="text-sm text-secondary mt-2">{uploadSuccess}</p>
          ) : null}
          <p className="text-[10px] font-mono text-outline mt-2 uppercase tracking-widest">{selectedFileName}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-surface-high border-none text-sm px-4 py-2.5 rounded-lg text-on-surface min-w-[220px]"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="bg-surface-high text-on-surface px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-surface-highest active:scale-95 transition-all"
              onClick={handleSelectFile}
            >
              <FolderPlus size={20} />
              <span>Select file</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant/20 bg-surface-low/80 p-4 space-y-3 max-w-3xl">
        <p className="text-[11px] font-mono text-outline uppercase tracking-widest">Add resource metadata</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Title"
            className="bg-surface-high border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface"
          />
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value as FileType)}
            className="bg-surface-high border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface"
          >
            <option value="PDF">PDF</option>
            <option value="PPT">PPT</option>
            <option value="DOC">DOC</option>
          </select>
        </div>
        <input
          value={formUrl}
          onChange={(e) => setFormUrl(e.target.value)}
          placeholder="Public file URL (optional when uploading a file)"
          className="w-full bg-surface-high border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface"
        />
        <button
          type="button"
          disabled={submitting || !selectedCourseId}
          onClick={() => void handleSubmitMetadata()}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
        >
          <Upload size={20} />
          {submitting ? 'Saving…' : 'Save resource'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-9 space-y-4">
          <div className="bg-surface-low rounded-xl overflow-hidden border border-outline-variant/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-high/50 text-outline text-[11px] font-mono uppercase tracking-[0.2em]">
                    <th className="px-6 py-4 font-medium">Resource</th>
                    <th className="px-4 py-4 font-medium">File type</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium text-right">Version</th>
                    <th className="px-6 py-4 font-medium text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-sm text-outline">
                        Loading…
                      </td>
                    </tr>
                  ) : paginatedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-sm text-outline">
                        No resources for this course.
                      </td>
                    </tr>
                  ) : (
                    paginatedAssets.map((asset) => {
                      const Icon = iconForType(asset.type);
                      return (
                        <tr key={asset.id} className="hover:bg-surface-high/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'w-10 h-10 rounded-lg bg-surface-high flex items-center justify-center',
                                  colorForType(asset.type),
                                )}
                              >
                                <Icon size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-medium group-hover:text-primary transition-colors">{asset.title}</div>
                                <div className="text-[10px] font-mono text-outline truncate max-w-[240px]">{asset.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-0.5 rounded bg-surface-highest text-[10px] font-mono text-outline">
                              {asset.type}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded border text-[10px] font-mono uppercase',
                                resourceStatusClass(asset.status),
                              )}
                            >
                              {resourceStatusLabel(asset.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-xs font-mono text-outline">v{asset.version}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={String(asset.fileUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-primary underline"
                            >
                              Open
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <p className="text-[11px] font-mono text-outline">
              SHOWING {resources.length === 0 ? 0 : pageStart + 1}-{Math.min(pageEnd, resources.length)} OF {resources.length}{' '}
              RESOURCES
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 rounded bg-surface-high text-outline hover:text-on-surface disabled:opacity-30"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[11px] font-mono text-primary px-3">
                PAGE {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="p-1.5 rounded bg-surface-high text-outline hover:text-on-surface disabled:opacity-30"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-3 space-y-6">
          <div className="bg-surface-high rounded-xl p-6 border border-outline-variant/5 glass-panel">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">Selected course</span>
              <button type="button" className="text-outline hover:text-on-surface">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="aspect-video w-full rounded-lg bg-surface-low overflow-hidden mb-6 relative group">
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <PlayCircle size={48} className="text-white" />
              </div>
              <img
                src="https://picsum.photos/seed/preview/400/225"
                alt=""
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-headline font-bold text-lg leading-tight">
                  {firstResource?.title ?? 'No resource yet'}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                  {firstResource ? (
                    <>
                      <span className="px-2 py-0.5 rounded-sm bg-secondary/15 text-secondary border border-secondary/25">
                        {firstResource.type}
                      </span>
                      <a
                        href={String(firstResource.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        Open link
                      </a>
                    </>
                  ) : (
                    <span className="text-outline">Add a resource using the form above</span>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-surface-low/70 border border-outline-variant/10 p-3 grid grid-cols-2 gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="text-[10px] font-mono text-outline uppercase tracking-wider">Instructor id</p>
                  <p className="text-xs font-medium truncate font-mono">{selectedCourse?.instructorId ?? '—'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-mono text-outline uppercase tracking-wider">Resources</p>
                  <p className="text-xs font-medium text-secondary">{resources.length}</p>
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                {selectedCourseId ? (
                  <button
                    type="button"
                    className="w-full bg-primary text-on-primary py-2 rounded font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
                    onClick={() => navigate(`/dashboard/courses/${selectedCourseId}`)}
                  >
                    Preview course materials
                  </button>
                ) : null}
                <button
                  type="button"
                  className="w-full bg-on-surface text-surface py-2 rounded font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
                  onClick={() => navigate('/instructor/courses')}
                >
                  Back to course list
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-low rounded-xl p-6 border border-outline-variant/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-primary tracking-widest uppercase">Note</span>
            </div>
            <p className="text-xs text-outline leading-relaxed">
              Files upload to Cloudinary. PPT and DOC materials are converted to PDF via the Aspose add-on (enable it in
              your Cloudinary dashboard). Set <span className="font-mono">PUBLIC_API_URL</span> on the backend for conversion
              webhooks in local development.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-90 transition-all group"
        onClick={handleSelectFile}
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileChange}
      />
    </motion.div>
  );
};
