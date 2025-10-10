import type { Trip, TripDetailed } from '@/store/atoms';
import { useTripPositions } from './useTripPositions';
import { useTripMarkers } from './useTripMarkers';

export function useDetailedTrip(trip: Trip | null) {
  const positions = useTripPositions(trip?.trackableId ?? '', trip?.slug ?? '');
  const markers = useTripMarkers(trip?.trackableId ?? '', trip?.slug ?? '');

  const isLoading = positions.isLoading || markers.isLoading;
  const isSuccess = positions.isSuccess && markers.isSuccess;
  const isError = positions.isError || markers.isError;

  const data: TripDetailed | undefined =
    trip && isSuccess
      ? { ...trip, positions: positions.data ?? [], markers: markers.data ?? [] }
      : undefined;

  return {
    data,
    isLoading,
    isSuccess,
    isError,
    error: positions.error || markers.error,
  };
}
