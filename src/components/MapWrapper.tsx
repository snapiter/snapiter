"use client";

import Map from 'react-map-gl/maplibre';

import type { CSSProperties, ReactNode, RefObject } from "react";
import type { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";

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
  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 5.1214201,
        latitude: 52.0907374,
        zoom: 12,
      }}
      mapStyle={`https://api.maptiler.com/maps/landscape/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      attributionControl={{
        compact: true,
      }}
      onLoad={() => onMapReady?.()}
      onMouseMove={onMouseMove}
      onClick={onClick}
      interactiveLayerIds={interactiveLayerIds}
      style={mapStyle}
    >
      {children}
    </Map>
  );
}
