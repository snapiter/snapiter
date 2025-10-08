import { config } from "@/config";
import { bottomPanelExpandedAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";


export function useResponsiveMapHeight(
    mapRef: React.RefObject<any>,
) {

    const isPanelExpanded = useAtomValue(bottomPanelExpandedAtom);

    const updateMapHeight = useCallback(() => {
        if (isPanelExpanded !== null && mapRef.current) {
            const map = mapRef.current.getMap?.();
            if (!map) return;

            const isMobile = window.innerWidth < 768;

            const container = map.getContainer();
            if (!container) return;

            if (isMobile) {
                container.style.height = isPanelExpanded
                    ? `${window.innerHeight * config.expandedHeightCalculation}px`
                    : `calc(100vh - ${config.collapsedHeight - config.panelDragBarHeight}px)`;
            } else {
                container.style.height = "100vh";
            }

            map.resize();
        }
    }, [isPanelExpanded, mapRef]);


  useEffect(() => {
    updateMapHeight();
  }, [updateMapHeight]);

  useEffect(() => {
    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, [updateMapHeight]);
}
