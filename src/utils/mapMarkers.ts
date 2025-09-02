import maplibregl from 'maplibre-gl';
import type { Marker as TripMarker, Position } from '@/store/atoms';
import { config } from '@/config';

export function createTripMarkers(
  markers: TripMarker[], 
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  onMarkerClick: (photoIndex: number) => void
) {
  markers.forEach(marker => {
    if (!visibleMarkersRef.current[marker.id]) {
      const el = document.createElement('div');
      el.className = '';
    
      el.innerHTML = `
        <img 
          src="${config.cacheApiUrl}/marker/${marker.markerId}/thumbnail/500x500" 
          class="map-marker"
          alt="marker"
          data-marker-id="${marker.markerId}"
        />
      `;

      el.addEventListener('click', () => {
        // Find the index of the clicked marker in the filtered markers array
        const photosFromMarkers = markers.filter(m => m.hasThumbnail);
        const photoIndex = photosFromMarkers.findIndex(m => m.markerId === marker.markerId);
        
        if (photoIndex !== -1) {
          onMarkerClick(photoIndex);
        }
      });
    
      visibleMarkersRef.current[marker.id] = new maplibregl.Marker({ element: el })
        .setLngLat([marker.longitude, marker.latitude]);
    }
  });
}

export function createVehicleMarker(
  position: Position,
  vehicleMarkerRef: { current: maplibregl.Marker | null },
  map: maplibregl.Map,
  icon?: string
) {
  if (!vehicleMarkerRef.current) {
    const el = document.createElement('div');
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.zIndex = '100'; // Ensure vehicle marker is always on top
    if(!icon) {
      el.innerHTML = `<img src="/assets/icons/sailboat-icon.gif" style="width: 100%; height: 100%;" />`;
    } else {
      el.innerHTML = `<img src="/assets/icons/${icon}" style="width: 100%; height: 100%;" />`;
    }
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

export function highlightMarker(
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  hoveredPhotoId: string | null
) {
  Object.values(visibleMarkersRef.current).forEach(marker => {
    const img = marker.getElement().querySelector('img');
    if (img) {
      const markerId = img.getAttribute('data-marker-id');
      if (hoveredPhotoId && markerId === hoveredPhotoId) {
        img.classList.add('map-marker-highlighted');
      } else {
        img.classList.remove('map-marker-highlighted');
      }
    }
  });
}