import { TripWithPositions } from "@/store/atoms";
import { createRouteData } from "@/utils/mapBounds";
import { Source, Layer } from "react-map-gl/maplibre";

interface TripLayerProps {
    trip: TripWithPositions;
    selectedTripSlug?: string;
    hoveredTripSlug: string | null;
  }
  
export default function TripLayer({ trip, selectedTripSlug, hoveredTripSlug }: TripLayerProps) {
    if (trip.positions.length < 2) return null;
  
    const isSelected = trip.slug === selectedTripSlug;
    const isHovered = trip.slug === hoveredTripSlug;
    const color = trip.color || '#3b82f6';
  
    const coordinates = trip.positions.toReversed().map(p => [p.longitude, p.latitude]);
    if (coordinates.length < 2) return null;

    let routeData: GeoJSON.FeatureCollection<GeoJSON.LineString, GeoJSON.GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [],
    };
    
    if(!isSelected) routeData = createRouteData(trip.positions);

  
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