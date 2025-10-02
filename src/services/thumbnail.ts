import { config } from '@/config';
import { Marker } from '@/store/atoms';

export function getMarkerUrlThumbnail(marker: Marker, size: string = '100x100'): string {
  if(!marker.hasThumbnail) {
    return getMarkerImage(marker);
  }
  return `${config.markerUrl}/api/trackables/${marker.trackableId}/markers/${marker.markerId}/thumbnail/${size}`;
}


export function getMarkerImage(marker: Marker): string {
  return `${config.markerUrl}/api/trackables/${marker.trackableId}/markers/${marker.markerId}/image`;
}

export function getTrackableIcon(trackableId: string): string {
  return `${config.markerUrl}/api/trackables/${trackableId}/icon`;
}