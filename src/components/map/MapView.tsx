import { type MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TripWithMarkers } from '@/store/atoms';
import { useRef, useState, RefObject, Fragment } from 'react';
import { useMapCommandHandler } from '@/hooks/useMapCommandHandler';
import { useMapCommands } from '@/hooks/useMapCommands';
import { useTripsWithPositions } from '@/hooks/useTripsWithPositions';
import { useSelectedTrip } from '@/hooks/useSelectedTrip';
import MapWrapper from './MapWrapper';
import { useResponsiveMapHeight } from '@/hooks/map/useResponsiveMapHeight';
import { useAutoFlyToMarker } from '@/hooks/map/useAutoFlyToMarker';
import { useTripAnimation } from '@/hooks/map/useTripAnimation';
import TripLayer from './TripLayer';
import AnimatedTripLayer from './AnimatedTripLayer';

interface MapViewProps {
  trips?: TripWithMarkers[];
}

export default function MapView({ trips = [] }: MapViewProps) {
  const { trip: selectedTrip } = useSelectedTrip();

  const { runCommand } = useMapCommands();
  const [hoveredTrip, setHoveredTrip] = useState<string | null>(null);

  const mapRef = useRef<MapRef | null>(null);

  const { data: tripsWithPositions = [] } = useTripsWithPositions(trips);

  useTripAnimation(mapRef, trips);

  useMapCommandHandler(mapRef, trips);

  useAutoFlyToMarker(mapRef, trips);

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
      interactiveLayerIds={tripsWithPositions.map(trip => `route-line-${trip.slug}`)}
      mapStyle={{
        height: "100%",
      }}
    >
      {tripsWithPositions.map(trip => (
        <Fragment key={trip.slug}>
          <TripLayer
            key={trip.slug}
            trip={trip}
            selectedTripSlug={selectedTrip?.slug}
            hoveredTripSlug={hoveredTrip}
          />
          <AnimatedTripLayer
            trip={trip}
          />
        </Fragment>
      ))}
    </MapWrapper>
  );
}
