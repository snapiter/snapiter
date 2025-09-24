"use client";

import Image from "next/image";
import { Marker } from "@/store/atoms";
import { getMarkerUrlThumbnail, getMarkerImage } from "@/services/thumbnail";

interface MarkerImageProps {
  marker: Marker;
  size?: string; // e.g. "500x500"
  className?: string;
}

export default function MarkerImage({
  marker,
  size = "500x500",
  className = "object-cover rounded",
}: MarkerImageProps) {
  const src = marker.hasThumbnail
    ? getMarkerUrlThumbnail(marker, size)
    : getMarkerImage(marker);

  return (
    <Image
      src={src}
      alt={marker.title || "Marker image"}
      fill
      className={className}
    />
  );
}
