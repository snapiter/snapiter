'use client';

import { useState } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface SlidingPanelProps {
  children: ReactNode;
}

export default function SlidingPanel({ children }: SlidingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Heights in pixels
  const collapsedHeight = 80;
  const expandedHeight = window.innerHeight * 0.6; // 60vh

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50"
      initial={{ y: collapsedHeight }}
      animate={{ y: isExpanded ? 0 : expandedHeight - collapsedHeight }}
      drag="y"
      dragConstraints={{ top: 0, bottom: expandedHeight - collapsedHeight }}
      dragElastic={0.2}
      onDragEnd={(_, info: PanInfo) => {
        // If user drags more than 50px up, expand
        if (info.offset.y < -50) setIsExpanded(true);
        else if (info.offset.y > 50) setIsExpanded(false);
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer">
        <motion.div
          className="w-12 h-1 bg-gray-300 rounded-full mx-auto"
          whileTap={{ scale: 1.2 }}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      <div className="px-4 pb-4 h-full overflow-y-auto">{children}</div>
    </motion.div>
  );
}
