import type { Position } from '@/store/atoms';

export function fitMapBounds(
  mapRef: { current: any },
  positions: Position[],
  duration: number = 1000
) {
  if (!mapRef.current || positions.length === 0) return;

  const lats = positions.map(p => p.latitude);
  const lngs = positions.map(p => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  mapRef.current.fitBounds(
    [[minLng, minLat], [maxLng, maxLat]], 
    { padding: 40, duration: duration }
  );
}

export function createRouteData(
  positions: Position[],
  isSelected: boolean
) {
  const coordinates = positions.toReversed().map(p => [p.longitude, p.latitude]);
  
  return {
    type: 'FeatureCollection' as const,
    features: [{
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: isSelected ? [] : coordinates,
      },
    }],
  };
}