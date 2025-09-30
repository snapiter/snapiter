"use client";

import { RefObject, use, useEffect, useRef, useState } from "react";
import { useTripWithPosition } from "@/hooks/useTripWithPosition";
import Card from "@/components/dashboard/cards/Card";
import StackCard from "@/components/dashboard/layout/StackCard";
import { Layer, MapRef, Marker, Source } from "react-map-gl/maplibre";
import MapWrapper from "@/components/map/MapWrapper";
import { createRouteData, fitMapBounds } from "@/utils/mapBounds";
import { formatTripDate } from "@/utils/formatTripDate";
import { useMarkers } from "@/hooks/useMarkers";
import MarkersCard from "@/components/dashboard/cards/markers/MarkersCard";
import ActiveTripCard from "@/components/dashboard/cards/trips/ActiveTripCard";
import EditTripCard from "@/components/dashboard/cards/trips/EditTripCard";

export default function TripsPage({
  params,
}: {
  params: Promise<{ trackableId: string; tripId: string }>;
}) {
  const { trackableId, tripId } = use(params);
  const { data: trip, isLoading, isError } = useTripWithPosition(
    trackableId,
    tripId
  );
  const { data: markers } = useMarkers(trip ?? null);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<MapRef | null>(null);


  useEffect(() => {
    if (mapReady && mapRef.current && trip && trip?.positions && trip.positions.length > 1) {
      fitMapBounds(mapRef, trip.positions);
    }
  }, [trip?.positions, mapRef.current, mapReady]);


  if (isLoading || isError || !trip) return <></>;

  return (
    <>
    <StackCard columns={1}>
      <ActiveTripCard trip={trip} key={trip.slug} />
      <EditTripCard trackableId={trackableId} trip={trip} />
    </StackCard>
      <StackCard columns={markers && markers.length > 0 ? 2 : 1 }>
        <MarkersCard markers={markers ?? []} />
        <Card title="Map">
          <MapWrapper
            onMapReady={() => {
              setMapReady(true);
            }}
            mapRef={mapRef as RefObject<MapRef>}
            mapStyle={{ height: "400px" }}
          >
            {(() => {
              if (!trip || trip.positions.length < 2) return null;

              const color = trip.color || "#3b82f6";

              const coordinates = trip.positions
                .toReversed()
                .map((p) => [p.longitude, p.latitude]);

              if (coordinates.length < 2) return null;

              const routeData = createRouteData(trip.positions, false);

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
