"use client";
import { use } from "react";
import { useTripWithPosition } from "@/hooks/useTripWithPosition";
import Card from "@/components/dashboard/Card";
import StackCard from "@/components/dashboard/StackCard";
export default function TripsPage({
  params,
}: {
  params: Promise<{ trackableId: string; tripId: string }>;
}) {
  const { trackableId, tripId } = use(params);
  const { data: trip, isLoading, isError } = useTripWithPosition(
    trackableId,
    tripId
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError || !trip) return <p>Something went wrong.</p>;

  return (
    <StackCard columns={2}>
      <Card title={trip.title} description={trip.description}>
        <p>Slug: {trip.slug}</p>
        <p>Positions loaded: {trip.positions.length}</p>
      </Card>

      <Card title="Random Title" description="Some random description">
        <p>Just a placeholder card.</p>
      </Card>
    </StackCard>
  );
}
