"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trackable } from "@/store/atoms";
import TrackableItem from "@/components/dashboard/Trackable/TrackableItem";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";


export default function Dashboard() {
  const apiClient = useDashboardApiClient()

  const router = useRouter();
  const [trackables, setTrackables] = useState<Trackable[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get<Trackable[]>("/api/trackables")

        if (res.length === 0) {
          router.replace("/dashboard/trackables/create")
          return
        }

        if (res.length === 1) {
          router.replace("/dashboard/trackables/" + res[0].trackableId)
          return
        }

        setTrackables(res)
      } catch (err) {
        console.error("Failed to load trackables:", err)
      }
    }
    load()
  }, [router])

  if (trackables === null) {
    return <></>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold  mb-6">Trackables</h1>
      <ul className="space-y-4">
        {trackables && trackables.length > 0 && trackables.map((t) => (
          <TrackableItem key={t.trackableId} t={t} />
        ))}
      </ul>
    </div>
  );
}
