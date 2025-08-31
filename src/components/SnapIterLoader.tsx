'use client';

import { useState, useEffect } from 'react';
import { Website } from '@/store/atoms';
import Image from 'next/image';

interface SnapIterLoaderProps {
  website: Website | null;
}

export default function SnapIterLoader({ website }: SnapIterLoaderProps) {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    if (website?.websiteTitle) {
      const timer = setTimeout(() => setShowTitle(true), 200); // small delay
      return () => clearTimeout(timer);
    }
  }, [website?.websiteTitle]);

  return (
    <div className="fixed inset-0 dark:bg-black bg-white flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl p-8 shadow-lg border border-border flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="SnapIter"
          width={64}
          height={64}
          className="mb-2"
        />

        {/* Container that keeps height consistent */}
        <div className="w-full h-8 relative flex items-center justify-center">
          {/* Progress Bar — fades out */}
          <div
            className={`w-full bg-background rounded-full h-2 overflow-hidden transition-opacity duration-500 ${
              showTitle ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="h-2 bg-primary rounded-full animate-loading" />
          </div>

          {/* Website Title — slides in horizontally */}
          {website?.websiteTitle && (
            <h1
              className={`absolute text-2xl font-bold text-foreground text-center transition-all duration-500 ease-out ${
                showTitle ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              {website.websiteTitle}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
