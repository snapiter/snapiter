'use client';

import { useAtomValue } from 'jotai';
import Lightbox from 'yet-another-react-lightbox';
import { lightboxIndexAtom } from '@/store/atoms';
import { useMapCommands } from '@/hooks/commands/useMapCommands';
import { useSelectedTrip } from '@/hooks/trips/useSelectedTrip';
import 'yet-another-react-lightbox/styles.css';
import { getMarkerImage } from '@/services/thumbnail';

export default function GlobalLightbox() {
  const lightboxIndex = useAtomValue(lightboxIndexAtom);
  const { runCommand } = useMapCommands();
  const { trip } = useSelectedTrip();

  if(trip === null) {
    return <></>;
  }

  // Derive photos from selectedTrip markers
  const photos = trip?.markers
      .map(marker => ({
      src: getMarkerImage(marker),
      alt: marker.title || 'Marker photo',
      title: marker.description
    })) || [];

  const isOpen = lightboxIndex >= 0;
  const closeLightbox = () => {
    runCommand({ type: 'LIGHTBOX_CLOSE' });
  };

  return (
    <Lightbox
      open={isOpen}
      close={closeLightbox}
      slides={photos}
      index={Math.max(0, lightboxIndex)} // Ensure valid index
    />
  );
}