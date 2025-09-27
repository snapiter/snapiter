'use client';

import PhotoGrid from '../../PhotoGrid';
import type { Marker, Trip } from '@/store/atoms';
import { FaRoute } from 'react-icons/fa6';
import DayAndPhoto from '../DayAndPhoto';
  
interface TripDetailsProps {
  trip: Trip;
  isSelected: boolean;
  markers: Marker[];
}

export default function DesktopTripDetails({ trip, isSelected, markers }: TripDetailsProps) {
  if (trip === undefined || trip === null) {
    return <></>
  }

  if (markers.length === 0) {
    return <></>
  }

  return (
      <div className="h-full flex flex-col flex-1">
        <div className="hidden md:block">
          <div className="p-0 md:p-4 sticky top-0 z-[101] bg-background">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-foreground mb-2 mt-2">{trip.title} </h2>
              <FaRoute className="w-4 h-4" color={trip.color} />
            </div>
            <DayAndPhoto startDate={trip.startDate} endDate={trip.endDate} isSelected={isSelected} markersLength={markers.length} />
          </div>
            <div className="overflow-y-auto">
              <PhotoGrid markers={markers} />
            </div>
        </div>
      </div>
  );
}