import { useQueries } from '@tanstack/react-query';
import { fetchPositions, fetchTripMarkers } from '@/services/api';
import type { Trip, TripDetailed, TripWithPositions } from '@/store/atoms';


export function useTripPositions(trips: Trip[]) {
  const tripPositionQueries = useQueries({
    queries: trips.map(trip => ({
      queryKey: ['tripPositions', trip.vesselId, trip.slug],
      queryFn: async () => {
        const positions = await fetchPositions(trip.vesselId, trip.slug);
        return { ...trip, positions } as TripWithPositions;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    })),
  });

  const tripsWithPositions: TripWithPositions[] = tripPositionQueries
    .map(q => q.data)
    .filter((t): t is TripWithPositions => t !== undefined);

  return tripsWithPositions;
}


export function useTripDetailed(trips: Trip[]) {
  const tripDetailedQueries = useQueries({
    queries: trips.map(trip => ({
      queryKey: ['tripDetailed', trip.vesselId, trip.slug],
      queryFn: async () => {
        const [positions, markers] = await Promise.all([
          fetchPositions(trip.vesselId, trip.slug),
          fetchTripMarkers(trip.vesselId, trip)
        ]);
        return { ...trip, positions, markers } as TripDetailed;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    })),
  });

  const detailedTrips: TripDetailed[] = tripDetailedQueries
    .map(query => query.data)
    .filter((trip): trip is TripDetailed => trip !== undefined);

  return detailedTrips;
}