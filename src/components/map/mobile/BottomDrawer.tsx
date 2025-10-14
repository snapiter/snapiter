import { useAtom } from "jotai";
import React from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { config } from "@/config";
import { bottomPanelExpandedAtom, BottomPanelState } from "@/store/atoms";

export default function BottomDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bottomPanelExpanded, setBottomPanelExpanded] = useAtom(bottomPanelExpandedAtom);

  const sheetRef = React.useRef<SheetRef>(null);
  const snapIndices = [0, config.collapsedHeight, config.expandedHeight, 1];

  const expandedSnapIndex = 2;
  const collapsedSnapIndex = 1;
  const fullScreenSnapIndex = 3;

  React.useEffect(() => {
    if (!sheetRef.current) return;

    if (bottomPanelExpanded === BottomPanelState.Open || bottomPanelExpanded === BottomPanelState.Fullscreen) {
      sheetRef.current.snapTo(expandedSnapIndex);
    } else {
      sheetRef.current.snapTo(collapsedSnapIndex);
    }
  }, [bottomPanelExpanded]);

  return (
    <Sheet
      ref={sheetRef}
      isOpen={true}
      onClose={() => {
        sheetRef.current?.snapTo(collapsedSnapIndex); // Force to stay on collapsed snap
        setBottomPanelExpanded(BottomPanelState.Closed);
      }}
      onSnap={(index) => {
        if (index === expandedSnapIndex && !bottomPanelExpanded) {
          setBottomPanelExpanded(BottomPanelState.Open);
        }
        if (index === collapsedSnapIndex && bottomPanelExpanded) {
          setBottomPanelExpanded(BottomPanelState.Closed);
        }
        if (index === fullScreenSnapIndex) {
          setBottomPanelExpanded(BottomPanelState.Open);
        }
      }}
      className="md:hidden"
      snapPoints={snapIndices}
      initialSnap={collapsedSnapIndex}
    >
      <Sheet.Container
        style={{
          zIndex: 102,
          backgroundColor: "transparent",
          borderRadius: "100px",
        }}
        className="bg-background rounded-t-3xl"
      >
        <Sheet.Header className="bg-background rounded-t-3xl py-2 cursor-grab border-b border-border">
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 rounded-full bg-foreground" />
          </div>
        </Sheet.Header>
        <Sheet.Content className="bg-background" disableDrag={true}>
          <div className="p-2">{children}</div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
