import { atom } from 'jotai';

export const dashboardLoading = atom<boolean>(false);
export const mobileMenuOpen = atom<boolean>(false);

export type ErrorMessage = {
  message: string;
  status: number;
}
export const errorMessage = atom<ErrorMessage | null>(null);

export enum PageType {
  TRIPS = 'TRIPS',
  POSITIONS = 'POSITIONS',
}
export enum MapStyle {
  LANDSCAPE = 'landscape',
  STREETS_V2 = 'streets-v2',
}

export type Trackable = {
  trackableId: string;
  name: string;
  title: string;
  hostName: string;
};

export type Device = {
  trackableId: string;
  deviceId: string;
  name: string;
  createdAt: Date;
  lastReportedAt: Date;
};


export interface Trip {
  trackableId: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  slug: string;
  positionType: string;
  createdAt: string;
  color?: string;
  animationSpeed?: number;
  photos?: Photo[];
}

export interface TripWithPositions extends Trip {
  positions: Position[];
}

export interface TripWithMarkers extends Trip {
  markers: Marker[];
}

export interface TripDetailed extends TripWithPositions, TripWithMarkers {
}

export interface Position {
  trackableId: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface Marker {
  trackableId: string;
  markerId: string;
  fileSize: number;
  fileType: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  hasThumbnail: boolean;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}



export interface QuickCreateRes {
  deviceToken: string;
  qrDataUrl?: string;
};

export const selectedTripAtom = atom<string | null>(null);

export const bottomPanelExpandedAtom = atom<boolean>(false);

export const lightboxIndexAtom = atom<number>(-1);

export const mapReadyAtom = atom<boolean>(false);

export type FlyToCommand = {
  coordinates: [number, number];
  zoom?: number;
  duration?: number;
  timestamp: number; // Used to trigger the effect
};

export const flyToAtom = atom<FlyToCommand | null>(null);

export const highlightedMarkerAtom = atom<string | null>(null);

export type AnimationState = {
  animationId: number | null;
  timeoutId: number | null;
  currentSlug: string | null;
};

export const animationStateAtom = atom<AnimationState>({
  animationId: null,
  timeoutId: null,
  currentSlug: null,
});