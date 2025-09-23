import { Marker } from "@/store/atoms";
import Card from "./Card";

interface CardProps {
    markers: Marker[];
}

export default function MarkerCard({ markers }: CardProps) {
    if (markers.length === 0) {
        return <></>;
    }

    return (
        <Card title="Markers">
            {markers.map((marker) => (
                <div key={marker.markerId}>
                    <p>{marker.latitude}, {marker.longitude}</p>
                </div>
            ))}
        </Card>
    );
}
