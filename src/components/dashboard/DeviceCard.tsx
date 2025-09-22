import { Device } from "@/store/atoms";
import { formatDate } from "@/utils/formatTripDate";
import { FaMobileScreen } from "react-icons/fa6";
import Card from "./Card";

interface CardProps {
    device: Device;
}

export default function DeviceCard({ device }: CardProps) {
    return (
        <Card>
            <div className="flex items-center justify-between rounded-md bg-lightest">
                <div className="flex items-start gap-3">
                    <FaMobileScreen className="w-10 h-10 text-primary mt-1" />
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">
                            {device.name}
                        </h3>
                        <p className="text-sm text-muted">
                            Last reported: {formatDate(new Date(device.lastReportedAt))}
                        </p>
                    </div>
                </div>

                {/* Right side: device ID */}
                <span className="text-xs text-muted whitespace-nowrap">
                    ID: {device.deviceId}
                </span>
            </div>
        </Card>
    );
}
