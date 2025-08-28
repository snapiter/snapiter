'use client';

import { useEffect } from 'react';
import { useWebsite } from '@/hooks/useApiData';

export default function DynamicTitle() {
  const { website } = useWebsite();

  useEffect(() => {
    if (website?.websiteTitle) {
      document.title = website.websiteTitle;
    }
  }, [website?.websiteTitle]);

  return null; // This component doesn't render anything
}