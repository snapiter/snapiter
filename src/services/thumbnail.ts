import { config } from '@/config';

export function getMarkerUrlThumbnail(markerId: string, size: string = '100x100'): string {
  return `${config.markerUrl}/marker/${markerId}/thumbnail/${size}`;
}