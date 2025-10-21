import MapLibre from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

import { AttributionControl } from "maplibre-gl";
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useContext,
} from "react";
import type { MapLayerMouseEvent, MapRef, StyleSpecification } from "react-map-gl/maplibre";
import { EnvContext } from "@/utils/env/EnvProvider";

export type MapViewProps = {
  mapRef?: RefObject<MapRef>;
  onMapReady?: () => void;
  onMouseMove?: (event: MapLayerMouseEvent) => void;
  onClick?: (event: MapLayerMouseEvent) => void;
  interactiveLayerIds?: string[];
  children?: ReactNode;
  mapStyle?: CSSProperties;
};

export default function MapWrapper({
  mapRef,
  onMapReady,
  onMouseMove,
  onClick,
  interactiveLayerIds = [],
  children,
  mapStyle,
}: MapViewProps) {
  const env = useContext(EnvContext);

  const isBrowser = typeof window !== "undefined";
  const isRetina = isBrowser && window.devicePixelRatio > 1;
  
  const useMapTiler = !!env.SNAPITER_MAPTILER_KEY;
  
  const sourceId = useMapTiler ? "maptiler" : "osm";
  const tileUrl = useMapTiler
    ? `https://api.maptiler.com/maps/landscape/{z}/{x}/{y}${isRetina ? "@2x" : ""}.png?key=${env.SNAPITER_MAPTILER_KEY}`
    : "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png";
  
  const attribution = useMapTiler
    ? '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    : "&copy; OpenStreetMap Contributors";
  
  const style: StyleSpecification = {
    version: 8,
    sources: {
      [sourceId]: {
        type: "raster",
        tiles: [tileUrl],
        tileSize: 256,
        attribution,
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: sourceId,
        type: "raster",
        source: sourceId,
      },
    ],
  };

  return (
    <MapLibre
      ref={mapRef}
      initialViewState={{
        longitude: 5.1214201,
        latitude: 52.0907374,
        zoom: 12,
      }}
      mapStyle={style}
      attributionControl={false}
      onLoad={(e) => {
        onMapReady?.();
        const map = e.target;
        map.addControl(new AttributionControl({ compact: true }), "top-right");
      }}
      // attributionControl={{
      //   compact: true,
      // }}
      // onLoad={() => onMapReady?.()}
      onMouseMove={onMouseMove}
      onClick={onClick}
      interactiveLayerIds={interactiveLayerIds}
      style={mapStyle}
    >
      {children}
    </MapLibre>
  );
}
