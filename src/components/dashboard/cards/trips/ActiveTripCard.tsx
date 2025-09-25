import { Trip } from "@/store/atoms";
import Card from "../Card";
import PrimaryButton from "../../buttons/PrimaryButton";
import { FaX } from "react-icons/fa6";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { formatTripDate } from "@/utils/formatTripDate";
import { useState } from "react";
import ConfirmDialog from "../../layout/ConfirmDialog";

interface ActiveTripCardProps {
    trip: Trip;
}

export default function ActiveTripCard({ trip }: ActiveTripCardProps) {
    const [isActive, setIsActive] = useState(trip.endDate == null);
    const apiClient = useDashboardApiClient();

    const [showConfirm, setShowConfirm] = useState(false);
    const handleStop = async () => {
        await apiClient.put(`/api/trackables/${trip.trackableId}/trips/${trip.slug}`, {
            endDate: new Date().toISOString(),
        });
        setIsActive(false);
    };

    if(!isActive) return <></>;

    return (
        <>
        {showConfirm && (
            <ConfirmDialog
              message="Do you want to stop your trip?"
              confirmText="Yes, stop"
              onConfirm={handleStop}
              onCancel={() => setShowConfirm(false)}
              icon={<FaX />}
            />
          )}
          
        <Card className="animate-border-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <h3>Trip: {trip.title}</h3>
                    <span className="text-sm text-muted">This is your active trip</span>
                    <p className="text-sm text-muted">
                        {formatTripDate(trip.startDate, trip.endDate)}
                    </p>
                </div>
                <PrimaryButton
                    text="Stop Trip"
                    icon={<FaX size={18} />}
                    onClick={() => setShowConfirm(true)}
                />
            </div>
        </Card>
        </>
    );
}
