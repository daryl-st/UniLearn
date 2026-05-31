import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import type { FileType, ResourceStatus } from '@unilearn/shared-types';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Minus, Plus } from 'lucide-react';
import { CourseAPI } from '@/api/course';
import { isPdfPreviewPending, isDownloadOnlyResource, isUnavailableResource, shouldAttemptPdfPreview } from '@/lib/resourceStatus';
import { resolveCloudinaryViewerUrl } from '@/lib/cloudinaryViewer';

const ZOOM_LEVELS = [0.75, 1, 1.25, 1.5] as const;
const DEFAULT_PAGE_WIDTH = 720;

type ResourcePdfViewerProps = {
  resourceId: string;
  fileUrl: string;
  title: string;
  type: FileType;
  status?: ResourceStatus;
  initialPage?: number;
};

export function ResourcePdfViewer({
  resourceId,
  fileUrl,
  title,
  type,
  status,
  initialPage = 1,
}: ResourcePdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  const zoom = ZOOM_LEVELS[zoomIndex] ?? 1;
  const externalUrl = resolveCloudinaryViewerUrl(String(fileUrl), type);
  const previewPending = isPdfPreviewPending({ type, status });
  const canPreview = shouldAttemptPdfPreview({ type, status, fileUrl });
  const downloadOnly = isDownloadOnlyResource({ type, fileUrl });
  const unavailable = isUnavailableResource({ fileUrl });

  useEffect(() => {
    setPageNumber(Math.max(1, initialPage));
    setNumPages(0);
    setLoadError(null);
    setIsDocumentLoading(true);
    setPdfData(null);
  }, [resourceId, initialPage]);

  useEffect(() => {
    if (!canPreview || previewPending) return;

    let cancelled = false;

    void (async () => {
      try {
        const buffer = await CourseAPI.fetchResourceFile(resourceId);
        if (cancelled) return;
        setPdfData(new Uint8Array(buffer));
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setPdfData(null);
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'Could not load this PDF. Try opening it in a new tab.';
        setLoadError(message);
        setIsDocumentLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resourceId, canPreview, previewPending]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      setContainerWidth(el.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: total }: { numPages: number }) => {
    setNumPages(total);
    setPageNumber((prev) => Math.min(Math.max(1, prev), total));
    setLoadError(null);
    setIsDocumentLoading(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setLoadError('Could not render this PDF in the app viewer.');
    setIsDocumentLoading(false);
  }, []);

  const goToPage = (next: number) => {
    if (numPages <= 0) return;
    setPageNumber(Math.min(Math.max(1, next), numPages));
  };

  const pageWidth = useMemo(() => {
    const base = containerWidth > 0 ? containerWidth : DEFAULT_PAGE_WIDTH;
    return Math.floor(base * zoom);
  }, [containerWidth, zoom]);

  const documentFile = useMemo(() => {
    if (!pdfData) return null;
    return { data: pdfData };
  }, [pdfData]);

  const externalLink = (
    <a
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary text-xs font-mono underline hover:opacity-90"
    >
      Open in new tab
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );

  if (previewPending) {
    return (
      <div className="flex min-h-[min(70vh,720px)] flex-col items-center justify-center gap-4 rounded-sm border border-outline-variant/10 bg-surface-high p-8 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
          Converting {type} to PDF… This may take a minute.
        </p>
        {externalUrl && !unavailable ? externalLink : null}
      </div>
    );
  }

  if (!canPreview) {
    return (
      <div className="flex min-h-[min(70vh,720px)] flex-col items-center justify-center gap-4 rounded-sm border border-outline-variant/10 bg-surface-high p-8 text-center">
        <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
          {downloadOnly
            ? `${type} files open in your browser or download app. Use the link below to access this file on Cloudinary.`
            : unavailable
              ? 'This file is not stored in Cloudinary yet. Ask your instructor to upload it from Content Library.'
              : 'This resource is not ready for in-app PDF viewing yet.'}
        </p>
        {externalUrl && !unavailable ? externalLink : null}
      </div>
    );
  }

  return (
    <div className="flex min-h-[min(70vh,720px)] flex-col rounded-sm border border-outline-variant/10 bg-surface-high shadow-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/10 bg-surface-low/80 px-4 py-3 shrink-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant truncate max-w-[40%]">
          {title}
          {type !== 'PDF' ? ' · PDF preview' : ''}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pageNumber <= 1 || isDocumentLoading}
              onClick={() => goToPage(pageNumber - 1)}
              className="p-1.5 rounded-sm text-on-surface-variant hover:text-white hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-white min-w-[7rem] text-center">
              Page {numPages > 0 ? pageNumber : '—'} / {numPages > 0 ? numPages : '—'}
            </span>
            <button
              type="button"
              disabled={numPages === 0 || pageNumber >= numPages || isDocumentLoading}
              onClick={() => goToPage(pageNumber + 1)}
              className="p-1.5 rounded-sm text-on-surface-variant hover:text-white hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              disabled={numPages === 0 || isDocumentLoading}
              onChange={(e) => {
                const parsed = Number.parseInt(e.target.value, 10);
                if (!Number.isNaN(parsed)) goToPage(parsed);
              }}
              className="w-14 ml-1 px-2 py-1 rounded-sm bg-surface border border-outline-variant/20 text-[11px] font-mono text-white text-center"
              aria-label="Go to page"
            />
          </div>

          <div className="h-4 w-px bg-outline-variant/20 hidden sm:block" />

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={zoomIndex <= 0 || isDocumentLoading}
              onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
              className="p-1.5 rounded-sm text-on-surface-variant hover:text-white hover:bg-surface-high disabled:opacity-40"
              aria-label="Zoom out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-on-surface-variant min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              disabled={zoomIndex >= ZOOM_LEVELS.length - 1 || isDocumentLoading}
              onClick={() => setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
              className="p-1.5 rounded-sm text-on-surface-variant hover:text-white hover:bg-surface-high disabled:opacity-40"
              aria-label="Zoom in"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {externalUrl && !unavailable ? externalLink : null}
        </div>
      </div>

      <div ref={containerRef} className="relative flex-1 overflow-auto subtle-scrollbar bg-[#1a1a1a] p-4 min-h-0">
        {loadError ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 text-center px-6">
            <p className="text-error text-sm">{loadError}</p>
            {externalUrl && !unavailable ? externalLink : null}
          </div>
        ) : !documentFile ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-high/80">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {isDocumentLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-high/80">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            <div className="flex justify-center">
              <Document
                file={documentFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
              >
                {numPages > 0 ? (
                  <Page
                    key={`${resourceId}-${pageNumber}-${zoom}`}
                    pageNumber={pageNumber}
                    width={pageWidth}
                    renderTextLayer
                    renderAnnotationLayer
                    className="shadow-lg"
                  />
                ) : null}
              </Document>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
