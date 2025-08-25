'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ReactNode } from 'react';

interface SlidingPanelProps {
  children: ReactNode;
}

export default function SlidingPanel({ children }: SlidingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);

  // handle SSR (window not defined)
  useEffect(() => {
    setExpandedHeight(window.innerHeight * 0.6);
  }, []);

  const collapsedHeight = 80;
  const collapsedY = expandedHeight - collapsedHeight;
  const expandedY = 0;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50"
      initial={{ y: collapsedY }}
      animate={{ y: isExpanded ? expandedY : collapsedY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      drag="y"
      dragConstraints={{ top: expandedY, bottom: collapsedY }}
      dragElastic={0.2}
      onDragEnd={(_, info: PanInfo) => {
        // Only respond to predominantly vertical gestures
        const absOffsetX = Math.abs(info.offset.x);
        const absOffsetY = Math.abs(info.offset.y);
        
        // If horizontal movement is greater than vertical, ignore the drag
        if (absOffsetX > absOffsetY) {
          return;
        }
        
        // If drag was quick or passed halfway, expand/collapse
        if (info.offset.y < -50 || info.velocity.y < -500) {
          setIsExpanded(true);
        } else if (info.offset.y > 50 || info.velocity.y > 500) {
          setIsExpanded(false);
        } else {
          // Snap to closest state
          const middle = collapsedY / 2;
          setIsExpanded(info.point.y < middle);
        }
      }}
    >
      {/* Handle bar */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.div
          className="w-12 h-1 bg-gray-300 rounded-full mx-auto"
          whileTap={{ scale: 1.2 }}
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 h-full overflow-y-auto">{children}</div>
    </motion.div>
  );
}
