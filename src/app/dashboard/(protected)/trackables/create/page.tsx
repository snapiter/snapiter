"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Trackable } from "@/store/atoms";
import { useApiClient } from "@/hooks/dashboard/useApiClient";

type TrackableRequest = {
  name: string;
  title: string;
  hostName: string;
};

export default function CreateTrackablePage() {
  const router = useRouter();
  const [form, setForm] = useState<TrackableRequest>({
    name: "",
    title: "",
    hostName: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TrackableRequest, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const apiClient = useApiClient()

  
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
  
    // simple required validation
    const req: (keyof TrackableRequest)[] = ["name", "title", "hostName"];
    const nextErrors: Partial<Record<keyof TrackableRequest, string>> = {};
    for (const key of req) {
      if (!form[key].trim()) nextErrors[key] = "Required";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
  
    setSubmitting(true);
    try {
      const res = await apiClient.post<Trackable>("/api/trackables", form);
      router.replace("/dashboard/trackables/" + res.trackableId);
      router.refresh();
    } catch (err: any) {
      // apiClient.request throws with err.response attached
      const res: Response | undefined = err?.response;
  
      if (res) {
        // 401 redirect to /dashboard/auth is already handled inside apiClient
        let message = `${res.status} ${res.statusText}`;
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json().catch(() => ({}));
            message = data?.error || message;
          } else {
            const text = await res.text();
            message = text || message;
          }
        } catch {
          // ignore parse errors
        }
        setServerError(message);
      } else {
        setServerError("Network error.");
      }
    } finally {
      setSubmitting(false);
    }
  }
  

  return (
    <div className="mx-auto max-w-xl p-6 bg-surface">
      <h1 className="text-xl font-semibold">Create Trackable</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field
          id="name"
          label="Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          error={errors.name}
          placeholder="Give a name"
        />
        <Field
          id="title"
          label="Title"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          error={errors.title}
          placeholder="A title visible on the website"
        />
        <Field
          id="hostName"
          label="Host Name"
          value={form.hostName}
          onChange={(v) => setForm((f) => ({ ...f, hostName: v }))}
          error={errors.hostName}
          placeholder="example.com"
        />

        {serverError && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded cursor-pointer bg-primary px-4 py-2 text-sm font-medium text-foreground transition disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const { id, label, value, onChange, error, placeholder } = props;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded border px-3 py-2 text-sm"
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
