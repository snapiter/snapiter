"use client";

import { use, useEffect, useState } from "react";
import { FaKey, FaQrcode } from "react-icons/fa6";
import { Device } from "@/store/atoms";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import Modal from "@/components/dashboard/modal"; // adjust import to your modal
import Card from "@/components/dashboard/Card";
import ActionCard from "@/components/dashboard/ActionCard";

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
  const apiClient = useDashboardApiClient();
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
    <div className="">
      {/* Header */}
      {/* Device List */}
      {devices.length > 0 ? (
          <Card title="Devices" description={`${devices.length} registered ${devices.length === 1 ? "device" : "devices"}`}>

<ul className="space-y-4 border-t border-border pt-4">
          {devices.map((d) => (
            <li
              key={d.deviceId}
              className=""
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
        </Card>
      ) : (
        <p className="text-muted">No devices registered yet.</p>
      )}

      {/* Actions */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
      onClick={addPhone}
      icon={<FaQrcode className="w-24 h-24" />}
      title="Add a Phone"
      description="Scan a QR code to register your phone instantly"
    />
        <ActionCard
      onClick={createToken}
      icon={<FaKey className="w-24 h-24" />}
      title="Create Token"
      description="Generate a token for other devices"
    />
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
