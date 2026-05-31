import type { ResourceStatus } from '@unilearn/shared-types';
import { isCloudinaryDeliveryUrl } from '@/lib/cloudinaryViewer';

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

export function shouldAttemptPdfPreview(resource: {
  type: string;
  status?: ResourceStatus;
  fileUrl?: string;
}): boolean {
  if (isPdfPreviewPending(resource)) return false;
  if (resource.status === 'FAILED') return false;

  const url = resource.fileUrl ?? '';

  if (resource.type === 'PDF') {
    return isCloudinaryDeliveryUrl(url);
  }

  // Converted Office files (Aspose) are delivered as image/pdf URLs.
  return isCloudinaryDeliveryUrl(url) && url.includes('/image/upload/');
}

export function isDownloadOnlyResource(resource: {
  type: string;
  fileUrl?: string;
}): boolean {
  if (resource.type === 'PDF') return false;
  return isCloudinaryDeliveryUrl(resource.fileUrl ?? '');
}

export function isUnavailableResource(resource: { fileUrl?: string }): boolean {
  const url = resource.fileUrl ?? '';
  return !url || (!isCloudinaryDeliveryUrl(url) && !url.startsWith('local://'));
}
