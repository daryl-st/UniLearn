/** Return the stored Cloudinary URL unchanged — raw PDF delivery works when image PDF CDN is restricted. */
export function resolveCloudinaryViewerUrl(
  fileUrl: string,
  _type?: string,
): string {
  return fileUrl;
}

export const PDFJS_DOCUMENT_OPTIONS = {
  withCredentials: false,
  disableRange: true,
  disableStream: true,
} as const;
