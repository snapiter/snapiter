import type { Trip, Position, Marker, Website } from '@/store/atoms';

const BASE_URL = 'https://api.partypieps.nl/api';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
  }
}

export async function fetchTrips(vesselId: string): Promise<Trip[]> {
  return fetchApi<Trip[]>(`/public/vessel/${vesselId}/trips`);
}

export async function fetchPositions(
  vesselId: string, 
  tripName: string, 
  page: number = 0, 
  size: number = 2000
): Promise<Position[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  return fetchApi<Position[]>(`/public/vessel/${vesselId}/positions/${tripName}?${params}`);
}

export async function fetchMarkers(
  vesselId: string,
  fromDate?: string,
  untilDate?: string,
  page: number = 0,
  size: number = 500
): Promise<Marker[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  
  if (fromDate) {
    params.set('fromDate', fromDate);
  }
  
  if (untilDate) {
    params.set('untilDate', untilDate);
  }

  return fetchApi<Marker[]>(`/public/vessel/${vesselId}/markers?${params}`);
}

export async function fetchTripMarkers(vesselId: string, trip: Trip): Promise<Marker[]> {
  return fetchMarkers(vesselId, trip.startDate, trip.endDate);
}

export async function fetchWebsiteByHostname(hostname: string): Promise<Website> {
  const response = await fetch(`https://cache.snapiter.com/api/public/vessel/hostName/${hostname}`);
  
  if (!response.ok) {
    throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
  }
  
  return await response.json();
}