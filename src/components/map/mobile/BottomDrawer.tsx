'use client';

import React from 'react';
import { useAtomValue } from 'jotai';
import { bottomPanelExpandedAtom } from '@/store/atoms';
import { useMapCommands } from '@/hooks/useMapCommands';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { config } from '@/config';

export default function BottomDrawer({ children }: { children: React.ReactNode }) {
  const isExpanded = useAtomValue(bottomPanelExpandedAtom);
  const { runCommand } = useMapCommands();
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<SheetRef>(null);

  const snapIndices = [0, config.collapsedHeight, config.expandedHeightCalculation, 1];
  
  const expandedSnapIndex = 2;
  const collapsedSnapIndex = 1;
  const fullScreenSnapIndex = 3;

  React.useEffect(() => {
    setMounted(true);
    if (!ref.current) return;
    if (isExpanded) {
      ref.current.snapTo(expandedSnapIndex);
    } else {
      ref.current.snapTo(collapsedSnapIndex);
    }

  }, [ref.current, isExpanded]);

  if (!mounted) return null; // 🚀 prevent SSR mismatch

  return (
    <Sheet
      ref={ref}
      isOpen={true}
      onClose={() => runCommand({ type: 'PANEL_COLLAPSE' })}
      onSnap={(index) => {
        if (index === expandedSnapIndex && !isExpanded) {
          runCommand({ type: 'PANEL_EXPAND' });
        }
        if(index === collapsedSnapIndex && isExpanded) {
          runCommand({ type: 'PANEL_COLLAPSE' });
        }
        if(index === fullScreenSnapIndex) {
          runCommand({ type: 'PANEL_EXPAND' });
        }
      }}
      className="md:hidden"
      snapPoints={snapIndices}
      initialSnap={0}
      
    >
      <Sheet.Container style={{ zIndex: 102, backgroundColor: 'transparent', borderRadius: '100px' }} className="bg-background rounded-t-3xl">
        <Sheet.Header className="bg-background rounded-t-3xl py-2 cursor-grab border-b border-border">
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 rounded-full bg-white" />
          </div>
        </Sheet.Header>
        <Sheet.Content className="bg-background"
         disableDrag={true}
        >
          <div className="p-2">{children}</div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
