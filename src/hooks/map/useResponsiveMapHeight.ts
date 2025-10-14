import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { config } from "@/config";
import { bottomPanelExpandedAtom, BottomPanelState } from "@/store/atoms";

export function useResponsiveMapHeight(mapRef: React.RefObject<any>) {
  const bottomPanelExpanded = useAtomValue(bottomPanelExpandedAtom);

  const updateMapHeight = useCallback(() => {
    console.log("updateMapHeight", bottomPanelExpanded);
    if (bottomPanelExpanded !== null && mapRef.current) {
      const map = mapRef.current.getMap?.();
      if (!map) return;

      const isMobile = window.innerWidth < 768;

      const container = map.getContainer();
      if (!container) return;

      const isPanelExpanded = bottomPanelExpanded === BottomPanelState.Open || bottomPanelExpanded === BottomPanelState.Fullscreen;

      if (isMobile) {
        container.style.height = isPanelExpanded
          ? `calc(100vh - ${config.expandedHeight - config.panelDragBarHeight}px)`
          : `calc(100vh - ${config.collapsedHeight - config.panelDragBarHeight}px)`;
      } else {
        container.style.height = "100vh";
      }
      map.resize();
    }
  }, [bottomPanelExpanded, mapRef]);

  useEffect(() => {
    updateMapHeight();
  }, [updateMapHeight]);

  useEffect(() => {
    if (!mapRef.current) return;
    updateMapHeight();
  }, [mapRef.current]);

  useEffect(() => {
    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, [updateMapHeight]);
}
