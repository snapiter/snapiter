import { selectedTripAtom, TripWithMarkers } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useMarkers } from "@/hooks/useMarkers";

export function useSelectedTrip() {
    const selectedTrip = useAtomValue(selectedTripAtom);
    const { data: markers } = useMarkers(selectedTrip?.vesselId || null, selectedTrip);

    if (!selectedTrip) return null;
    if (!markers) return null;
    
    return { ...selectedTrip, markers } as TripWithMarkers;
}