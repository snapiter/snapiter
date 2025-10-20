"use client"

import { useContext } from "react";
import { EnvContext } from "@/utils/env/EnvProvider";
import type { Marker } from "@/store/atoms";

function getMarkerUrlThumbnailInternal(
  markerUrl: string,
  marker: Marker,
  size: string = "200x200",
): string {
  if (!marker.hasThumbnail) {
    return getMarkerImageInternal(markerUrl, marker);
  }
  return `${markerUrl}/api/trackables/${marker.trackableId}/markers/${marker.markerId}/thumbnail/${size}`;
}

function getMarkerImageInternal(markerUrl: string, marker: Marker): string {
  // return `${markerUrl}/api/trackables/${marker.trackableId}/markers/${marker.markerId}/image`;
  return getMarkerUrlThumbnailInternal(markerUrl, marker, "2000x2000");
}

function getTrackableIconInternal(markerUrl: string, trackableId: string): string {
  return `${markerUrl}/api/trackables/${trackableId}/icon`;
}

export function useMarkerUrls() {
  const env = useContext(EnvContext);
  return {
    getMarkerUrlThumbnail: (marker: Marker, size?: string) => getMarkerUrlThumbnailInternal(env.SNAPITER_MARKER_URL, marker, size),
    getMarkerImage: (marker: Marker) => getMarkerImageInternal(env.SNAPITER_MARKER_URL, marker),
    getTrackableIcon: (trackableId: string) => getTrackableIconInternal(env.SNAPITER_MARKER_URL, trackableId),
  };
}
