import { selectedTripAtom, TripWithMarkers } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useMarkers } from "@/hooks/useMarkers";
import { useMemo } from "react";

export function useSelectedTrip() {
    const selectedTrip = useAtomValue(selectedTripAtom);
    const { data: markers, isLoading: markersLoading, error: markersError } = useMarkers(selectedTrip);

    return useMemo(() => {
        if (!selectedTrip) {
            return {
                trip: null,
                isLoading: false,
                hasError: false,
                error: null
            };
        }

        if (markersLoading || !markers) {
            return {
                trip: null,
                isLoading: true,
                hasError: false,
                error: null
            };
        }

        if (markersError) {
            return {
                trip: null,
                isLoading: false,
                hasError: markersError instanceof Error,
                error: markersError
            };
        }

        return {
            trip: { ...selectedTrip, markers } as TripWithMarkers,
            isLoading: false,
            hasError: false,
            error: null
        };
    }, [selectedTrip, markers, markersLoading, markersError]);
}