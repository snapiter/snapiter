import { selectedTripAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useTripsByHostname } from "./useTripsByHostname";
import { useDetailedTrip } from "./useTrip";

export function useSelectedTrip() {
    const selectedTripSlug = useAtomValue(selectedTripAtom);
    const { data: trips, isSuccess: tripsSuccess } = useTripsByHostname();
    const selectedTrip = trips?.find(t => t.slug === selectedTripSlug);

    const { data: trip, isSuccess: tripSuccess } = useDetailedTrip(selectedTrip ?? null);
    
    return { trip: tripSuccess && tripsSuccess ? trip : null }
 }