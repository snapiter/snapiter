"use client";

import { type RefObject, use, useEffect, useRef, useState } from "react";
import { Layer, type MapRef, Marker, Source } from "react-map-gl/maplibre";
import Card from "@/components/dashboard/cards/Card";
import MarkersCard from "@/components/dashboard/cards/markers/MarkersCard";
import ActiveTripCard from "@/components/dashboard/cards/trips/ActiveTripCard";
import EditTripCard from "@/components/dashboard/cards/trips/EditTripCard";
import StackCard from "@/components/dashboard/layout/StackCard";
import MapWrapper from "@/components/map/MapWrapper";
import { useTrip } from "@/hooks/trips/useTrip";
import { useTripMarkers } from "@/hooks/trips/useTripMarkers";
import { useTripPositions } from "@/hooks/trips/useTripPositions";
import { createRouteData, fitMapBounds } from "@/utils/mapBounds";

export default function TripsPage({
  params,
}: {
  params: Promise<{ trackableId: string; tripId: string }>;
}) {
  const { trackableId, tripId } = use(params);
  const { data: trip, isLoading, isError } = useTrip(trackableId, tripId);
  const { data: positions = [] } = useTripPositions(trackableId, tripId);
  const { data: markers = [] } = useTripMarkers(trackableId, tripId);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (mapReady && mapRef.current && positions.length > 1) {
      fitMapBounds(mapRef, positions);
    }
  }, [positions, mapRef.current, mapReady]);

  if (isLoading || isError || !trip) return <></>;

  return (
    <>
      <StackCard columns={1}>
        <ActiveTripCard trip={trip} key={trip.slug} />
        <EditTripCard trackableId={trackableId} trip={trip} />
      </StackCard>
      <StackCard columns={markers.length > 0 ? 2 : 1}>
        <MarkersCard markers={markers} />
        <Card title="Map">
          <MapWrapper
            onMapReady={() => {
              setMapReady(true);
            }}
            mapRef={mapRef as RefObject<MapRef>}
            mapStyle={{ height: "400px" }}
          >
            {(() => {
              if (!trip || positions.length < 2) return null;

              const color = trip.color || "#3b82f6";

              const coordinates = positions
                .toReversed()
                .map((p) => [p.longitude, p.latitude]);

              if (coordinates.length < 2) return null;

              const routeData = createRouteData(positions);

              return (
                <Source
                  id={`route-${trip.slug}`}
                  type="geojson"
                  data={routeData}
                >
                  <Layer
                    id={`route-line-${trip.slug}`}
                    type="line"
                    layout={{ "line-cap": "round", "line-join": "round" }}
                    paint={{
                      "line-width": 4, // thicker on hover
                      "line-color": color,
                      "line-opacity": 1,
                    }}
                  />
                </Source>
              );
            })()}
          </MapWrapper>
        </Card>
      </StackCard>
    </>
  );
}
