import Card from "./Card";
import { useTrackable } from "@/hooks/useTrackable";
import { FaGlobe } from "react-icons/fa6";
import { SecondaryButton } from "@snapiter/designsystem";

interface TrackableCardProps {
    trackableId: string;
}

export default function TrackableCard({ trackableId }: TrackableCardProps) {
    const { data: trackable } = useTrackable(trackableId);
    if (!trackable) return null;

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <h3>
                        {trackable.title}
                    </h3>

                    <p className="text-sm text-muted">{trackable.hostName}</p>
                </div>
                <SecondaryButton
                    text="Visit Website"
                    icon={<FaGlobe />}
                    onClick={() => window.open(`https://${trackable.hostName}`, "_blank")}
                />
            </div>
        </Card>
    );
}