"use client";
import { useAtomValue } from "jotai";
import { dashboardLoading } from "@/store/atoms";

export default function LoadingBar() {
    const loading = useAtomValue(dashboardLoading);
    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary">
            <div className="h-full bg-primary" style={{ width: `${loading ? 100 : 0}%` }}></div>
        </div>
    );
}