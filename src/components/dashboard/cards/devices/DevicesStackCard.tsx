"use client";

import StackCard from "@/components/dashboard/layout/StackCard";
import DeviceCard from "@/components/dashboard/cards/devices/DeviceCard";
import AddPhoneCard from "@/components/dashboard/cards/AddPhoneCard";
import AddTokenCard from "@/components/dashboard/cards/AddTokenCard";
import { useDevices } from "@/hooks/dashboard/useDevices";

export default function DevicesStackCard({
  trackableId,
}: {
  trackableId: string;
}) {

  const { data: devices } = useDevices(trackableId);

  return (
    <>
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
