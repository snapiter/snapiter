'use client';

import { useTrackableByHostname } from '@/hooks/trackable/useTrackableByHostname';
import { useEffect } from 'react';

export default function DynamicTitle() {
  const { data: trackable } = useTrackableByHostname();
  const title = trackable?.title;
  
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return null; // This component doesn't render anything
}