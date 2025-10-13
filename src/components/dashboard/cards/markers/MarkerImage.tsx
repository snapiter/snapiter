"use client";

import Image from "next/image";
import { getMarkerUrlThumbnail } from "@/services/thumbnail";
import type { Marker } from "@/store/atoms";

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
  const src = getMarkerUrlThumbnail(marker, size);

  return (
    <Image
      src={src}
      alt={marker.title || "Marker image"}
      fill
      className={className}
    />
  );
}
