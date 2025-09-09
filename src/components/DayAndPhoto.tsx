import { formatDate } from "@/utils/formatDate";
import { FaRegCalendar, FaCamera } from "react-icons/fa6";

export default function ({ startDate, endDate, isSelected, markersLength }: { startDate: string, endDate: string, isSelected: boolean, markersLength: number }) {
    return (
        <p className="mt-2 text-foreground flex items-center space-x-4 text-sm">
            {/* Duration */}
            <span className="flex items-center space-x-1 text-muted">
                <FaRegCalendar className="w-4 h-4" />
                <span>{formatDate(startDate, endDate)}</span>
            </span>

            {/* Photos (only if selected & has photos) */}
            {isSelected && markersLength > 0 && (
                <span className="flex items-center space-x-1 text-muted">
                    <FaCamera className="w-4 h-4" />
                    <span>{markersLength}</span>
                </span>
            )}
        </p>
    )
}