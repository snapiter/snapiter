import { Marker } from "@/store/atoms";
import Card from "../Card";
import MarkerCard from "./MarkerCard";

interface MarkerCardProps {
  markers: Marker[];
}

export default function MarkersCard({ markers }: MarkerCardProps) {
  if (markers.length === 0) return null;

  return (
    <Card title="Markers">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {markers.map((marker) => (
          <MarkerCard  key={marker.markerId} marker={marker} onDelete={(id) => {}} />
        ))}
      </div>
    </Card>
  );
}
