import { Marker } from "@/store/atoms";
import { useState } from "react";
import { FaPen, FaArrowLeft, FaTrash, FaFloppyDisk, FaMapPin } from "react-icons/fa6";
import TextInput from "../../input/TextInput";
import TextArea from "../../input/TextArea";
import MarkerImage from "./MarkerImage";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import ConfirmDialog from "../../layout/ConfirmDialog";
import { PrimaryButton, SecondaryButton } from "@snapiter/designsystem";

interface MarkerCardProps {
  marker: Marker;
  onDelete: (markerId: string) => void;
}

export default function MarkerCard({ marker, onDelete }: MarkerCardProps) {
  const apiClient = useDashboardApiClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(marker);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await apiClient.put<Marker>(
        `/api/trackables/${marker.trackableId}/markers/${marker.markerId}`,
        {
          title: formData.title ?? "",
          description: formData.description ?? "",
        }
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save marker:", err);
    }
  };


  const handleDelete = async () => {
    try {
      await apiClient.delete(
        `/api/trackables/${marker.trackableId}/markers/${marker.markerId}`
      );
      setIsEditing(false);
      onDelete(marker.markerId);
    } catch (err) {
      console.error("Failed to delete marker:", err);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="">
        {showConfirm && (
        <ConfirmDialog
          message="This will permanently delete the marker. Do you want to continue?"
          confirmText="Yes, delete"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          icon={<FaTrash />}
        />
      )}

      {isEditing ? (
        <div className="space-y-3">
          {/* Top bar with back + delete */}
          <div className="flex items-center justify-between">
            <SecondaryButton icon={<FaArrowLeft />} onClick={() => setIsEditing(false)} />
            <SecondaryButton icon={<FaTrash />} onClick={handleDelete} />
          </div>

          <TextInput
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="Title (optional)"
          />

          <TextArea
            id="description"
            name="description"
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
            <h3>{marker.title}</h3>
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
