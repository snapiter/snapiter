export enum QueryKey {
  TRIPS = "trips",
  TRIP_POSITIONS = "trip-positions",
  TRIP_MARKERS = "trip-markers",
  TRIPS_WITH_MARKERS = "trips-with-markers",
  TRACKABLES = "trackables",
  TRACKABLE = "trackable",
  DEVICES = "devices",
}

export const queryKeys = {
  trips: (trackableId: string) => [QueryKey.TRIPS, trackableId] as const,
  tripPositions: (trackableId: string, slug: string) =>
    [QueryKey.TRIP_POSITIONS, trackableId, slug] as const,
  tripMarkers: (trackableId: string, slug: string) =>
    [QueryKey.TRIP_MARKERS, trackableId, slug] as const,
  tripsWithMarkers: (trackableId: string) =>
    [QueryKey.TRIPS_WITH_MARKERS, trackableId] as const,
  trackables: () => [QueryKey.TRACKABLES] as const,
  trackable: (trackableId: string) =>
    [QueryKey.TRACKABLE, trackableId] as const,
  devices: (trackableId: string) => [QueryKey.DEVICES, trackableId] as const,
} as const;
