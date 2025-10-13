import { atom, useAtomValue, useSetAtom } from "jotai";
import { Fragment, type RefObject, useMemo, useRef } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { useAutoFlyToMarker } from "@/hooks/map/useAutoFlyToMarker";
import { useResponsiveMapHeight } from "@/hooks/map/useResponsiveMapHeight";
import { useTripAnimation } from "@/hooks/map/useTripAnimation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { mapReadyAtom, selectedTripAtom, type Trip } from "@/store/atoms";
import AnimatedTripLayer from "./AnimatedTripLayer";
import MapWrapper from "./MapWrapper";
import TripLayer from "./TripLayer";

interface MapViewProps {
  trips?: Trip[];
}

function MobileMapView({
  trips,
  mapRef,
}: {
  trips: Trip[];
  mapRef: React.RefObject<MapRef | null>;
}) {
  const selectedTripSlug = useAtomValue(selectedTripAtom);

  useTripAnimation(mapRef);
  useAutoFlyToMarker(mapRef);

  const visibleTrips = useMemo(() => {
    return trips.filter((trip) => trip.slug === selectedTripSlug);
  }, [trips, selectedTripSlug]);

  return (
    <>
      {visibleTrips.map((trip) => (
        <Fragment key={trip.slug}>
          <TripLayer trip={trip} />
          <AnimatedTripLayer trip={trip} />
        </Fragment>
      ))}
    </>
  );
}

function DesktopMapView({
  trips,
  mapRef,
}: {
  trips: Trip[];
  mapRef: React.RefObject<MapRef | null>;
}) {
  useTripAnimation(mapRef);
  useAutoFlyToMarker(mapRef);

  return (
    <>
      {trips.map((trip) => (
        <Fragment key={trip.slug}>
          <TripLayer trip={trip} />
          <AnimatedTripLayer trip={trip} />
        </Fragment>
      ))}
    </>
  );
}

export default function MapView({ trips = [] }: MapViewProps) {
  const setMapReady = useSetAtom(mapReadyAtom);
  const isMobile = useIsMobile();

  const mapRef = useRef<MapRef | null>(null);

  const interactiveLayerIds = useMemo(
    () => trips.map((trip) => `route-line-${trip.slug}`),
    [trips],
  );

  useResponsiveMapHeight(mapRef);
  return (
    <MapWrapper
      mapRef={mapRef as RefObject<MapRef>}
      onMapReady={() => setMapReady(true)}
      interactiveLayerIds={interactiveLayerIds}
      mapStyle={{ height: "100%" }}
    >
      {isMobile ? (
        <MobileMapView trips={trips} mapRef={mapRef} />
      ) : (
        <DesktopMapView trips={trips} mapRef={mapRef} />
      )}
    </MapWrapper>
  );
}
