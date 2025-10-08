import { fitMapBounds } from "@/utils/mapBounds";
import { useMapCommands } from "../useMapCommands";
import { useAtomValue } from "jotai";
import { mapEventsAtom, Trip } from "@/store/atoms";
import { useEffect } from "react";
import { useTripsWithPositions } from "../useTripsWithPositions";
import { useSelectedTrip } from "../useSelectedTrip";
import { MapRef } from "react-map-gl/maplibre";


export function useAutoFlyToMarker(mapRef: React.RefObject<MapRef | null>, trips: Trip[]) {
    const { data: tripsWithPositions = [] } = useTripsWithPositions(trips);
    const mapEvents = useAtomValue(mapEventsAtom);
    const { trip: selectedTrip } = useSelectedTrip();
    const { runCommand } = useMapCommands();

    useEffect(() => {
        const lastEvent = mapEvents[mapEvents.length - 1];
        if (!lastEvent) return;

        // If the marker is highlighted, fly to the marker
        if (lastEvent.type === 'MARKER_HIGHLIGHTED') {
            const marker = selectedTrip?.markers?.filter(i => i.markerId == lastEvent.markerId).pop()
            if (marker) {
                runCommand({
                    type: 'FLY_TO',
                    coordinates: [marker.longitude, marker.latitude],
                    zoom: 8,
                    duration: 1500
                });
            }
        }

        // If the marker is left, fit the map bounds to the trip
        if (lastEvent.type === 'MARKER_HIGHLIGHTED_LEAVE') {
            const trip = tripsWithPositions.find(t => t.slug == selectedTrip?.slug);

            if (trip) {
                fitMapBounds(mapRef, trip?.positions);
            }
        }
    }, [mapEvents]);
}