'use client';

import { useState } from 'react';
import { ReactNode } from 'react';

interface SlidingPanelProps {
  children: ReactNode;
}

export default function SlidingPanel({ children }: SlidingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out z-50 ${
        isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-5rem)]'
      }`}
      style={{ height: isExpanded ? '80vh' : '5rem' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-1 bg-gray-300 rounded-full mx-auto"
        />
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="px-4 pb-4 h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}