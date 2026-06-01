import type { FileType } from '@unilearn/shared-types';

/** Return the stored Cloudinary URL unchanged — raw PDF delivery works when image PDF CDN is restricted. */
export function resolveCloudinaryViewerUrl(
  fileUrl: string,
  _type?: string,
): string {
  return fileUrl;
}

/** Google Docs embedded viewer for Office files (PPT/DOC) via public Cloudinary URL. */
export function buildGoogleDocsViewerUrl(fileUrl: string): string {
  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;
}

export function isOfficeFileType(type: FileType | string): boolean {
  return type === 'PPT' || type === 'DOC';
}

/** True when a delivery URL is served from Cloudinary. */
export function isCloudinaryDeliveryUrl(fileUrl: string): boolean {
  try {
    const host = new URL(fileUrl).hostname.toLowerCase();
    return host === 'res.cloudinary.com' || host.endsWith('.cloudinary.com');
  } catch {
    return false;
  }
}

export const PDFJS_DOCUMENT_OPTIONS = {
  withCredentials: false,
  disableRange: true,
  disableStream: true,
} as const;
