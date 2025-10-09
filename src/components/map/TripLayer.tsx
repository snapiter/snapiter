import { useTripWithPosition } from "@/hooks/trips/useTrip";
import { Trip } from "@/store/atoms";
import { EnvContext } from "@/utils/env/EnvProvider";
import { createRouteData } from "@/utils/mapBounds";
import { useContext } from "react";
import { Source, Layer } from "react-map-gl/maplibre";

interface TripLayerProps {
    trip: Trip;
    selectedTripSlug?: string;
    hoveredTripSlug: string | null;
  }
  
export default function TripLayer({ trip, selectedTripSlug, hoveredTripSlug }: TripLayerProps) {
    const { data: tripWithPositions = { ...trip, positions: [] } } = useTripWithPosition(trip.trackableId, trip.slug);

    const env = useContext(EnvContext);
    
    if (tripWithPositions?.positions.length < 2) return null;
    
    const isSelected = trip.slug === selectedTripSlug;
    const isHovered = trip.slug === hoveredTripSlug;
    const color = trip.color || '#3b82f6';
  
    const coordinates = tripWithPositions?.positions.toReversed().map(p => [p.longitude, p.latitude]);
    if (coordinates.length < 2) return null;

    let routeData: GeoJSON.FeatureCollection<GeoJSON.LineString, GeoJSON.GeoJsonProperties>;

    const shouldShowBaseLine =
      !isSelected || env.SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION;
    
    if (shouldShowBaseLine) {
      routeData = createRouteData(tripWithPositions?.positions);
    } else {
      routeData = {
        type: 'FeatureCollection',
        features: [],
      };
    }
    
  
    return (
      <>
        <Source id={`route-${trip.slug}`} type="geojson" data={routeData}>
          <Layer
            id={`route-line-${trip.slug}`}
            type="line"
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{
              'line-width': isHovered ? 6 : 4,
              'line-color': color,
              'line-opacity': isHovered ? 1 : 0.3,
            }}
          />
        </Source>
      </>
    );
  }