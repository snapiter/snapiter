"use client";

import { useState, useEffect } from "react";
import Card from "../Card";
import { PrimaryButton } from "@snapiter/designsystem";
import TextInput from "../../input/TextInput";
import TextArea from "../../input/TextArea";
import { useRouter } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { Trip } from "@/store/atoms";
import { SpeedSlider } from "../../input/SpeedSlider";
import { useUpdateTrip } from "@/hooks/dashboard/trips/useUpdateTrip";

interface EditTripCardProps {
    trackableId: string;
    trip: Trip;
}

export default function EditTripCard({ trackableId, trip }: EditTripCardProps) {
    const router = useRouter();
    const [form, setForm] = useState<Trip | null>({
        ...trip,
        animationSpeed: trip.animationSpeed ? trip.animationSpeed / 1000 : 10000,
    });

    const updateTrip = useUpdateTrip();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) =>
            prev ? { ...prev, [name]: name === "animationSpeed" ? Number(value) : value } : prev
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;
    
        updateTrip.mutate(
          {
            trackableId,
            originalSlug: trip.slug,
            trip: {
              ...form,
              animationSpeed: form.animationSpeed ? form.animationSpeed * 1000 : 10000,
              slug: slugify(form.title),
            },
          },
          {
            onSuccess: () => {
              router.replace(
                `/dashboard/trackables/${trackableId}/trips/${slugify(form.title)}`
              );
            },
            onError: (err) => {
              console.error("Failed to update trip", err);
            },
          }
        );
      };

    if (!form) return <></>;

    return (
        <Card title="Edit Trip">
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    id="title"
                    name="title"
                    label="Title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <TextArea
                    id="description"
                    name="description"
                    label="Description"
                    placeholder="Description"
                    value={form.description ?? ""}
                    onChange={handleChange}
                />

                <TextInput
                    id="color"
                    name="color"
                    label="Color"
                    type="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-20 rounded-md border border-border"
                />

                <SpeedSlider
                    value={form.animationSpeed ?? 0}
                    onChange={(val) =>
                        setForm((prev) => (prev ? { ...prev, animationSpeed: val } : prev))
                    }
                />

                <PrimaryButton
                    text="Save Changes"
                    icon={<FaRegFloppyDisk size={18} />}
                    type="submit"
                />
            </form>
        </Card>
    );
}
