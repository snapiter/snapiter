"use client";

import { use } from "react";
import { useState } from "react";
import Card from "@/components/dashboard/cards/Card";
import StackCard from "@/components/dashboard/layout/StackCard";
import { useRouter } from "next/navigation";
import { useDashboardApiClient } from "@/hooks/dashboard/useDashboardApiClient";
import TextInput from "@/components/dashboard/input/TextInput";
import TextArea from "@/components/dashboard/input/TextArea";

export default function TripsCreatePage({
  params,
}: {
  params: Promise<{ trackableId: string }>;
}) {
    const router = useRouter();
  const { trackableId } = use(params);
  const [form, setForm] = useState({
    title: "",
    description: "",
    slug: "",
    startDate: "",
    endDate: "",
    color: "#760aff",
    animationSpeed: 10000,
    positionType: "ALL",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const apiClient = useDashboardApiClient()
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {

      await apiClient.post<void>(`/api/trackables/${trackableId}/trips`, form);
      router.replace("/dashboard/trackables/" + trackableId + "/trips/" + form.slug);
      router.refresh();
      setMessage("Trip created successfully!");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StackCard columns={1}>
      <Card>
        <h2 className="text-lg font-bold mb-4">Create Trip</h2>
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
          <TextInput
            id="slug"
            placeholder="Readable Slug"
            value={form.slug}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2">
            <TextInput
              type="datetime-local"
              id="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
            <TextInput
              type="datetime-local"
              id="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Color</label>
            <TextInput
              type="color"
              id="color"
              value={form.color}
              onChange={handleChange}
              className="w-10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-foreground px-4 py-2 rounded hover:bg-primary-hover"
          >
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </Card>
    </StackCard>
  );
}
