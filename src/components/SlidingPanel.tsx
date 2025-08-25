'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo, useDragControls } from 'framer-motion';
import { ReactNode } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface SlidingPanelProps {
  children: ReactNode;
}

export default function SlidingPanel({ children }: SlidingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const dragControls = useDragControls();
  
  const panelRef = useOutsideClick<HTMLDivElement>(
    () => setIsExpanded(false),
    isExpanded
  );

  // handle SSR (window not defined)
  useEffect(() => {
    setExpandedHeight(window.innerHeight * 0.6);
  }, []);

  const collapsedHeight = 80;
  const collapsedY = expandedHeight - collapsedHeight;
  const expandedY = 0;

  return (
    <motion.div
      ref={panelRef}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50"
      initial={{ y: collapsedY }}
      animate={{ y: isExpanded ? expandedY : collapsedY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      drag="y"
      dragControls={dragControls}
      dragListener={false} // prevents whole panel from being draggable
      dragConstraints={{ top: expandedY, bottom: collapsedY }}
      dragElastic={0.2}
      onDragEnd={(_, info: PanInfo) => {
        if (info.velocity.y < -500) {
          setIsExpanded(true);
        } else if (info.velocity.y > 500) {
          setIsExpanded(false);
        }
      }}
    >
      {/* Handle bar */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-grab"
        onPointerDown={(e) => dragControls.start(e)} // only this starts dragging
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.div
          className="w-12 h-1 bg-gray-300 rounded-full mx-auto"
          whileTap={{ scale: 1.2 }}
        />
      </div>

      <div className="px-4 pb-4 h-full overflow-y-auto">{children}</div>
    </motion.div>
  );
}
