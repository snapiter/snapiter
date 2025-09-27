import { selectedTripAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useTripsByHostname } from "./useTripsByHostname";

export function useSelectedTrip() {
    const selectedTripSlug = useAtomValue(selectedTripAtom);
    const { data: trips } = useTripsByHostname();
    const selectedTrip = trips?.find(t => t.slug === selectedTripSlug);

    return {
        trip: selectedTrip,
    }
}