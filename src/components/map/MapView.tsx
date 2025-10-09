import { type MapRef } from 'react-map-gl/maplibre';
import { Trip } from '@/store/atoms';
import { useRef, RefObject, Fragment, useMemo } from 'react';
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
  const isMobile = useIsMobile();

  const mapRef = useRef<MapRef | null>(null);

  const visibleTrips = useMemo(() => {
    return trips.filter((trip) => (isMobile ? trip.slug === selectedTrip?.slug : true));
  }, [trips, isMobile, selectedTrip?.slug]);
  
  // Map-related hooks
  useTripAnimation(mapRef);
  useMapCommandHandler(mapRef);
  useAutoFlyToMarker(mapRef);
  useResponsiveMapHeight(mapRef);

  console.log('visibleTrips', visibleTrips);

  return (
    <MapWrapper
      mapRef={mapRef as RefObject<MapRef>}
      onMapReady={() => runCommand({ type: 'MAP_READY' })}
      interactiveLayerIds={trips.map((trip) => `route-line-${trip.slug}`)}
      mapStyle={{ height: '100%' }}
    >
      {visibleTrips.map((trip) => (
          <Fragment key={trip.slug}>
            <TripLayer
              trip={trip}
            />
            <AnimatedTripLayer trip={trip} />
          </Fragment>
        ))}
    </MapWrapper>
  );
}
