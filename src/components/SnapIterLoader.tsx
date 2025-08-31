'use client';

import { useState, useEffect } from 'react';
import { Website } from '@/store/atoms';
import Image from 'next/image';

interface SnapIterLoaderProps {
  website: Website | null;
}

export default function SnapIterLoader({ website }: SnapIterLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (website?.websiteTitle) {
      const timer = setTimeout(() => setLoaded(true), 500); // small delay
      return () => clearTimeout(timer);
    }
  }, [website?.websiteTitle]);

  return (
    <div className="fixed inset-0 dark:bg-black bg-white flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl p-8 shadow-lg border border-border flex flex-col items-center gap-6 w-full max-w-sm relative">
        {/* Animated Container */}
        <div className="w-full flex items-center justify-center relative h-20">
          {/* Logo */}
          <div
            className={`transition-all duration-700 ease-out ${
              loaded
                ? 'w-12 h-12 -translate-x-24'
                : 'w-24 h-24'
            }`}
          >
            <Image
              src="/logo.svg"
              alt="SnapIter"
              width={loaded ? 48 : 96}
              height={loaded ? 48 : 96}
              className="block"
            />
          </div>

          {/* Website Title */}
          {website?.websiteTitle && (
            <h1
              className={`absolute transition-all duration-700 ease-out text-2xl font-bold text-foreground ${
                loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              {website.websiteTitle}
            </h1>
          )}
        </div>

        {/* Progress Bar — only show while not loaded */}
        {!loaded && (
          <div className="w-full bg-background rounded-full h-2 overflow-hidden mt-4">
            <div className="h-2 bg-primary rounded-full animate-loading" />
          </div>
        )}
      </div>
    </div>
  );
}
