"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TrackableCard from "@/components/dashboard/cards/trackable/TrackableCard";
import Main from "@/components/dashboard/layout/Main";
import Menu from "@/components/dashboard/layout/Menu";
import { useTrackables } from "@/hooks/dashboard/trackables/useTrackables";
import { createTrackableMenuItem } from "./menu";

export default function Dashboard() {
  const { data: trackables, isFetched } = useTrackables();

  const router = useRouter();

  useEffect(() => {
    if (!isFetched) return;

    async function load() {
      try {
        if (trackables.length === 0) {
          router.replace("/dashboard/trackables/create");
          return;
        }

        if (trackables.length === 1) {
          router.replace("/dashboard/trackables/" + trackables[0].trackableId);
          return;
        }
      } catch (err) {
        console.error("Failed to load trackables:", err);
      }
    }
    load();
  }, [trackables, isFetched]);

  return (
    <div className="flex flex-1 relative">
      <Menu items={[createTrackableMenuItem]} />
      <Main>
        <h1 className="text-2xl font-bold  mb-6">Trackables</h1>
        <ul className="space-y-4">
          {trackables &&
            trackables.length > 0 &&
            trackables.map((t) => <TrackableCard key={t.trackableId} t={t} />)}
        </ul>
      </Main>
    </div>
  );
}
