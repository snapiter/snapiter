'use client';

import { Website } from '@/store/atoms';
import Image from 'next/image';

interface SnapIterLoaderProps {
  website: Website | null;
}

export default function SnapIterLoader({ website }: SnapIterLoaderProps) {
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

        {/* Website Title */}
        {website?.websiteTitle && (
          <h1 className="text-2xl font-bold text-foreground text-center">
            {website.websiteTitle}
          </h1>
        )}

        {/* Animated Progress Bar */}
        <div className="w-full bg-background rounded-full h-2 overflow-hidden mt-4">
          <div className="h-2 bg-primary rounded-full animate-loading" />
        </div>
      </div>
    </div>
  );
}
