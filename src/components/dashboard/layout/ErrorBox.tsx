"use client";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { errorMessage } from "@/store/atoms";

export default function ErrorBox() {
  const [error, setErrorMessage] = useAtom(errorMessage);
  const router = useRouter();

  useEffect(() => {
    if (error?.status === 401) {
      router.push("/dashboard/auth");
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  if (!error) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-10 z-50 overflow-hidden">
      <div className="error-bar bg-error h-full text-lg flex items-center justify-center">
        Something went wrong: {error.message}
      </div>
    </div>
  );
}
