import maplibregl from 'maplibre-gl';
import { type Marker as TripMarker, type Position } from '@/store/atoms';

export function createTripMarkers(
  markers: TripMarker[], 
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  onMarkerClick: (marker: TripMarker) => void
) {
  markers.forEach(marker => {
    if (!visibleMarkersRef.current[marker.id]) {
      const el = document.createElement('div');
      el.className = 'w-8 h-8';
    
      el.innerHTML = `
        <img 
          src="https://cache.partypieps.nl/marker/${marker.markerId}/thumbnail/500x500" 
          class="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-110 transition-transform"
          alt="marker"
        />
      `;

      el.addEventListener('click', () => onMarkerClick(marker));
    
      visibleMarkersRef.current[marker.id] = new maplibregl.Marker({ element: el })
        .setLngLat([marker.longitude, marker.latitude]);
    }
  });
}

export function createVehicleMarker(
  position: Position,
  vehicleMarkerRef: { current: maplibregl.Marker | null },
  map: maplibregl.Map
) {
  if (!vehicleMarkerRef.current) {
    const el = document.createElement('div');
    el.style.width = '32px';
    el.style.height = '32px';
    el.innerHTML = `<img src="/assets/icons/van-passenger.svg" style="width: 100%; height: 100%;" />`;
    vehicleMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([position.longitude, position.latitude])
      .addTo(map);
  } else {
    vehicleMarkerRef.current.setLngLat([position.longitude, position.latitude]);
  }
}

export function getVisibleMarkers(
  markers: TripMarker[],
  currentPosition: Position
): TripMarker[] {
  const currentTime = new Date(currentPosition.createdAt).getTime();
  return markers.filter(marker => new Date(marker.createdAt).getTime() <= currentTime);
}

export function updateMarkersOnMap(
  visibleMarkers: TripMarker[],
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  map: maplibregl.Map
) {
  visibleMarkers.forEach(marker => {
    const m = visibleMarkersRef.current[marker.id];
    if (m && !m.getElement().parentNode) {
      m.addTo(map);
    }
  });
}

export function cleanupMarkers(
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  vehicleMarkerRef: { current: maplibregl.Marker | null }
) {
  Object.values(visibleMarkersRef.current).forEach(m => m.remove());
  visibleMarkersRef.current = {};
  if (vehicleMarkerRef.current) {
    vehicleMarkerRef.current.remove();
    vehicleMarkerRef.current = null;
  }
}