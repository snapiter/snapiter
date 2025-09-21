"use client";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { Trip } from "@/store/atoms";
import { use, useEffect, useState } from "react";
import Card from "@/components/dashboard/Card";

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
    <>
      <Card
        title="Trips"
        description={`${trips.length} trips found.`}
      >
      </Card>
      {trips.map((trip) => (
        <Card
          key={trip.slug}
          title={trip.title}
          description={trip.description}
        >
          <div className="text-sm text-muted">
            <p>
              <span className="font-medium">Start:</span>{" "}
              {new Date(trip.startDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">End:</span>{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </>
  );
} 
