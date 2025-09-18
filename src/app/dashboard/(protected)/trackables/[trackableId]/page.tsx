"use client";

import { use, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Device } from "@/store/atoms";
import { useApiClient } from "@/hooks/dashboard/useApiClient";


export default function TrackablePage({
  params,
}: {
  params: Promise<{ trackableId: string }>;
}) {
  const { trackableId } = use(params);
  const apiClient = useApiClient();
  const [devices, setDevices] = useState<Device[]>([]);

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

  async function addDevice() {
    const res = await apiClient.post<Device>(
      `/api/trackables/${trackableId}/devices`,
      {}
    );
    setDevices((prev) => [...prev, res]);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devices</h1>
        <span className="text-muted">
          {devices.length} registered {devices.length === 1 ? "device" : "devices"}
        </span>
      </div>

      {/* Device List */}
      {devices.length > 0 ? (
        <ul className="space-y-4">
          {devices.map((d) => (
            <li
              key={d.deviceId}
              className="p-4 border border-border rounded-lg bg-surface shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-muted">
                    Last reported:{" "}
                    {new Date(d.lastReportedAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs text-muted">ID: {d.deviceId}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No devices registered yet.</p>
      )}

      {/* Add Device Button */}
      <div className="pt-4">
        <button
          onClick={addDevice}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition"
        >
          <FaPlus className="w-4 h-4" />
          Add Device
        </button>
      </div>
    </div>
  );
}
