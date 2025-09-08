import { atom } from 'jotai';

export enum PageType {
  TRIPS = 'TRIPS',
  POSITIONS = 'POSITIONS',
}
export enum MapStyle {
  LANDSCAPE = 'landscape',
  STREETS_V2 = 'streets-v2',
}

export interface Website {
  vesselId: string;
  shipName: string;
  websiteTitle: string;
  website: string;
  icon: string;
  pageType: PageType;
  trips: Trip[];
  mapStyle: MapStyle;
}

export interface Trip {
  vesselId: string;
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
  id: string;
  vesselId: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface Marker {
  id: string;
  vesselId: string;
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

export const selectedTripAtom = atom<Trip | null>(null);

export const errorAtom = atom<string | null>(null);

export const bottomPanelExpandedAtom = atom<boolean>(false);

export const lightboxIndexAtom = atom<number>(-1);

// Map Command/Event System
export type MapCommand = 
  | { type: 'FLY_TO'; coordinates: [number, number]; zoom?: number; duration?: number, id: string }
  | { type: 'HIGHLIGHT_MARKER'; markerId: string | null; id: string }
  | { type: 'LIGHTBOX_OPEN'; photoIndex: number; id: string }
  | { type: 'LIGHTBOX_CLOSE'; id: string }
  | { type: 'MAP_READY'; id: string }
  | { type: 'SELECT_TRIP'; tripSlug: string; id: string }
  | { type: 'PANEL_EXPAND'; id: string }
  | { type: 'PANEL_COLLAPSE'; id: string };

export type MapEvent = 
  | { type: 'ANIMATION_ENDED'; tripSlug: string; commandId: string }
  | { type: 'FLY_TO_ENDED'; coordinates: [number, number]; commandId: string }
  | { type: 'MARKER_HIGHLIGHTED'; markerId: string | null; commandId: string }
  | { type: 'LIGHTBOX_OPENED'; photoIndex: number; commandId: string }
  | { type: 'LIGHTBOX_CLOSED'; commandId: string }
  | { type: 'MAP_READY'; commandId: string }
  | { type: 'TRIP_SELECTED'; tripSlug: string; commandId: string }
  | { type: 'PANEL_EXPANDED'; commandId: string }
  | { type: 'PANEL_COLLAPSED'; commandId: string };

export const mapCommandsAtom = atom<MapCommand[]>([]);
export const mapEventsAtom = atom<MapEvent[]>([]);