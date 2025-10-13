import type maplibregl from "maplibre-gl";
import type { MapRef } from "react-map-gl/maplibre";
import type { Position, TripDetailed } from "@/store/atoms";
import { fitMapBounds } from "./mapBounds";
import {
  createTripMarkers,
  createVehicleMarker,
  getVisibleMarkers,
  updateMarkersOnMap,
} from "./mapMarkers";

export class TripAnimator {
  private animationId: number | null = null;
  private timeoutId: number | null = null;
  private vehicleMarker: maplibregl.Marker | null = null;
  private visibleMarkers: Record<string, maplibregl.Marker> = {};
  private startTime: number | null = null;

  private currentSlug: string | null = null;

  constructor(
    private mapRef: React.RefObject<MapRef | null>,
    private onPhotoClick?: (photoIndex: number) => void,
  ) {}

  animate(trip: TripDetailed, trackableId: string): void {
    const map = this.mapRef.current?.getMap();
    if (!map) return;

    if (this.currentSlug !== trip.slug) {
      this.cleanup();
    }

    this.currentSlug = trip.slug;
    this.startTime = null;

    this.resetAnimationSource(map, trip.slug);

    const activePositions = trip.positions.toReversed();

    createTripMarkers(trip.markers, { current: this.visibleMarkers }, (photoIndex) => {
      this.onPhotoClick?.(photoIndex);
    });

    const vehicleMarkerRef = { current: this.vehicleMarker };
    createVehicleMarker(
      activePositions[0],
      vehicleMarkerRef,
      map,
      trackableId,
    );
    this.vehicleMarker = vehicleMarkerRef.current;

    fitMapBounds(this.mapRef, activePositions);

    this.startAnimationLoops(map, trip, activePositions);
  }


  cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.vehicleMarker) {
      this.vehicleMarker.remove();
      this.vehicleMarker = null;
    }
    for (const marker of Object.values(this.visibleMarkers)) {
      marker.remove();
    }
    this.visibleMarkers = {};

    if (this.currentSlug) {
      const map = this.mapRef.current?.getMap();
      if (map) {
        this.resetAnimationSource(map, this.currentSlug);
      }
    }

    this.currentSlug = null;
    this.startTime = null;
  }


  getCurrentSlug(): string | null {
    return this.currentSlug;
  }


  private resetAnimationSource(map: maplibregl.Map, slug: string): void {
    const animationRouteSource = map.getSource(
      `route-${slug}-animation`,
    ) as maplibregl.GeoJSONSource | undefined;

    if (animationRouteSource) {
      animationRouteSource.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        ],
      });
    }
  }

  private startAnimationLoops(
    map: maplibregl.Map,
    trip: TripDetailed,
    activePositions: Position[],
  ): void {
    const duration = trip.animationSpeed ?? 5000;
    this.startTime = performance.now();

    const animateVehicle = (): void => {
      if (!this.startTime) return;

      const elapsed = performance.now() - this.startTime;
      const progress = Math.min(elapsed / duration, 1);
      const exactIndex = progress * (activePositions.length - 1);

      const lower = Math.floor(exactIndex);
      const upper = Math.min(lower + 1, activePositions.length - 1);
      const t = exactIndex - lower;

      const p1 = activePositions[lower];
      const p2 = activePositions[upper];
      const lng = p1.longitude + (p2.longitude - p1.longitude) * t;
      const lat = p1.latitude + (p2.latitude - p1.latitude) * t;

      this.vehicleMarker?.setLngLat([lng, lat]);

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animateVehicle);
      } else {
        this.animationId = null;
        this.startTime = null;
      }
    };

    const animateMap = (): void => {
      if (!this.startTime) return;

      const elapsed = performance.now() - this.startTime;
      const progress = Math.min(elapsed / duration, 1);
      const exactIndex = progress * (activePositions.length - 1);
      const currentIndex = Math.floor(exactIndex);

      const source = map.getSource(`route-${trip.slug}-animation`) as
        | maplibregl.GeoJSONSource
        | undefined;

      if (source) {
        const coords = activePositions
          .slice(0, currentIndex + 1)
          .map((p) => [p.longitude, p.latitude]);

        source.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: coords },
            },
          ],
        });
      }

      const currentPosition = activePositions[currentIndex];
      const visibleMarkers = getVisibleMarkers(trip.markers, currentPosition);
      updateMarkersOnMap(visibleMarkers, { current: this.visibleMarkers }, map);

      if (progress < 1) {
        this.timeoutId = window.setTimeout(animateMap, 100);
      } else {
        this.timeoutId = null;
      }
    };

    this.animationId = requestAnimationFrame(animateVehicle);
    this.timeoutId = window.setTimeout(animateMap, 100);
  }
}
