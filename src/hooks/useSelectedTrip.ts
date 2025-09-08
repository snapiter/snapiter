import { selectedTripAtom, TripWithMarkers } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { fetchTripMarkers } from "@/services/api";

export function useSelectedTrip() {
    const selectedTrip = useAtomValue(selectedTripAtom);
    const [tripWithMarkers, setTripWithMarkers] = useState<TripWithMarkers | null>(null);

    useEffect(() => {
      if (selectedTrip) {
        fetchTripMarkers(selectedTrip.vesselId, selectedTrip).then(markers => {
            setTripWithMarkers({ ...selectedTrip, markers}); 

        });
      } else {
        setTripWithMarkers(null);
      }
    }, [selectedTrip]);

    return tripWithMarkers;
}