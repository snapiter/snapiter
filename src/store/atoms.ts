import { atom } from 'jotai';
import { config } from '@/config/config';

export interface Trip {
  id: string;
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

export const vesselIdAtom = atom<string>(config.vesselId);

export const tripsAtom = atom<Trip[]>([]);

export const selectedTripAtom = atom<Trip | null>(null);

export const positionsAtom = atom<Position[]>([]);

export const markersAtom = atom<Marker[]>([]);

export const isLoadingTripsAtom = atom<boolean>(false);
export const isLoadingPositionsAtom = atom<boolean>(false);
export const isLoadingMarkersAtom = atom<boolean>(false);

export const errorAtom = atom<string | null>(null);