import { Marker } from "@/store/atoms";
import { useState } from "react";
import { FaPen, FaArrowLeft, FaTrash, FaFloppyDisk, FaMapPin } from "react-icons/fa6";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import TextInput from "../TextInput";
import TextArea from "../TextArea";
import MarkerImage from "./MarkerImage";

interface MarkerCardProps {
    marker: Marker;
}

export default function MarkerCard({ marker }: MarkerCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(marker);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleDelete = () => {
        setIsEditing(false);
    };

    
    return (
        <div className="">
            {isEditing ? (
                <div className="space-y-3">
                    {/* Top bar with back + delete */}
                    <div className="flex items-center justify-between">
                        <SecondaryButton icon={<FaArrowLeft />} onClick={() => setIsEditing(false)} />

                        <SecondaryButton icon={<FaTrash />} onClick={() => handleDelete()} />
                    </div>
                    <TextInput
                        id="title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        placeholder="Title (optional)"
                    />
                    <TextArea
                        id="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        placeholder="Description (optional)"
                    />

                    <PrimaryButton text="Save" icon={<FaFloppyDisk />} onClick={handleSave} />
                </div>
            ) : (
                <div className="space-y-2">
                    <div
                        className="group relative h-40 w-full cursor-pointer [perspective:1000px]"
                        onClick={() => setIsEditing(true)}
                    >
                        <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                            <div className="absolute inset-0 rounded bg-background [backface-visibility:hidden]">
                                <MarkerImage marker={marker} />
                            </div>

                            {/* Back (edit icon) */}
                            <div className="absolute inset-0 flex items-center justify-center rounded bg-black/80 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                <FaPen size={40} className="text-primary" />
                            </div>
                        </div>
                    </div>

                    {marker.title && (
                        <h3 className="font-semibold text-foreground">
                            {marker.title}
                        </h3>
                    )}

                    {marker.description && (
                        <p className="text-sm text-muted">{marker.description}</p>
                    )}

                    <p className="text-xs text-muted flex gap-1">
                        <FaMapPin className="text-primary" /> {marker.latitude}, {marker.longitude}
                    </p>
                </div>
            )}
        </div>
    );
}
