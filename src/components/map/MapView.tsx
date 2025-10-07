'use client';

import { Source, Layer, type MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { type Trip, type TripDetailed, lightboxIndexAtom, mapEventsAtom, bottomPanelExpandedAtom, MapStyle, TripWithMarkers } from '@/store/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRef, useState, useEffect, RefObject } from 'react';
import type maplibregl from 'maplibre-gl';
import { createRouteData, fitMapBounds } from '@/utils/mapBounds';
import { useMapCommandHandler } from '@/hooks/useMapCommandHandler';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useTripsWithPositions } from '@/hooks/useTripsWithPositions';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import { animateTrip, type AnimationRefs } from '@/utils/tripAnimationHandler';
import { config } from '@/config';
import MapWrapper from './MapWrapper';
import { useTrackableByHostname } from '@/hooks/useTrackableByHostname';

interface MapViewProps {
  trips?: TripWithMarkers[];
}

export default function MapView({ trips = [] }: MapViewProps) {
  const { trip: selectedTrip } = useSelectedTrip();
  const { data: website } = useTrackableByHostname();

  const { runCommand } = useMapCommands();
  const [hoveredTrip, setHoveredTrip] = useState<string | null>(null);
  const isPanelExpanded = useAtomValue(bottomPanelExpandedAtom);
  const setLightboxIndex = useSetAtom(lightboxIndexAtom);
  const [mapEvents, setMapEvents] = useAtom(mapEventsAtom);

  const mapRef = useRef<MapRef | null>(null);
  
  // Animation state refs
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});

  const { data: tripsWithPositions = [] } = useTripsWithPositions(trips);


  const animateTripDirect = (trip: TripDetailed) => {
    const refs: AnimationRefs = {
      animationRef,
      vehicleMarkerRef,
      startTimeRef,
      currentPositionIndexRef,
      visibleMarkersRef,
    };

    animateTrip(
      trip,
      mapRef,
      refs,
      website!!.trackableId,
      (photoIndex: number) => setLightboxIndex(photoIndex),
      () => {
        setMapEvents(prev => [...prev, { 
          type: 'ANIMATION_ENDED', 
          tripSlug: trip.slug, 
          commandId: `animation-${Date.now()}` 
        }]);
      }
    );
  };


  useEffect(() => {
    console.log("RENDER" + tripsWithPositions.length);
    if (selectedTrip && tripsWithPositions.length > 0) {
      const tripWithPositions = tripsWithPositions.find(t => t.slug === selectedTrip.slug);

      if (tripWithPositions && tripWithPositions.positions.length > 0) {
        animateTripDirect({
          ...tripWithPositions,
          markers: selectedTrip.markers
        });
      }
    }
  }, [selectedTrip, tripsWithPositions]);


  useMapCommandHandler(mapRef, trips);

  useEffect(() => {
    const lastEvent = mapEvents[mapEvents.length - 1];
    if (!lastEvent) return;

    // If the marker is highlighted, fly to the marker
    if(lastEvent.type === 'MARKER_HIGHLIGHTED') {
      const marker = selectedTrip?.markers?.filter(i => i.markerId == lastEvent.markerId).pop()
      if(marker) {
        runCommand({
          type: 'FLY_TO',
          coordinates: [marker.longitude, marker.latitude],
          zoom: 8,
          duration: 1500
        });
      }
    }

    // If the marker is left, fit the map bounds to the trip
    if(lastEvent.type === 'MARKER_HIGHLIGHTED_LEAVE') {
      const trip = tripsWithPositions.find(t => t.slug == selectedTrip?.slug);
      
      if(trip) {
        fitMapBounds(mapRef, trip?.positions);
      }
    }
  }, [mapEvents]);

  // Dynamic height for mobile, full height for desktop
  useEffect(() => {
    if (isPanelExpanded !== null && mapRef.current) {
      const map = mapRef.current?.getMap();
      if (!map) return;
  
      const isMobile = window.innerWidth < 768; // adjust breakpoint if needed
  
      if (isMobile) {
        map.getContainer().style.height = isPanelExpanded
          ? window.innerHeight * config.expandedHeightCalculation + "px"
          : "calc(100vh - " + (config.collapsedHeight - config.panelDragBarHeight) + "px)";
        
        map.resize();
      } else {
        // Desktop: full height
        map.getContainer().style.height = "100vh";
        map.resize();
      }
    }
  }, [isPanelExpanded, mapRef.current]);
  

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature && feature.layer.id.startsWith('route-line-')) {
      const tripSlug = feature.layer.id.replace('route-line-', '');
      if (hoveredTrip !== tripSlug && selectedTrip?.slug !== tripSlug) {
        mapRef.current?.getCanvas().style.setProperty('cursor', 'pointer');
        setHoveredTrip(tripSlug);
      }
    } else {
      if (hoveredTrip !== null) {
        setHoveredTrip(null);
      }
      mapRef.current?.getCanvas().style.removeProperty('cursor');
    }
  };

  const handleClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature && feature.layer.id.startsWith('route-line-')) {
      const clickedSlug = feature.layer.id.replace('route-line-', '');
      // Weird HACK, but otherwise if you click a marker it will reselect the already selected trip.
      if(clickedSlug == selectedTrip?.slug) {
        return;
      }
      setHoveredTrip(null);
      mapRef.current?.getCanvas().style.removeProperty('cursor');
      runCommand({
        type: 'SELECT_TRIP',
        tripSlug: clickedSlug
      });
    }
  };
  
  return (
      <MapWrapper
        mapRef={mapRef as RefObject<MapRef>}
        onMapReady={() => {
          runCommand({ type: 'MAP_READY' });
        }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        interactiveLayerIds={tripsWithPositions.map(trip => `route-line-${trip.slug}`)}
        mapStyle={{
          height: "100%",
        }}
      >
        {tripsWithPositions.map(trip => {
          if (trip.positions.length < 2) return null;
          const color = trip.color || '#3b82f6';
          const isSelected = trip.slug === selectedTrip?.slug;
          const isHovered = trip.slug === hoveredTrip;
          const coordinates = trip.positions.toReversed().map(p => [p.longitude, p.latitude]);
          if (coordinates.length < 2) return null;
          const routeData = createRouteData(trip.positions, isSelected);
          return (
            <div key={trip.slug}>
              {/* Base route layer - hidden when selected */}
              <Source id={`route-${trip.slug}`} type="geojson" data={routeData}>
                <Layer
                  id={`route-line-${trip.slug}`}
                  type="line"
                  layout={{ 'line-cap': 'round', 'line-join': 'round' }} paint={{
                    'line-width': isHovered ? 6 : 4, // thicker on hover
                    'line-color': color,
                    'line-opacity': isSelected ? 0 : (isHovered ? 1 : 0.3),
                  }}
                />
              </Source>
              
              {/* Animation layer - only for selected trip */}
              {isSelected && (
                <Source id={`route-${trip.slug}-animation`} type="geojson" data={{
                  type: 'FeatureCollection',
                  features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: []
                    }
                  }]
                }}>
                  <Layer
                    id={`route-line-${trip.slug}-animation`}
                    type="line"
                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                    paint={{
                      'line-width': 4,
                      'line-color': color,
                      'line-opacity': 1,
                    }}
                  />
                </Source>
              )}
            </div>
          );
        })}
      </MapWrapper>
  );
}
