'use client';

import Map, { Source, Layer, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedTripAtom, type Trip } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { useAtomCallback } from 'jotai/utils';

interface MapViewProps {
  className?: string;
  trips?: Trip[];
}

export default function MapView({ className, trips = [] }: MapViewProps) {
  const selectedTrip = useAtomValue(selectedTripAtom);
  const mapRef = useRef<MapRef | null>(null);
  const animationRef = useRef<number | null>(null);
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentPositionIndexRef = useRef<number>(0);
  const visibleMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const activePositions = selectedTrip?.positions.toReversed() ?? [];

  const getVisibleMarkers = () => {
    if (!selectedTrip || currentPositionIndexRef.current < 0 || currentPositionIndexRef.current >= activePositions.length) return [];
    const currentPosition = activePositions[currentPositionIndexRef.current];
    const currentTime = new Date(currentPosition.createdAt).getTime();
    return selectedTrip.markers.filter(marker => new Date(marker.createdAt).getTime() <= currentTime);
  };

  const initializeTripMarkers = () => {
    if (!selectedTrip || !mapRef.current) return;
    selectedTrip.markers.forEach(marker => {
      if (!visibleMarkersRef.current[marker.id]) {
        const el = document.createElement('div');
        el.className = 'w-6 h-6'; // 24px x 24px
      
        el.innerHTML = `
          <img 
            src="https://cache.partypieps.nl/marker/${marker.markerId}/thumbnail/500x500" 
            class="w-6 h-6 rounded-full border-2 border-white object-cover"
            alt="marker"
          />
        `;
      
        visibleMarkersRef.current[marker.id] = new maplibregl.Marker({ element: el })
          .setLngLat([marker.longitude, marker.latitude]);
      }
      
    });
  };

  const initializeVehicleMarker = () => {
    if (!selectedTrip || !mapRef.current || activePositions.length === 0) return;
    const map = mapRef.current.getMap();
    if (!vehicleMarkerRef.current) {
      const el = document.createElement('div');
      el.style.width = '32px';
      el.style.height = '32px';
      el.innerHTML = `<img src="/assets/icons/van-passenger.svg" style="width: 100%; height: 100%;" />`;
      vehicleMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([activePositions[0].longitude, activePositions[0].latitude])
        .addTo(map);
    } else {
      vehicleMarkerRef.current.setLngLat([activePositions[0].longitude, activePositions[0].latitude]);
    }
  };

  const updateMarkersOnMap = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    getVisibleMarkers().forEach(marker => {
      const m = visibleMarkersRef.current[marker.id];
      if (!m.getElement().parentNode) m.addTo(map);
    });
  };

  const fitBounds = () => {
    if (!mapRef.current || activePositions.length === 0) return;
    const lats = activePositions.map(p => p.latitude);
    const lngs = activePositions.map(p => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    mapRef.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40, duration: 1000 });

    const map = mapRef.current.getMap();
    const startAnimation = () => {
      animationRef.current = requestAnimationFrame(animate);
      map.off('moveend', startAnimation);
    };
    map.on('moveend', startAnimation);
  };

  const animate = () => {
    if (!mapRef.current || !selectedTrip || activePositions.length < 2) return;

    const map = mapRef.current.getMap();
    const duration = selectedTrip.animationSpeed ?? 5000;
    if (startTimeRef.current === null) startTimeRef.current = Date.now();

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const currentIndex = Math.floor(progress * (activePositions.length - 1));
    currentPositionIndexRef.current = currentIndex;

    if (currentIndex < activePositions.length) {
      const progressCoordinates = activePositions.slice(0, currentIndex + 1)
        .map(p => [p.longitude, p.latitude]);
      const source = map.getSource(`route-${selectedTrip.slug}`) as any;
      if (source) source.setData({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: progressCoordinates } }] });

      if (vehicleMarkerRef.current) {
        const pos = activePositions[currentIndex];
        vehicleMarkerRef.current.setLngLat([pos.longitude, pos.latitude]);
      }

      updateMarkersOnMap();
    }

    if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    else {
      animationRef.current = null;
      startTimeRef.current = null;
    }
  };
  
  useEffect(() => {
    // if (!mapRef.current || !selectedTrip || activePositions.length < 2) return;

    if(!selectedTrip || !isMapLoaded) { 
      return;
    }

    console.log("BOINK" + mapRef.current)

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    startTimeRef.current = null;
    currentPositionIndexRef.current = 0;


    initializeTripMarkers();
    initializeVehicleMarker();
    fitBounds();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      Object.values(visibleMarkersRef.current).forEach(m => m.remove());
      visibleMarkersRef.current = {};
      if (vehicleMarkerRef.current) vehicleMarkerRef.current.remove();
      vehicleMarkerRef.current = null;
      startTimeRef.current = null;
    };
  }, [selectedTrip, isMapLoaded]);

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 5.1214201, latitude: 52.0907374, zoom: 12 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
        attributionControl
        onLoad={() => setIsMapLoaded(true)}
      >
        {trips.map(trip => {
          if (trip.positions.length < 2) return null;
          const color = trip.color || '#3b82f6';
          const isSelected = trip.slug === selectedTrip?.slug;
          const coordinates = trip.positions.toReversed().map(p => [p.longitude, p.latitude]);
          if (coordinates.length < 2) return null;
          const routeData = {
            type: 'FeatureCollection' as const,
            features: [{ type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates: isSelected ? [] : coordinates } }],
          };
          return (
            <Source key={trip.slug} id={`route-${trip.slug}`} type="geojson" data={routeData}>
              <Layer
                id={`route-line-${trip.slug}`}
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{ 'line-width': 4, 'line-color': color, 'line-opacity': isSelected ? 1 : 0.3 }}
              />
            </Source>
          );
        })}
      </Map>
    </div>
  );
}
