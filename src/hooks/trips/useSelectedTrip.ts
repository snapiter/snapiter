import { useAtomValue } from "jotai";
import { selectedTripAtom } from "@/store/atoms";
import { useDetailedTrip } from "./useDetailedTrip";
import { useTripsByHostname } from "./useTripsByHostname";

export function useSelectedTrip() {
  const selectedTripSlug = useAtomValue(selectedTripAtom);
  const { trips, isSuccess: tripsSuccess } = useTripsByHostname();
  const selectedTrip = trips?.find((t) => t.slug === selectedTripSlug);

  const { data: trip, isSuccess: tripSuccess } = useDetailedTrip(
    selectedTrip ?? null,
  );

  return { trip: tripSuccess && tripsSuccess ? trip : null };
}
