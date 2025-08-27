'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import Lightbox from 'yet-another-react-lightbox';
import { lightboxStateAtom } from '@/store/atoms';
import 'yet-another-react-lightbox/styles.css';

export default function GlobalLightbox() {
  const lightboxState = useAtomValue(lightboxStateAtom);
  const setLightboxState = useSetAtom(lightboxStateAtom);

  const closeLightbox = () => {
    setLightboxState({
      isOpen: false,
      photos: [],
      currentIndex: 0
    });
  };

  return (
    <Lightbox
      open={lightboxState.isOpen}
      close={closeLightbox}
      slides={lightboxState.photos}
      index={lightboxState.currentIndex}
    />
  );
}