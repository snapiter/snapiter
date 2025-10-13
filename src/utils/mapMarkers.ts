import maplibregl from "maplibre-gl";
import { getMarkerUrlThumbnail, getTrackableIcon } from "@/services/thumbnail";
import type { Position, Marker as TripMarker } from "@/store/atoms";

export function createTripMarkers(
  markers: TripMarker[],
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  onMarkerClick: (photoIndex: number) => void,
) {
  markers.forEach((marker) => {
    if (!visibleMarkersRef.current[marker.markerId]) {
      const el = document.createElement("div");
      el.className = "";

      el.innerHTML = `
        <img 
          src="${getMarkerUrlThumbnail(marker, "100x100")}" 
          class="map-marker"
          alt="marker"
          data-marker-id="${marker.markerId}"
        />
      `;

      el.addEventListener("click", () => {
        const photoIndex = markers.findIndex(
          (m) => m.markerId === marker.markerId,
        );
        if (photoIndex !== -1) {
          onMarkerClick(photoIndex);
        }
      });

      visibleMarkersRef.current[marker.markerId] = new maplibregl.Marker({
        element: el,
      }).setLngLat([marker.longitude, marker.latitude]);
    }
  });
}

export function createVehicleMarker(
  position: Position,
  vehicleMarkerRef: { current: maplibregl.Marker | null },
  map: maplibregl.Map,
  trackableId: string,
) {
  if (!vehicleMarkerRef.current) {
    const el = document.createElement("div");
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.zIndex = "100"; // Ensure vehicle marker is always on top

    el.innerHTML = `<img src="${getTrackableIcon(trackableId)}" style="width: 100%; height: 100%;" />`;

    vehicleMarkerRef.current = new maplibregl.Marker({
      element: el,
      anchor: "center",
    })
      .setLngLat([position.longitude, position.latitude])
      .addTo(map);
  } else {
    vehicleMarkerRef.current.setLngLat([position.longitude, position.latitude]);
  }
}

export function getVisibleMarkers(
  markers: TripMarker[],
  currentPosition: Position,
): TripMarker[] {
  const currentTime = new Date(currentPosition.createdAt).getTime();
  return markers.filter(
    (marker) => new Date(marker.createdAt).getTime() <= currentTime,
  );
}

export function updateMarkersOnMap(
  visibleMarkers: TripMarker[],
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  map: maplibregl.Map,
) {
  visibleMarkers.forEach((marker) => {
    const m = visibleMarkersRef.current[marker.markerId];
    if (m && !m.getElement().parentNode) {
      m.addTo(map);
    }
  });
}

export function cleanupMarkers(
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  vehicleMarkerRef: { current: maplibregl.Marker | null },
) {
  Object.values(visibleMarkersRef.current).forEach((m) => m.remove());
  visibleMarkersRef.current = {};
  if (vehicleMarkerRef.current) {
    vehicleMarkerRef.current.remove();
    vehicleMarkerRef.current = null;
  }
}

export function highlightMarker(
  visibleMarkersRef: { current: Record<string, maplibregl.Marker> },
  hoveredPhotoId: string | null,
) {
  Object.values(visibleMarkersRef.current).forEach((marker) => {
    const img = marker.getElement().querySelector("img");
    if (img) {
      const markerId = img.getAttribute("data-marker-id");
      if (hoveredPhotoId && markerId === hoveredPhotoId) {
        img.classList.add("map-marker-highlighted");
      } else {
        img.classList.remove("map-marker-highlighted");
      }
    }
  });
}
