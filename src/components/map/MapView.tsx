import { type MapRef } from 'react-map-gl/maplibre';
import { Trip, mapReadyAtom, selectedTripAtom } from '@/store/atoms';
import { useRef, RefObject, Fragment, useMemo } from 'react';
import MapWrapper from './MapWrapper';
import { useResponsiveMapHeight } from '@/hooks/map/useResponsiveMapHeight';
import { useAutoFlyToMarker } from '@/hooks/map/useAutoFlyToMarker';
import { useTripAnimation } from '@/hooks/map/useTripAnimation';
import TripLayer from './TripLayer';
import AnimatedTripLayer from './AnimatedTripLayer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSetAtom, useAtomValue } from 'jotai';

interface MapViewProps {
  trips?: Trip[];
}

export default function MapView({ trips = [] }: MapViewProps) {
  const selectedTripSlug = useAtomValue(selectedTripAtom);
  const setMapReady = useSetAtom(mapReadyAtom);
  const isMobile = useIsMobile();

  const mapRef = useRef<MapRef | null>(null);

  const visibleTrips = useMemo(() => {
    return trips.filter((trip) => (isMobile ? trip.slug === selectedTripSlug : true));
  }, [trips, isMobile, selectedTripSlug]);

  const interactiveLayerIds = useMemo(() =>
    trips.map((trip) => `route-line-${trip.slug}`),
    [trips]
  );

  useTripAnimation(mapRef);
  useAutoFlyToMarker(mapRef);
  useResponsiveMapHeight(mapRef);


  return (
    <MapWrapper
      mapRef={mapRef as RefObject<MapRef>}
      onMapReady={() => setMapReady(true)}
      interactiveLayerIds={interactiveLayerIds}
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
