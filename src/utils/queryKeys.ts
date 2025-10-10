export enum QueryKey {
  WEBSITE = 'website',
  TRIPS = 'trips',
  TRIP_WITH_POSITIONS = 'trip-with-positions',
  TRIP = 'trip',
  MARKERS = 'markers',
  TRIPS_WITH_MARKERS = 'trips-with-markers',
  TRACKABLES = 'trackables',
  TRACKABLE = 'trackable',
  DEVICES = 'devices',
}

export const queryKeys = {
  website: (hostname: string) => [QueryKey.WEBSITE, hostname] as const,
  trips: (trackableId: string) => [QueryKey.TRIPS, trackableId] as const,
  tripWithPositions: (trackableId: string, tripId: string) => [QueryKey.TRIP_WITH_POSITIONS, trackableId, tripId] as const,
  trip: (trackableId: string, slug: string) => [QueryKey.TRIP, trackableId, slug] as const,
  markers: (trackableId: string, slug: string) => [QueryKey.MARKERS, trackableId, slug] as const,
  tripsWithMarkers: (trackableId: string) => [QueryKey.TRIPS_WITH_MARKERS, trackableId] as const,
  trackables: () => [QueryKey.TRACKABLES] as const,
  trackable: (trackableId: string) => [QueryKey.TRACKABLE, trackableId] as const,
  devices: (trackableId: string) => [QueryKey.DEVICES, trackableId] as const,
} as const;
