import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { config } from "@/config";
import { bottomPanelExpandedAtom } from "@/store/atoms";

export default function BottomDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const isExpanded = useAtomValue(bottomPanelExpandedAtom);
  const setBottomPanelExpanded = useSetAtom(bottomPanelExpandedAtom);
  const sheetRef = React.useRef<SheetRef>(null);
  const snapIndices = [0, config.collapsedHeight, config.expandedHeight, 1];

  const expandedSnapIndex = 2;
  const collapsedSnapIndex = 1;
  const fullScreenSnapIndex = 3;

  React.useEffect(() => {
    if (!sheetRef.current) return;

    if (isExpanded) {
      sheetRef.current.snapTo(expandedSnapIndex);
    } else {
      sheetRef.current.snapTo(collapsedSnapIndex);
    }
  }, [isExpanded]);

  return (
    <Sheet
      ref={sheetRef}
      isOpen={true}
      onClose={() => {
        setBottomPanelExpanded(false);
      }}
      onSnap={(index) => {
        if (index === expandedSnapIndex && !isExpanded) {
          setBottomPanelExpanded(true);
        }
        if (index === collapsedSnapIndex && isExpanded) {
          setBottomPanelExpanded(false);
        }
        if (index === fullScreenSnapIndex) {
          setBottomPanelExpanded(true);
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
