import { config } from '@/config';
import { Marker } from '@/store/atoms';

export function getMarkerUrlThumbnail(marker: Marker, size: string = '100x100'): string {
  return `${config.markerUrl}/api/trackables/${marker.trackableId}/markers/${marker.markerId}/thumbnail/${size}`;
}