"use client";

import { use } from "react";
import StackCard from "@/components/dashboard/layout/StackCard";
import DeviceCard from "@/components/dashboard/cards/DeviceCard";
import AddPhoneCard from "@/components/dashboard/cards/AddPhoneCard";
import AddTokenCard from "@/components/dashboard/cards/AddTokenCard";
import { useTrips } from "@/hooks/useTrips";
import ActiveTripCard from "@/components/dashboard/cards/trips/ActiveTripCard";
import StartTripCard from "@/components/dashboard/cards/trips/StartTripCard";
import TrackableCard from "@/components/dashboard/cards/TrackableCard";
import { useDevices } from "@/hooks/dashboard/useDevices";


export default function TrackablePage({
  params,
}: {
  params: Promise<{ trackableId: string }>;
}) {
  const { trackableId } = use(params);
  const { data: trips } = useTrips(trackableId);
  const { data: devices } = useDevices(trackableId);

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
        <TrackableCard trackableId={trackableId } />
      </StackCard>
      {devices.length > 0 ? (
        <StackCard columns={1}>
          {devices.map((d) => (
            <DeviceCard device={d} key={d.deviceId} />
          ))}
        </StackCard>
      ) : (
        <StackCard columns={2}>
          <AddPhoneCard trackableId={trackableId} />
          <AddTokenCard trackableId={trackableId} />
        </StackCard>
      )}
    </>
  );
}
