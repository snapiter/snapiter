"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConsumePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get("token");

  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!token) {
        setState("error");
        setError("Missing token.");
        return;
      }
      try {
        const res = await fetch(`/dashboard/api/auth/consume?token=${encodeURIComponent(token)}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          setState("ok");
          // small delay then go home (or wherever)
          router.replace("/dashboard");
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data?.error || "Authentication failed.");
          setState("error");
        }
      } catch {
        setError("Network error.");
        setState("error");
      }
    }
    run();
  }, [router, token]);
    useEffect(() => {
    if (state === "error") {
      const timer = setTimeout(() => {
        router.replace("/dashboard/auth");
      }, 5000);
      return () => clearTimeout(timer);
    }
    }, [state, router]);
  return (
    <main className="flex justify-center bg-surface min-h-screen">
      <div className="px-4 pt-16 pb-12">
        <div className="w-full max-w-sm bg-background rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Signing you in…</h1>

          {state === "loading" && (
            <p className="text-sm text-muted text-center">Verifying your link…</p>
          )}

          {state === "ok" && (
            <p className="text-sm text-success text-center">Success! Redirecting…</p>
          )}

          {state === "error" && (
            <>
              <p className="text-error text-center">
                {error === "invalid_or_expired"
                  ? "This link is invalid or expired."
                  : error || "Something went wrong."}
              </p>
              <p className="text-center text-sm mt-2">
                Automatically Redirecting you to the login page…
              </p>
              <div className="mt-6 text-center">
                <a
                  className="inline-block py-2 px-4 rounded-md font-medium text-white bg-primary-light hover:bg-primary-hover"
                  href="/dashboard/auth"
                >
                  Request a new link
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
