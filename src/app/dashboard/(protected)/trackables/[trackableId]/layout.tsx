"use client";

import { type ReactNode, use } from "react";
import Menu from "@/components/dashboard/Menu";
import Main from "@/components/dashboard/layout/Main";
import { MenuItemProps } from "@/components/dashboard/layout/MenuItem";
import { FaChartBar, FaPlane } from "react-icons/fa6";
import { useTrackable } from "@/hooks/useTrackable";
import { dashboardLoading } from "@/store/atoms";
import { useAtomValue } from "jotai";

export default function TrackableLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ trackableId: string }>;
}) {
  const { trackableId } = use(params);

  const loading = useAtomValue(dashboardLoading);
  const { data: trackable, isLoading, isError } = useTrackable(trackableId);

  const menuItems: MenuItemProps[] = trackable
    ? [
      {
        icon: <FaChartBar />,
        label: trackable.hostName,
        href: `/dashboard/trackables/${trackable.trackableId}`,
      },
      {
        icon: <FaPlane />,
        label: "Trips",
        href: `/dashboard/trackables/${trackable.trackableId}/trips`,
      },
    ]
    : [];

  const showOverlay = loading || isLoading;

  return (
    <div className="flex flex-1 relative">
      <Menu items={menuItems} />
      <Main>{children}</Main>

      {showOverlay && (
  <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-40">
  </div>
)}

    </div>
  );
}
