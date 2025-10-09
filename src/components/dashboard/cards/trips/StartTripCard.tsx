"use client";

import { FaVanShuttle } from "react-icons/fa6";
import { useState } from "react";
import Card from "../Card";
import { PrimaryButton } from "@snapiter/designsystem";
import TextInput from "../../input/TextInput";
import TextArea from "../../input/TextArea";
import { useRouter } from "next/navigation";
import { useCreateTrip } from "@/hooks/dashboard/trips/useCreateTrip";

interface StartTripCardProps {
    trackableId: string;
}
export default function StartTripCard({ trackableId }: StartTripCardProps) {
    const router = useRouter();
    const createTrip = useCreateTrip();

    const [form, setForm] = useState({
        title: "",
        description: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createTrip.mutate(
            {
                trackableId,
                title: form.title,
                description: form.description
            },
            {
                onSuccess: (payload) => {
                    router.replace(`/dashboard/trackables/${trackableId}/trips/${payload.slug}`);
                },
            }
        );
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Card title="Time to start a new trip?">
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    id="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <TextArea
                    id="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />
                <PrimaryButton
                    text="Start a new Trip"
                    icon={<FaVanShuttle size={18} />}
                    type="submit"
                />
            </form>
        </Card>
    );
}
