'use client';

import { useState } from 'react';
import { motion, PanInfo } from 'motion/react';
import { ReactNode } from 'react';

interface SlidingPanelProps {
  children: ReactNode;
}

export default function SlidingPanel({ children }: SlidingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const collapsedHeight = 80; // 5rem in pixels
  const expandedHeight = window.innerHeight * 0.6; // 60vh
  const dragThreshold = 50;

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // If dragged up significantly or with upward velocity, expand
    if (offset.y < -dragThreshold || velocity.y < -500) {
      setIsExpanded(true);
    }
    // If dragged down significantly or with downward velocity, collapse
    else if (offset.y > dragThreshold || velocity.y > 500) {
      setIsExpanded(false);
    }
    // Otherwise snap back to current state
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50"
      style={{ height: isExpanded ? expandedHeight : collapsedHeight }}
      animate={{ 
        y: 0
      }}
      drag="y"
      dragConstraints={{ top: isExpanded ? -(expandedHeight - collapsedHeight) : 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-grab" />
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
      <div className="px-4 pb-4 h-full overflow-y-auto">
        {children}
      </div>
    </motion.div>
  );
}