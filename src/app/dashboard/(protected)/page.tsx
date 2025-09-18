"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import { Device, Trackable } from "@/store/atoms";
import TrackableItem from "@/components/dashboard/Trackable/TrackableItem";


export default function Dashboard() {
  const router = useRouter();
  const [trackables, setTrackables] = useState<Trackable[] | null>(null);
  const [devicesByTrackable, setDevicesByTrackable] = useState<Record<string, Device[]> | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.request<Trackable[]>("/api/trackables");
        // If nothing, create a new trackable
        if (res.length === 0) {
          router.replace("/dashboard/trackables/create");
        }
        // If there is 1 trackable automaticaly go to that page
        if (res.length === 1) {
          router.replace("/dashboard/trackables/" + res[0].trackableId);
        }
        
        // Show a list of trakcables.
        setTrackables(res);
      } catch (err: any) {
        console.error("Failed to load trackables:", err?.response);
      }
    }
    load();
  }, [router]);

  useEffect(() => {
    // only load devices if there are enough trakcables
    if(trackables === null || trackables.length === 0 || trackables.length === 1) return;

    async function loadDevices() {
      trackables?.forEach(async (trackable) => {
        const res = await apiClient.request<Device[]>("/api/trackables/" + trackable.trackableId + "/devices");
        setDevicesByTrackable((prev) => ({
          ...prev,
          [trackable.trackableId]: res,
        }));
      });
    }
    loadDevices();
  }, [trackables]);

  if (trackables === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold  mb-6">Trackables</h1>
      <ul className="space-y-4">
        {trackables.map((t) => (
          <TrackableItem key={t.trackableId} t={t} devices={devicesByTrackable?.[t.trackableId] || []} />
        ))}
      </ul>
    </div>
  );
}
