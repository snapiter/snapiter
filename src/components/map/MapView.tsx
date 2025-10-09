import { type MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Trip } from '@/store/atoms';
import { useRef, useState, RefObject, Fragment } from 'react';
import { useMapCommandHandler } from '@/hooks/commands/useMapCommandHandler';
import { useMapCommands } from '@/hooks/commands/useMapCommands';
import { useSelectedTrip } from '@/hooks/trips/useSelectedTrip';
import MapWrapper from './MapWrapper';
import { useResponsiveMapHeight } from '@/hooks/map/useResponsiveMapHeight';
import { useAutoFlyToMarker } from '@/hooks/map/useAutoFlyToMarker';
import { useTripAnimation } from '@/hooks/map/useTripAnimation';
import TripLayer from './TripLayer';
import AnimatedTripLayer from './AnimatedTripLayer';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MapViewProps {
  trips?: Trip[];
}

export default function MapView({ trips = [] }: MapViewProps) {
  const { trip: selectedTrip } = useSelectedTrip();

  const { runCommand } = useMapCommands();
  const [hoveredTrip, setHoveredTrip] = useState<string | null>(null);
  
  const isMobile = useIsMobile();

  const mapRef = useRef<MapRef | null>(null);

  useTripAnimation(mapRef);


  useMapCommandHandler(mapRef);

  useAutoFlyToMarker(mapRef);

  useResponsiveMapHeight(mapRef)


  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    // Mouse over on route line
    if (feature && feature.layer.id.startsWith('route-line-')) {
      const tripSlug = feature.layer.id.replace('route-line-', '');
      if (hoveredTrip !== tripSlug && selectedTrip?.slug !== tripSlug) {
        addCursorPointer();
        setHoveredTrip(tripSlug);
      }
    } else {
      // Mouse leave on route line
      removeCursorPointer();
    }
  };

  const handleClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature && feature.layer.id.startsWith('route-line-')) {
      const clickedSlug = feature.layer.id.replace('route-line-', '');
      // Weird HACK, but otherwise if you click a marker it will reselect the already selected trip.
      if (clickedSlug == selectedTrip?.slug) {
        return;
      }
      removeCursorPointer();
      runCommand({
        type: 'SELECT_TRIP',
        tripSlug: clickedSlug
      });
    }
  };

  const addCursorPointer = () => {
    mapRef.current?.getCanvas().style.setProperty('cursor', 'pointer');
  };

  const removeCursorPointer = () => {
    setHoveredTrip(null);

    mapRef.current?.getCanvas().style.removeProperty('cursor');
  };

  return (
    <MapWrapper
      mapRef={mapRef as RefObject<MapRef>}
      onMapReady={() => {
        runCommand({ type: 'MAP_READY' });
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      interactiveLayerIds={trips.map(trip => `route-line-${trip.slug}`)}
      mapStyle={{
        height: "100%",
      }}
    >
      {trips
      .filter(trip => isMobile ? trip.slug === selectedTrip?.slug : true)
      .map(trip => (
        <Fragment key={trip.slug}>
          <TripLayer
            key={trip.slug}
            trip={trip}
            selectedTripSlug={selectedTrip?.slug}
            hoveredTripSlug={hoveredTrip ?? undefined}
          />
          <AnimatedTripLayer
            trip={trip}
          />
        </Fragment>
      ))}
    </MapWrapper>
  );
}
