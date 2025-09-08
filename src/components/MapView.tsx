'use client';

import Map, { Source, Layer, type MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { type Trip, type TripDetailed, lightboxIndexAtom, mapEventsAtom, bottomPanelExpandedAtom, MapStyle } from '@/store/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRef, useState, useEffect } from 'react';
import type maplibregl from 'maplibre-gl';
import { createRouteData } from '@/utils/mapBounds';
import { useMapCommandHandler } from '@/hooks/useMapCommandHandler';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useTripPositions } from '@/hooks/useTrip';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import { cleanupMarkers } from '@/utils/mapMarkers';
import { stopAnimation } from '@/utils/mapAnimation';
import { animateTrip, type AnimationRefs } from '@/utils/tripAnimationHandler';

interface MapViewProps {
  trips?: Trip[];
  mapStyle: MapStyle;
  websiteIcon?: string;
}

export default function MapView({ trips = [], mapStyle, websiteIcon }: MapViewProps) {
  const selectedTrip = useSelectedTrip();
  
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

  const detailedTrips = useTripPositions(trips);

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
      websiteIcon,
      (photoIndex: number) => setLightboxIndex(photoIndex),
      () => {
        console.log('Animation completed for trip:', trip.slug);
        setMapEvents(prev => [...prev, { 
          type: 'ANIMATION_ENDED', 
          tripSlug: trip.slug, 
          commandId: `animation-${Date.now()}` 
        }]);
      }
    );
  };


  useEffect(() => {
    if (selectedTrip) {
      const tripWithPositions = detailedTrips.find(t => t.slug === selectedTrip.slug);
      if (tripWithPositions && tripWithPositions.positions.length > 0) {
        animateTripDirect({
          ...tripWithPositions,
          markers: selectedTrip.markers
        });
      }
    }
  }, [selectedTrip]);


  useMapCommandHandler(mapRef, trips);

  useEffect(() => {
    const lastEvent = mapEvents[mapEvents.length - 1];
    if (!lastEvent) return;

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
  }, [mapEvents]);

  // Cleanup effect for animation state
  useEffect(() => {
    return () => {
      stopAnimation(animationRef);
      cleanupMarkers(visibleMarkersRef, vehicleMarkerRef);
      startTimeRef.current = null;
    };
  }, []);

  // Dynamic height for mobile, full height for desktop
    useEffect(() => {
      if(mapRef) {


        const map = mapRef.current?.getMap();
        if(!map) return;

        const container = map.getContainer();
        container.style.height = isPanelExpanded
          ? "calc(40vh + 36px)"
          : "calc(100vh - 36px)";

        map.resize();
        isPanelExpanded ? "calc(40vh + 36px)" : "calc(100vh - 80px)";
      
      }
  }, [isPanelExpanded])


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
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 5.1214201, latitude: 52.0907374, zoom: 12 }}
        mapStyle={`https://api.maptiler.com/maps/${mapStyle.valueOf()}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        attributionControl={{
          compact: true,
        }}
        onLoad={() => {
          runCommand({ type: 'MAP_READY' });
        }}
        interactiveLayerIds={detailedTrips.map(trip => `route-line-${trip.slug}`)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {detailedTrips.map(trip => {
          if (trip.positions.length < 2) return null;
          const color = trip.color || '#3b82f6';
          const isSelected = trip.slug === selectedTrip?.slug;
          const isHovered = trip.slug === hoveredTrip;
          const coordinates = trip.positions.toReversed().map(p => [p.longitude, p.latitude]);
          if (coordinates.length < 2) return null;
          const routeData = createRouteData(trip.positions, isSelected);
          return (
            <Source key={trip.slug} id={`route-${trip.slug}`} type="geojson" data={routeData}>
              <Layer
                id={`route-line-${trip.slug}`}
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }} paint={{
                  'line-width': isHovered ? 6 : 4, // thicker on hover
                  'line-color': color,
                  'line-opacity': (isSelected || isHovered) ? 1 : 0.3,
                }}
              />
            </Source>
          );
        })}
      </Map>
  );
}
