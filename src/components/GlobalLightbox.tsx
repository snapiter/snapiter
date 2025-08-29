'use client';

import { useAtomValue } from 'jotai';
import Lightbox from 'yet-another-react-lightbox';
import { lightboxIndexAtom, selectedTripAtom } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';
import 'yet-another-react-lightbox/styles.css';

export default function GlobalLightbox() {
  const lightboxIndex = useAtomValue(lightboxIndexAtom);
  const { runCommand } = useMapCommands();
  const selectedTrip = useAtomValue(selectedTripAtom);


  // Derive photos from selected trip
  const photos = selectedTrip?.markers
    .filter(marker => marker.hasThumbnail)
    .map(marker => ({
      src: `https://cache.partypieps.nl/marker/${marker.markerId}`,
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