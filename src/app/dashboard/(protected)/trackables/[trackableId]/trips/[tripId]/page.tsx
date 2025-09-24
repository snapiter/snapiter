"use client";

import { RefObject, use, useEffect, useRef, useState } from "react";
import { useTripWithPosition } from "@/hooks/useTripWithPosition";
import Card from "@/components/dashboard/Card";
import StackCard from "@/components/dashboard/StackCard";
import { Layer, MapRef, Marker, Source } from "react-map-gl/maplibre";
import MapWrapper from "@/components/MapWrapper";
import { createRouteData, fitMapBounds } from "@/utils/mapBounds";
import { formatTripDate } from "@/utils/formatTripDate";
import { useMarkers } from "@/hooks/useMarkers";
import MarkersCard from "@/components/dashboard/markers/MarkersCard";
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


  if (isLoading) return <></>;
  if (isError || !trip) return <p>Something went wrong.</p>;


  return (
    <>
      <StackCard columns={1}>
        <Card title={trip.title} description={trip.description}>
          <p>Slug: {trip.slug}</p>
          <p>{formatTripDate(trip.startDate, trip.endDate)}</p>
          <p>Positions loaded: {trip.positions.length}</p>
        </Card>
      </StackCard>
      <StackCard columns={2}>
        <MarkersCard markers={markers ?? []} />
        <Card title="Your trip">
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
