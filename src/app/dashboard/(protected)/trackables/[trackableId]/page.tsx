"use client";

import { use } from "react";
import DevicesStackCard from "@/components/dashboard/cards/devices/DevicesStackCard";
import TrackableCard from "@/components/dashboard/cards/TrackableCard";
import ActiveTripCard from "@/components/dashboard/cards/trips/ActiveTripCard";
import StartTripCard from "@/components/dashboard/cards/trips/StartTripCard";
import StackCard from "@/components/dashboard/layout/StackCard";
import { useTrips } from "@/hooks/dashboard/trips/useTrips";

export default function TrackablePage({
  params,
}: {
  params: Promise<{ trackableId: string }>;
}) {
  const { trackableId } = use(params);

  const { data: trips } = useTrips(trackableId);

  const activeTrip = trips?.filter((t) => t.endDate == null)?.[0];

  return (
    <>
      <StackCard columns={1}>
        {activeTrip ? (
          <ActiveTripCard trip={activeTrip} key={activeTrip.slug} />
        ) : (
          <StartTripCard trackableId={trackableId} />
        )}
      </StackCard>
      <StackCard columns={1}>
        <TrackableCard trackableId={trackableId} />
      </StackCard>
      <DevicesStackCard trackableId={trackableId} />
    </>
  );
}
