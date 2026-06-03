import { useEffect, useMemo, useRef, useState } from 'react';
import type { FileType, ResourceStatus } from '@unilearn/shared-types';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Minus, Plus } from 'lucide-react';
import { CourseAPI } from '@/api/course';
import { isPdfPreviewPending, isDownloadOnlyResource, isUnavailableResource, shouldAttemptPdfPreview } from '@/lib/resourceStatus';
import {
  buildGoogleDocsViewerUrl,
  isOfficeFileType,
  resolveCloudinaryViewerUrl,
} from '@/lib/cloudinaryViewer';

const ZOOM_LEVELS = [0.75, 1, 1.25, 1.5] as const;

type ResourcePdfViewerProps = {
  resourceId: string;
  fileUrl: string;
  title: string;
  type: FileType;
  status?: ResourceStatus;
  initialPage?: number;
};

export function ResourcePdfViewer(props: ResourcePdfViewerProps) {
  const mountKey = `${props.resourceId}:${props.fileUrl}:${props.type}`;
  return <ResourcePdfViewerInner key={mountKey} {...props} />;
}

function ResourcePdfViewerInner({
  resourceId,
  fileUrl,
  title,
  type,
  status,
}: ResourcePdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const zoom = ZOOM_LEVELS[zoomIndex] ?? 1;
  const externalUrl = resolveCloudinaryViewerUrl(String(fileUrl));
  const previewPending = isPdfPreviewPending({ type, status });
  const canPreview = shouldAttemptPdfPreview({ type, status, fileUrl });
  const downloadOnly = isDownloadOnlyResource({ type, fileUrl });
  const unavailable = isUnavailableResource({ fileUrl });
  const officeFile = isOfficeFileType(type);

  useEffect(() => {
    if (!canPreview || previewPending) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    void (async () => {
      try {
        if (type === 'PDF') {
          const buffer = await CourseAPI.fetchResourceFile(resourceId);
          if (cancelled) return;
          objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'application/pdf' }));
          setIframeSrc(objectUrl);
        } else {
          const deliveryUrl = resolveCloudinaryViewerUrl(String(fileUrl));
          setIframeSrc(buildGoogleDocsViewerUrl(deliveryUrl));
        }
        if (!cancelled) {
          setLoadError(null);
        }
      } catch (err) {
        if (cancelled) return;
        setIframeSrc(null);
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'Could not load this document. Try opening it in a new tab.';
        setLoadError(message);
        setIsDocumentLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resourceId, canPreview, previewPending, type, fileUrl]);

  const handleIframeLoad = () => {
    setLoadError(null);
    setIsDocumentLoading(false);
  };

  const handleIframeError = () => {
    setLoadError(
      officeFile
        ? 'Could not preview this file in the viewer. Try opening it in a new tab.'
        : 'Could not load this PDF in the viewer. Try opening it in a new tab.',
    );
    setIsDocumentLoading(false);
  };

  const iframeStyle = useMemo(
    () => ({
      transform: `scale(${zoom})`,
      transformOrigin: 'top center' as const,
      width: `${100 / zoom}%`,
      height: `${100 / zoom}%`,
    }),
    [zoom],
  );

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
              : 'This resource is not ready for in-app viewing yet.'}
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
          {officeFile ? ' · Document preview' : ''}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="p-1.5 rounded-sm text-on-surface-variant hover:text-white hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-white min-w-[7rem] text-center">
              {officeFile ? 'Scroll in viewer' : 'PDF preview'}
            </span>
            <button
              type="button"
              disabled
              className="p-1.5 rounded-sm text-on-surface-variant hover:text-white hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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

      <div ref={containerRef} className="relative flex-1 overflow-auto subtle-scrollbar bg-[#1a1a1a] min-h-0">
        {loadError ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 text-center px-6 py-8">
            <p className="text-error text-sm">{loadError}</p>
            {externalUrl && !unavailable ? externalLink : null}
          </div>
        ) : !iframeSrc ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-high/80 min-h-[16rem]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {isDocumentLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-high/80">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            <div className="flex justify-center w-full min-h-[min(60vh,720px)] p-2">
              <iframe
                key={`${resourceId}-${iframeSrc}`}
                title={title}
                src={iframeSrc}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="w-full min-h-[min(60vh,720px)] border-0 bg-white"
                style={iframeStyle}
                allow="fullscreen"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
