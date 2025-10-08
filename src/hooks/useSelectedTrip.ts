import { selectedTripAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useTripsByHostname } from "./useTripsByHostname";
import { useMarkers, useTripWithMarkers } from "./useMarkers";

export function useSelectedTrip() {
    const selectedTripSlug = useAtomValue(selectedTripAtom);
    const { data: trips } = useTripsByHostname();
    const selectedTrip = trips?.find(t => t.slug === selectedTripSlug);

    const { data: markers } = useTripWithMarkers(selectedTrip ?? null);
    
    return {trip: markers}
 
}