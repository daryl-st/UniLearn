/** Return the stored Cloudinary URL unchanged — raw PDF delivery works when image PDF CDN is restricted. */
export function resolveCloudinaryViewerUrl(
  fileUrl: string,
  _type?: string,
): string {
  return fileUrl;
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
