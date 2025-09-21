"use client";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { Trip } from "@/store/atoms";
import { use, useEffect, useState } from "react";

export default function TripsPage({
    params,
}: {
    params: Promise<{ trackableId: string }>;
}) {
    const { trackableId } = use(params);
    const apiClient = useDashboardApiClient();
    const [trips, setTrips] = useState<Trip[]>([]);
    useEffect(() => {
        async function load() {
            const res = await apiClient.get<Trip[]>(
                `/api/trackables/${trackableId}/trips`
            );
            setTrips(res);
        }
        load();
    }, [trackableId]);

    return (
        <div>
            <h1>Trips</h1>
        </div>
    );
}