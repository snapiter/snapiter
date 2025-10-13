"use client";

import type React from "react";
import { useState } from "react";
import { config } from "@/config";

export default function RequestMagicLinkPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${config.apiUrl}/api/auth/login/email/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Link has been sent. Check your email.");
      } else if (res.status === 400) {
        setStatus("error");
        setMessage("Invalid email address.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="flex justify-center bg-surface min-h-screen">
      <div className="px-4 pt-16 pb-12">
        <div className="w-full max-w-sm bg-background rounded-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            Login via Email
          </h1>

          {status === "success" ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-success font-medium">
                Email has been sent to{" "}
                <span className="font-semibold">{email}</span>.
              </p>
              <p className="text-sm text-muted">
                Check your inbox and click the link to continue.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted">
                We&apos;ll send you a one-time login link to your email.
              </p>
              <div className="border-b border-border mb-6"></div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    placeholder="you@snapiter.com"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-70"
                >
                  {status === "loading" ? "Sending..." : "Send login link"}
                </button>
              </form>

              {message && status === "error" && (
                <p role="alert" className="mt-4 text-sm text-error">
                  {message}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
