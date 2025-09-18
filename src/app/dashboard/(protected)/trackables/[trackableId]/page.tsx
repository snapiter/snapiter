"use client";

import { use, useEffect, useState } from "react";
import { FaKey, FaQrcode } from "react-icons/fa6";
import { Device } from "@/store/atoms";
import { useApiClient } from "@/hooks/dashboard/useApiClient";
import Modal from "@/components/dashboard/modal"; // adjust import to your modal

type QuickCreateRes = {
  deviceToken: string;
  qrDataUrl?: string;
};

export default function TrackablePage({
  params,
}: {
  params: Promise<{ trackableId: string }>;
}) {
  const { trackableId } = use(params);
  const apiClient = useApiClient();
  const [devices, setDevices] = useState<Device[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<QuickCreateRes | null>(null);
  const [mode, setMode] = useState<"phone" | "token" | null>(null);

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

  async function addPhone() {
    const res = await apiClient.post<QuickCreateRes>(
      `/api/trackables/${trackableId}/devices/token`,
      {}
    );
    setMode("phone");
    setModalContent(res);
    setModalOpen(true);
  }

  async function createToken() {
    const res = await apiClient.post<QuickCreateRes>(
      `/api/trackables/${trackableId}/devices/token`,
      {}
    );
    setMode("token");
    setModalContent(res);
    setModalOpen(true);
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
                    Last reported: {new Date(d.lastReportedAt).toLocaleString()}
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

      {/* Actions */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={addPhone}
          className="flex flex-col cursor-pointer items-center justify-center gap-3 p-6 rounded-lg border border-border bg-surface hover:shadow-lg transition"
        >
          <FaQrcode className="w-24 h-24 text-primary" />
          <span className="font-medium">Add a Phone</span>
          <p className="text-sm text-muted text-center">
            Scan a QR code to register your phone instantly
          </p>
        </button>

        <button
          onClick={createToken}
          className="flex flex-col cursor-pointer items-center justify-center gap-3 p-6 rounded-lg border border-border bg-surface hover:shadow-lg transition"
        >
          <FaKey className="w-24 h-24 text-primary" />
          <span className="font-medium">Create Token</span>
          <p className="text-sm text-muted text-center">
            Generate a token for other devices
          </p>
        </button>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent && mode === "phone" && modalContent.qrDataUrl && (
          <div className="flex flex-col items-center gap-4 p-6">
            <h2 className="text-lg font-semibold">Scan this QR with your phone</h2>
            <img
              src={modalContent.qrDataUrl}
              alt="QR code"
              className="w-62 h-62"
            />
          </div>
        )}

        {modalContent && mode === "token" && (
          <div className="flex flex-col items-center gap-4 p-6">
            <h2 className="text-lg font-semibold">Your Device Token</h2>
            <p className="text-sm text-muted">Copy this token and share it with other devices to register them. It is only shown once</p>
            <code className="px-3 py-2 rounded bg-surface border border-border text-sm">
              {modalContent.deviceToken}
            </code>
          </div>
        )}
      </Modal>
    </div>
  );
}
