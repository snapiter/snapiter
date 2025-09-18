import { useState, useEffect } from "react";
import Modal from "@/components/dashboard/modal";
import apiClient from "@/utils/apiClient";
import { Device, Trackable } from "@/store/atoms";

type QuickCreateRes = {
  deviceToken: string;
  qrDataUrl: string;
};

export default function TrackableItem({ t, devices }: { t: Trackable, devices: Device[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickCreate, setQuickCreate] = useState<QuickCreateRes | null>(null);
  const [error, setError] = useState<string | null>(null);

  // fetch device data when modal opens
  useEffect(() => {
    if (!modalOpen) {
      setQuickCreate(null);
      setError(null);
      return;
    }

    async function fetchQuickCreate() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.post<QuickCreateRes>(`/api/trackables/${t.trackableId}/devices`)
        setQuickCreate(res);
      } catch (err: any) {
        setError(err.message || "Failed to create device");
      } finally {
        setLoading(false);
      }
    }

    fetchQuickCreate();
  }, [modalOpen, t.trackableId]);

  return (
    <li
      key={t.name}
      className="p-4 border border-border rounded-lg shadow-sm bg-background hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-muted">{t.hostName}</p>
        </div>
        <span className="text-sm text-muted">
          {devices.length ?? 0} devices
        </span>
      </div>

      <div className="mt-3">
        {devices.length > 0 && (
          <ul className="space-y-2">
            {devices.map((d) => (
              <li
                key={d.deviceId}
                className="rounded border border-border bg-surface px-3 py-2 text-sm"
              >
                {d.deviceId}
              </li>
            ))}
          </ul>
        ) }

<button
            type="button"
            className="mt-2 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover"
            onClick={() => setModalOpen(true)}
          >
            + Add device
          </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Register Device</h3>

        {loading && <p className="text-sm text-muted">Creating device…</p>}

        {error && (
          <p className="text-sm text-red-600">Error: {error}</p>
        )}

        {quickCreate && (
          <div className="space-y-4">
            <p className="text-sm">
              Scan this QR code to register your device:
            </p>
            <img
              src={quickCreate.qrDataUrl}
              alt="Device QR Code"
              className="mx-auto rounded border"
            />
            <p className="text-xs text-muted break-all">
              Token: {quickCreate.deviceToken}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded border px-3 py-1.5 text-sm"
          >
            Close
          </button>
        </div>
      </Modal>
    </li>
  );
}
