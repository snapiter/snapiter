"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/config";
import { apiClient } from "@/utils/apiClient";

export type Trackable = {
  name: string;
  websiteTitle: string;
  website: string;
  hostName: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [trackables, setTrackables] = useState<Trackable[] | null>(null);

  useEffect(() => {
    async function load() {
      const res = await apiClient.request<Trackable[]>("/api/trackables", { cache: "no-store" });
      if (res.length === 0) {
        router.replace("/trackables/create");
      } else {
        setTrackables(res);
      }
    }
    load();
  }, [router]);

  if (trackables === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trackables</h1>
      <ul className="space-y-4">
        {trackables.map((t) => (
          <li
            key={t.name}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {t.websiteTitle}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{t.hostName}</p>
            <a
              href={t.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Visit Website →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
