'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import type { ReactNode } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useAtomValue } from 'jotai';
import { bottomPanelExpandedAtom } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';
import { config } from '@/config';

interface BottomDrawerProps {
  children: ReactNode;
}

export default function BottomDrawer({ children }: BottomDrawerProps) {
  const isExpanded = useAtomValue(bottomPanelExpandedAtom);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const y = useMotionValue(0);
  const { runCommand } = useMapCommands();

  const panelRef = useOutsideClick<HTMLDivElement>(
    () => runCommand({ type: 'PANEL_COLLAPSE' }),
    isExpanded
  );

  useEffect(() => {
    setExpandedHeight(window.innerHeight * config.expandedHeightCalculation);
  }, []);

  const expandedY = 0;
  const collapsedY = expandedHeight - config.collapsedHeight;

  // Snap when atom changes
  useEffect(() => {
    if (!expandedHeight) return;
    animate(y, isExpanded ? expandedY : collapsedY, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  }, [isExpanded, expandedHeight, y]);

  if (!expandedHeight) return null;

  return (
    <motion.div
      ref={panelRef}
      style={{ height: expandedHeight, y }}
      className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl z-[102]"
      drag="y"
      dragConstraints={{ top: expandedY, bottom: collapsedY }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        const midpoint = (collapsedY - expandedY) / 2;
        let target: number;
      
        if (info.velocity.y < -500 || info.point.y < midpoint) {
          target = expandedY;
          runCommand({ type: 'PANEL_EXPAND' });
        } else {
          target = collapsedY;
          runCommand({ type: 'PANEL_COLLAPSE' });
        }
      
        animate(y, target, {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        });
      }}
      
    >
      {/* Handle */}
      <div
        className="flex items-center justify-between p-4 cursor-grab active:cursor-grabbing"
        onClick={() =>
          runCommand({ type: isExpanded ? 'PANEL_COLLAPSE' : 'PANEL_EXPAND' })
        }
        // 👇 prevent clicks inside handle from triggering scroll
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-border rounded-full mx-auto" />
      </div>

      {/* Content */}
      <div
        className="px-2 pb-4 h-full overflow-y-auto"
        // 👇 stop drag starting inside content
        onPointerDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  );
}
