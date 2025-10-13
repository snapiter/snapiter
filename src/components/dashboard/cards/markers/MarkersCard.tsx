import { useEffect, useState } from "react";
import type { Marker } from "@/store/atoms";
import Card from "../Card";
import MarkerCard from "./MarkerCard";

interface MarkersCardProps {
  markers: Marker[];
}

export default function MarkersCard({ markers }: MarkersCardProps) {
  const [localMarkers, setLocalMarkers] = useState<Marker[]>(markers);

  // Make localmarkers, inside MarkerCard you could delete, and if that works i only want a visual removal update
  useEffect(() => {
    setLocalMarkers(markers);
  }, [markers]);

  if (localMarkers.length === 0) return null;

  const handleDelete = (id: string) => {
    setLocalMarkers((prev) => prev.filter((m) => m.markerId !== id));
  };

  return (
    <Card title="Markers">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {localMarkers.map((marker) => (
          <MarkerCard
            key={marker.markerId}
            marker={marker}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </Card>
  );
}
