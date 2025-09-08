'use client';

import { useAtomValue } from 'jotai';
import Lightbox from 'yet-another-react-lightbox';
import { lightboxIndexAtom, selectedTripAtom } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useMarkers } from '@/hooks/useMarkers';
import { config } from '@/config';
import 'yet-another-react-lightbox/styles.css';

export default function GlobalLightbox() {
  const lightboxIndex = useAtomValue(lightboxIndexAtom);
  const { runCommand } = useMapCommands();
  const selectedTrip = useAtomValue(selectedTripAtom);
  
  // Fetch markers on-demand for selected trip
  const { data: markers } = useMarkers(selectedTrip?.vesselId || null, selectedTrip);

  // Derive photos from fetched markers
  const photos = markers
    ?.filter(marker => marker.hasThumbnail)
    .map(marker => ({
      src: `${config.cacheApiUrl}/marker/${marker.markerId}`,
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