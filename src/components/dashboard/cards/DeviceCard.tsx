"use client";
import { Device } from "@/store/atoms";
import { formatDate } from "@/utils/formatTripDate";
import { FaMobileScreen, FaTrash } from "react-icons/fa6";
import Card from "./Card";
import SecondaryButton from "../buttons/SecondaryButton";
import { useState } from "react";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import ConfirmDialog from "../layout/ConfirmDialog";

interface CardProps {
    device: Device;
}

export default function DeviceCard({ device }: CardProps) {
    const [isActive, setIsActive] = useState(true);
    const apiClient = useDashboardApiClient();

    const [showConfirm, setShowConfirm] = useState(false);

    const handleRevoke = async () => {
        await apiClient.delete(`/api/trackables/${device.trackableId}/devices/${device.deviceId}`);
        setIsActive(false);
    };

    if(!isActive) return <></>;

    

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

                {/* Right side: device ID */}
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
