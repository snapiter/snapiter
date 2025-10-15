"use client";

import { useAtomValue, useSetAtom } from "jotai";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { useSelectedTrip } from "@/hooks/trips/useSelectedTrip";
import { lightboxIndexAtom } from "@/store/atoms";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { getMarkerImage } from "@/services/thumbnail";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function GlobalLightbox() {
  const lightboxIndex = useAtomValue(lightboxIndexAtom);
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const { trip } = useSelectedTrip();

  if (trip === null) {
    return null;
  }

  // Derive photos from selectedTrip markers
  const photos =
    trip?.markers.map((marker) => (
      {
      src: getMarkerImage(marker),
      title: marker.title,
      description: marker.description,
      // srcSet: [
      //   {
      //     src: getMarkerUrlThumbnail(marker, "100x100"),
      //     width: 128,
      //     height: 128,
      //   },
      //   {
      //     src: getMarkerUrlThumbnail(marker, "500x500"),
      //     width: 256,
      //     height: 256,
      //   },
      //   {
      //     src: getMarkerUrlThumbnail(marker, "500x500"),
      //     width: 640,
      //     height: 640,
      //   },
      //   {
      //     src: getMarkerUrlThumbnail(marker, "1000x1000"),
      //     width: 1080,
      //     height: 1080,
      //   },
      //   {
      //     src: getMarkerImage(marker),
      //     width: 3840,
      //     height: 3840,
      //   },
      // ],
    }
  )) as Slide[] || [];

  const isOpen = lightboxIndex >= 0;
  const closeLightbox = () => {
    setLightboxIndex(-1);
  };

  return (
    <Lightbox
      plugins={[Captions, Fullscreen, Zoom]}
      open={isOpen}
      close={closeLightbox}
      slides={photos}
      index={Math.max(0, lightboxIndex)} // Ensure valid index
    />
  );
}
