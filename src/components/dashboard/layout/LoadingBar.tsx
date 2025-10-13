"use client";
import { useAtomValue } from "jotai";
import { dashboardLoading } from "@/store/atoms";

export default function LoadingBar() {
  const loading = useAtomValue(dashboardLoading);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden">
      <div className="loading-bar bg-primary h-full"></div>
    </div>
  );
}
