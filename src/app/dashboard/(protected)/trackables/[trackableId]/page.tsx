"use client";

import { use, useEffect, useState } from "react";
import { Device } from "@/store/atoms";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import StackCard from "@/components/dashboard/layout/StackCard";
import DeviceCard from "@/components/dashboard/cards/DeviceCard";
import AddPhoneCard from "@/components/dashboard/cards/AddPhoneCard";
import AddTokenCard from "@/components/dashboard/cards/AddTokenCard";
import { useTrips } from "@/hooks/useTrips";
import ActiveTripCard from "@/components/dashboard/cards/trips/ActiveTripCard";
import StartTripCard from "@/components/dashboard/cards/trips/StartTripCard";


export default function TrackablePage({
  params,
}: {
  params: Promise<{ trackableId: string }>;
}) {
  const { trackableId } = use(params);
  const apiClient = useDashboardApiClient();
  const [devices, setDevices] = useState<Device[]>([]);
  const { data: trips } = useTrips(trackableId);

  // Load devices
  useEffect(() => {
    async function load() {
      const res = await apiClient.get<Device[]>(
        `/api/trackables/${trackableId}/devices`
      );
      setDevices(res);
    }
    load();
  }, [trackableId]);

  const activeTrip = trips?.filter((t) => t.endDate == null)?.[0];

  return (
    <>
      {activeTrip && (
        <StackCard columns={1}>
          {activeTrip ? (
            <ActiveTripCard trip={activeTrip} key={activeTrip.slug} />
          ) : (
            <StartTripCard trackableId={trackableId} />
          )}
        </StackCard>
      )}
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
