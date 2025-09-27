'use client';

import { useTrackableByHostname } from '@/hooks/useTrackableByHostname';
import { useEffect } from 'react';

export default function DynamicTitle() {
  const { data: website } = useTrackableByHostname();
  const title = website?.title;
  
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return null; // This component doesn't render anything
}