"use client";

import { FaVanShuttle } from "react-icons/fa6";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import { useState } from "react";
import Card from "../Card";
import PrimaryButton from "../../buttons/PrimaryButton";
import TextInput from "../../input/TextInput";
import TextArea from "../../input/TextArea";
import { useRouter } from "next/navigation";
import { slugify } from "@/utils/slugify";

interface StartTripCardProps {
    trackableId: string;
}
export default function StartTripCard({ trackableId }: StartTripCardProps) {
    const router = useRouter();

    const apiClient = useDashboardApiClient();
    const [form, setForm] = useState({
        title: "",
        description: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            await apiClient.post<void>(`/api/trackables/${trackableId}/trips`, {
                ...form,
                slug: slugify(form.title),
                startDate: new Date().toISOString(),
            });
        } catch (err: any) {
            console.error(err);
        } finally {
            router.replace("/dashboard/trackables/" + trackableId + "/trips/" + slugify(form.title));
        }
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
