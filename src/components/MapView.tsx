'use client';

import Map, { Source, Layer, type MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, type Trip, type TripDetailed, lightboxIndexAtom, mapEventsAtom, bottomPanelExpandedAtom, MapStyle } from '@/store/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRef, useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import type maplibregl from 'maplibre-gl';
import { createRouteData, fitMapBounds } from '@/utils/mapBounds';
import { useMapCommandHandler } from '@/hooks/useMapCommandHandler';
import { useMapCommands } from '@/hooks/useMapCommands';
import { fetchPositions, fetchTripMarkers } from '@/services/api';
import { cleanupMarkers } from '@/utils/mapMarkers';
import { stopAnimation } from '@/utils/mapAnimation';
import { animateTrip, type AnimationRefs } from '@/utils/tripAnimationHandler';

interface MapViewProps {
  trips?: Trip[];
  mapStyle: MapStyle;
  websiteIcon?: string;
}

export default function MapView({ trips = [], mapStyle, websiteIcon }: MapViewProps) {
  const selectedTrip = useAtomValue(selectedTripAtom);
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

  // Load complete TripDetailed for all trips in parallel
  const tripDetailedQueries = useQueries({
    queries: trips.map(trip => ({
      queryKey: ['tripDetailed', trip.vesselId, trip.slug],
      queryFn: async () => {
        const [positions, markers] = await Promise.all([
          fetchPositions(trip.vesselId, trip.slug),
          fetchTripMarkers(trip.vesselId, trip)
        ]);
        return { ...trip, positions, markers } as TripDetailed;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    })),
  });

  // Extract loaded TripDetailed objects
  const tripsWithPositions: TripDetailed[] = tripDetailedQueries
    .map(query => query.data)
    .filter((trip): trip is TripDetailed => trip !== undefined);

  // Function to animate trip directly
  const animateTripDirect = (tripWithPositions: typeof tripsWithPositions[0]) => {
    const refs: AnimationRefs = {
      animationRef,
      vehicleMarkerRef,
      startTimeRef,
      currentPositionIndexRef,
      visibleMarkersRef,
    };

    animateTrip(
      tripWithPositions,
      mapRef,
      refs,
      websiteIcon,
      (photoIndex: number) => setLightboxIndex(photoIndex),
      () => {
        console.log('Animation completed for trip:', tripWithPositions.slug);
        setMapEvents(prev => [...prev, { 
          type: 'ANIMATION_ENDED', 
          tripSlug: tripWithPositions.slug, 
          commandId: `animation-${Date.now()}` 
        }]);
      }
    );
  };

  useMapCommandHandler(mapRef, trips, websiteIcon);

  useEffect(() => {
    const lastEvent = mapEvents[mapEvents.length - 1];
    if (!lastEvent) return;

    if(lastEvent.type === 'TRIP_SELECTED') {
      const tripWithPositions = tripsWithPositions.find(t => t.slug === lastEvent.tripSlug);
      if (tripWithPositions && tripWithPositions.positions.length > 0) {
        animateTripDirect(tripWithPositions);
      }
    }
    else if (lastEvent.type === 'TRIP_HOVERED') {
      if(lastEvent.fitBounds) {
        runCommand({
          type: 'FIT_BOUNDS',
          tripSlug: lastEvent.tripSlug,
          duration: 500
        });
      }
    } else if (lastEvent.type === 'TRIP_BLURRED') {
      setHoveredTrip(null);
    }
    else if(lastEvent.type === 'MARKER_HIGHLIGHTED') {
      const marker = selectedTrip?.markers.filter(i => i.markerId == lastEvent.markerId).pop()
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
        runCommand({ type: 'HOVER_TRIP', tripSlug, fitBounds: false });
      }
    } else {
      if (hoveredTrip !== null) {
        setHoveredTrip(null);
        runCommand({ type: 'BLUR_TRIP' });
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
        interactiveLayerIds={tripsWithPositions.map(trip => `route-line-${trip.slug}`)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
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
