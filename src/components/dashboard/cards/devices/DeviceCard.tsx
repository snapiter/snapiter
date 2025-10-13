"use client";
import { SecondaryButton } from "@snapiter/designsystem";
import { useState } from "react";
import { FaMobileScreen, FaTrash } from "react-icons/fa6";
import { useDeleteDevice } from "@/hooks/dashboard/useDeleteDevice";
import type { Device } from "@/store/atoms";
import { formatDate } from "@/utils/formatTripDate";
import ConfirmDialog from "../../layout/ConfirmDialog";
import Card from "../Card";

interface CardProps {
  device: Device;
}

export default function DeviceCard({ device }: CardProps) {
  const deleteDevice = useDeleteDevice();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleRevoke = async () => {
    deleteDevice.mutate({ trackableId: device.trackableId, device });
  };

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          message="This will revoke the device, it will no longer be able to report positions. Do you want to continue?"
          confirmText="Yes, revoke"
          onConfirm={handleRevoke}
          onCancel={() => setShowConfirm(false)}
          icon={<FaTrash />}
        />
      )}
      <Card>
        <div className="flex items-center justify-between rounded-md bg-lightest">
          <div className="flex items-start gap-3">
            <FaMobileScreen className="w-10 h-10 text-primary mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Phone: {device.name}
              </h3>
              <p className="text-sm text-muted">
                Last reported: {formatDate(new Date(device.lastReportedAt))}
              </p>
              <p className="text-xs text-muted">ID: {device.deviceId}</p>
            </div>
          </div>

          <span className="text-xs text-muted whitespace-nowrap">
            <SecondaryButton
              text="Revoke device"
              icon={<FaTrash size={18} />}
              onClick={() => setShowConfirm(true)}
            />
          </span>
        </div>
      </Card>
    </>
  );
}
