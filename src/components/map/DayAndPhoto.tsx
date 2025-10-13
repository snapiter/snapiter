import { FaCamera, FaRegCalendar } from "react-icons/fa6";
import { formatTripDate } from "@/utils/formatTripDate";

export default function ({
  startDate,
  endDate,
  markersLength,
}: {
  startDate: string;
  endDate: string;
  markersLength: number;
}) {
  return (
    <p className="mt-2 text-foreground flex items-center space-x-4 text-sm">
      {/* Duration */}
      <span className="flex items-center space-x-1 text-muted">
        <FaRegCalendar className="w-4 h-4" />
        <span>{formatTripDate(startDate, endDate)}</span>
      </span>

      {/* Photos (only if selected & has photos) */}
      {markersLength > 0 && (
        <span className="flex items-center space-x-1 text-muted">
          <FaCamera className="w-4 h-4" />
          <span>{markersLength}</span>
        </span>
      )}
    </p>
  );
}
