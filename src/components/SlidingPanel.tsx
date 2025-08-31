'use client';

import { useState, useEffect } from 'react';
import { motion, type PanInfo, useDragControls } from 'framer-motion';
import type { ReactNode } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useAtomValue } from 'jotai';
import { bottomPanelExpandedAtom } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';

interface SlidingPanelProps {
  children: ReactNode;
}

export default function SlidingPanel({ children }: SlidingPanelProps) {
  const isExpanded = useAtomValue(bottomPanelExpandedAtom);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const dragControls = useDragControls();
  const { runCommand } = useMapCommands();
  
  const panelRef = useOutsideClick<HTMLDivElement>(
    () => runCommand({ type: 'PANEL_COLLAPSE' }),
    isExpanded
  );

  useEffect(() => {
    setExpandedHeight(window.innerHeight * 0.6);
  }, []);

  const collapsedHeight = 80;
  const expandedY = 0;
  const collapsedY = expandedHeight - collapsedHeight;

  if (!expandedHeight) return null; // wait until measured

  return (
    <motion.div
      ref={panelRef}
      style={{ height: expandedHeight }} // FIX: set explicit height
      className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl z-[102]"
      animate={{ y: isExpanded ? expandedY : collapsedY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: expandedY, bottom: collapsedY }}
      dragElastic={0.2}
      onDragEnd={(_, info: PanInfo) => {
        if (info.velocity.y < -500) {
          runCommand({ type: 'PANEL_EXPAND' });
        } else if (info.velocity.y > 500) {
          runCommand({ type: 'PANEL_COLLAPSE' });
        }
      }}
    >
      <div
        className="flex items-center justify-between p-4 border-b border-border cursor-grab"
        onPointerDown={(e) => dragControls.start(e)}
        onClick={() => runCommand({ type: isExpanded ? 'PANEL_COLLAPSE' : 'PANEL_EXPAND' })}
      >
        <motion.div
          className="w-12 h-1 bg-border rounded-full mx-auto"
          whileTap={{ scale: 1.2 }}
        />
      </div>

      <div className="px-4 pb-4 h-full overflow-y-auto">{children}</div>
    </motion.div>
  );
}
