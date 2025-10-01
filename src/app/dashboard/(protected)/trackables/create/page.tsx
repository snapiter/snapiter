"use client";

import { useState } from "react";
import { PrimaryButton } from "@snapiter/designsystem";
import { FaFloppyDisk } from "react-icons/fa6";
import TextInput from "@/components/dashboard/input/TextInput";
import Card from "@/components/dashboard/cards/Card";
import StackCard from "@/components/dashboard/layout/StackCard";
import { useCreateTrackable } from "@/hooks/dashboard/trackables/useCreateTrackable";
import { useRouter } from "next/navigation";

type TrackableRequest = {
  name: string;
  title: string;
  hostName: string;
};

export default function CreateTrackablePage() {
  const router = useRouter();
  const createTrackable = useCreateTrackable();
  const [form, setForm] = useState<TrackableRequest>({
    name: "",
    title: "",
    hostName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="items-center flex flex-col">
      <StackCard columns={1}>
        <Card title="Create Trackable">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (e.currentTarget.checkValidity()) {
              createTrackable.mutate(form, {
                onSuccess: () => router.push("/dashboard"),
              });
            }
          }}
          className="space-y-3 w-96"
        >
            <TextInput
              required
              id="name"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Name"
            />

            <TextInput
              id="title"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              placeholder="Title"
            />

            <TextInput
              id="hostName"
              name="hostName"
              value={form.hostName || ""}
              onChange={handleChange}
              placeholder="snapiter.com"
            />

            <PrimaryButton text="Create" icon={<FaFloppyDisk />} type="submit" />
          </form>
        </Card>
      </StackCard>
    </div>
  );
}