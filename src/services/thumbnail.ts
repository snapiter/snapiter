import { config } from "@/config";
import type { Marker } from "@/store/atoms";

export function getMarkerUrlThumbnail(
  marker: Marker,
  size: string = "200x200",
): string {
  if (!marker.hasThumbnail) {
    return getMarkerImage(marker);
  }
  return `${config.markerUrl}/api/trackables/${marker.trackableId}/markers/${marker.markerId}/thumbnail/${size}`;
}

export function getMarkerImage(marker: Marker): string {
  // return `${config.markerUrl}/api/trackables/${marker.trackableId}/markers/${marker.markerId}/image`;
  return getMarkerUrlThumbnail(marker, "2000x2000");
}

export function getTrackableIcon(trackableId: string): string {
  return `${config.markerUrl}/api/trackables/${trackableId}/icon`;
}
