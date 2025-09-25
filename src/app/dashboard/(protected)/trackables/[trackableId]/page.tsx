"use client";

import { use, useEffect, useState } from "react";
import { FaKey, FaQrcode } from "react-icons/fa6";
import { Device } from "@/store/atoms";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import Modal from "@/components/dashboard/layout/Modal";
import ActionCard from "@/components/dashboard/cards/ActionCard";
import StackCard from "@/components/dashboard/layout/StackCard";
import DeviceCard from "@/components/dashboard/cards/DeviceCard";

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
    <>
      {devices.length > 0 && (
        <StackCard columns={1}>
            {devices.map((d) => (
                <DeviceCard device={d} key={d.deviceId} />
            ))}
        </StackCard>
      )}
      <StackCard columns={2}>
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
      </StackCard>

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
    </>
  );
}
