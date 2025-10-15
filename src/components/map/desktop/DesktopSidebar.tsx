import { useSelectedTrip } from "@/hooks/trips/useSelectedTrip";
import { useTripsByHostname } from "@/hooks/trips/useTripsByHostname";
import DesktopMarkerMenu from "./DesktopMarkerMenu";
import DesktopTripMenu from "./DesktopTripMenu";

export default function DesktopSidebar() {
  const { trips } = useTripsByHostname();
  const { trip: selectedTrip } = useSelectedTrip();

  if (selectedTrip === undefined) {
    return null;
  }

  if (trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted">
          <p>No trips found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full hidden md:block md:w-1/2 lg:w-2/5">
      <div className="flex h-full">
          <DesktopTripMenu />
          <DesktopMarkerMenu />
      </div>
    </div>
  );
}
