import { TripWithPositions } from "@/store/atoms";
import { Source, Layer } from "react-map-gl/maplibre";

interface AnimatedTripLayerProps {
    trip: TripWithPositions;
    selectedTripSlug?: string;
}

export default function AnimatedTripLayer({ trip, selectedTripSlug }: AnimatedTripLayerProps) {
    if (trip.positions.length < 2) return <></>;
    if (trip.slug !== selectedTripSlug) return <></>;

    const color = trip.color || '#3b82f6';

    return (
        <Source
            id={`route-${trip.slug}-animation`}
            type="geojson"
            data={{
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: { type: 'LineString', coordinates: [] },
                    },
                ],
            }}
        >
            <Layer
                id={`route-line-${trip.slug}-animation`}
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{
                    'line-width': 4,
                    'line-color': color,
                    'line-opacity': 1,
                }}
            />
        </Source>
    );
}