import { useAtom, useAtomValue } from "jotai";
import React from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { config } from "@/config";
import { bottomPanelExpandedAtom, BottomPanelState, dragEnabledAtom } from "@/store/atoms";

export default function BottomDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bottomPanelExpanded, setBottomPanelExpanded] = useAtom(bottomPanelExpandedAtom);

  const dragEnabled = useAtomValue(dragEnabledAtom);

  const sheetRef = React.useRef<SheetRef>(null);
  const snapIndices = [0, config.collapsedHeight, config.expandedHeight, 1];

  const expandedSnapIndex = 2;
  const collapsedSnapIndex = 1;
  const fullScreenSnapIndex = 3;

  React.useEffect(() => {
    if (!sheetRef.current) return;

    if(!dragEnabled) {
      sheetRef.current.snapTo(collapsedSnapIndex);
      return;
    }

    if (bottomPanelExpanded === BottomPanelState.Open) {
      sheetRef.current.snapTo(expandedSnapIndex);
    } else if (bottomPanelExpanded === BottomPanelState.Fullscreen) {
      sheetRef.current.snapTo(fullScreenSnapIndex);
    } else {
      sheetRef.current.snapTo(collapsedSnapIndex);
    }
  }, [dragEnabled, bottomPanelExpanded]);

  return (
    <Sheet
      ref={sheetRef}
      isOpen={true}
      disableDrag={!dragEnabled}
      onClose={() => {
      }}
      onSnap={(index) => {
        if (index === expandedSnapIndex) {
          setBottomPanelExpanded(BottomPanelState.Open);
        }
        if (index === collapsedSnapIndex) {
          setBottomPanelExpanded(BottomPanelState.Closed);
        }
        if (index === fullScreenSnapIndex) {
          setBottomPanelExpanded(BottomPanelState.Fullscreen);
        }
      }}
      className="md:hidden"
      snapPoints={snapIndices}
      initialSnap={collapsedSnapIndex}
      disableDismiss={true}
    >
      <Sheet.Container
        style={{
          zIndex: 102,
          backgroundColor: "transparent",
          borderRadius: "100px",
        }}
        className="bg-background rounded-t-3xl"
      >
        <Sheet.Header className={`bg-background rounded-t-3xl py-2  border-b border-border ${dragEnabled ? "cursor-grab" : ""}`}>
          <div className="flex justify-center py-2">
            <div className={`w-10 h-1 rounded-full bg-foreground ${!dragEnabled ? "opacity-0" : ""}`} />
          </div>
        </Sheet.Header>
        <Sheet.Content className="bg-background" disableDrag={true}>
          <div className="min-h-full">{children}</div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
