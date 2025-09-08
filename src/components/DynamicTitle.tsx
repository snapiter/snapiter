'use client';

import { useEffect } from 'react';

interface DynamicTitleProps {
  title?: string;
}

export default function DynamicTitle({ title }: DynamicTitleProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return null; // This component doesn't render anything
}