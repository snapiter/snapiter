'use client';

import { Website } from '@/store/atoms';
import Image from 'next/image';

interface SnapIterLoaderProps {
  website: Website | null;
}

export default function SnapIterLoader({website}: SnapIterLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      <div className="bg-surface rounded-2xl p-12 shadow-lg border border-border flex flex-col items-center">
        {/* Main Logo */}
        <div className="mb-8 flex items-center gap-4">
          <Image 
            src="/logo.svg" 
            alt="SnapIter" 
            width={64} 
            height={64}
            className="flex-shrink-0"
          />
          {website?.websiteTitle && (
            <h1 className="text-4xl font-bold text-foreground">
              {website.websiteTitle}
            </h1>
          )}
        </div>

        {/* Animated Journey Route */}
        <div className="relative w-80 h-32 mb-8">
          <svg viewBox="0 0 320 128" className="w-full h-full">
            {/* Hidden Path for Animation */}
            <defs>
              <path
                id="route-path"
                d="M20,100 Q80,20 160,60 Q240,100 300,40"
              />
            </defs>
            
            {/* Visible Route Path */}
            <path
              d="M20,100 Q80,20 160,60 Q240,100 300,40"
              stroke="var(--primary)"
              strokeWidth="3"
              fill="none"
              className="animate-route-draw"
              strokeDasharray="400"
              strokeDashoffset="400"
            />

            {/* Moving Vehicle - follows the front of the drawing line */}
            <circle r="6" fill="var(--warning)" opacity="0.9" className="animate-vehicle-follow" />
            
            {/* Journey Points - appear after the line is drawn */}
            <g className="animate-points-appear" style={{ animationDelay: '1s' }}>
              {/* Start Point */}
              <circle cx="20" cy="100" r="6" fill="var(--success)" className="animate-pulse" />
              
              {/* Photo Points */}
              <circle cx="80" cy="40" r="4" fill="var(--primary)" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <circle cx="160" cy="60" r="4" fill="var(--primary)" className="animate-pulse" style={{ animationDelay: '2s' }} />
              <circle cx="240" cy="80" r="4" fill="var(--primary)" className="animate-pulse" style={{ animationDelay: '3s' }} />
              
              {/* End Point */}
              <circle cx="300" cy="40" r="6" fill="var(--success)" className="animate-pulse" style={{ animationDelay: '4s' }} />
            </g>
          </svg>

          {/* Floating Photos */}
          <div className="absolute inset-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${20 + i * 80}px`,
                  top: `${20 + (i % 2) * 40}px`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '2s'
                }}
              >
                {/* Polaroid Photo Frame */}
                <div className="w-10 h-12 bg-background shadow-md border border-border rounded-sm p-1">
                  {/* Photo Content */}
                  <div className="w-full h-7 bg-gradient-to-br from-primary to-primary-light rounded-sm mb-1 relative overflow-hidden">
                    {/* Photo details/texture */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-2 h-1 bg-white/40 rounded"></div>
                  </div>
                  {/* Photo Caption Area */}
                  <div className="h-2 bg-background rounded-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}