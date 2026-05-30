import type { ResourceStatus } from '@unilearn/shared-types';

export function resourceStatusLabel(status?: ResourceStatus): string {
  switch (status) {
    case 'QUEUED':
      return 'Queued';
    case 'PROCESSING':
      return 'Processing';
    case 'READY':
      return 'Ready';
    case 'FAILED':
      return 'Failed';
    default:
      return 'Unknown';
  }
}

export function resourceStatusClass(status?: ResourceStatus): string {
  switch (status) {
    case 'READY':
      return 'bg-secondary/15 text-secondary border-secondary/25';
    case 'PROCESSING':
    case 'QUEUED':
      return 'bg-primary/15 text-primary border-primary/25';
    case 'FAILED':
      return 'bg-error/15 text-error border-error/25';
    default:
      return 'bg-surface-highest text-outline';
  }
}

export function isPdfPreviewPending(resource: { type: string; status?: ResourceStatus }): boolean {
  return resource.status === 'PROCESSING' && resource.type !== 'PDF';
}

export function shouldAttemptPdfPreview(resource: { type: string; status?: ResourceStatus; fileUrl?: string }): boolean {
  if (isPdfPreviewPending(resource)) return false;
  if (resource.status === 'FAILED' && resource.type !== 'PDF') {
    const url = resource.fileUrl ?? '';
    const isCloudinaryPdf =
      url.includes('/raw/upload/') || url.includes('/image/upload/');
    if (!isCloudinaryPdf) return false;
  }
  return true;
}
