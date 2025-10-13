"use client";

import { Logo } from "@snapiter/designsystem";
import { useAtomValue } from "jotai";
import { type ReactNode, use } from "react";
import { FaRoute, FaVanShuttle } from "react-icons/fa6";
import Main from "@/components/dashboard/layout/Main";
import Menu from "@/components/dashboard/layout/Menu";
import type { MenuItemProps } from "@/components/dashboard/layout/MenuItem";
import { useTrackables } from "@/hooks/dashboard/trackables/useTrackables";
import { useTrips } from "@/hooks/dashboard/trips/useTrips";
import { useTrackableById } from "@/hooks/trackable/useTrackableById";
import { dashboardLoading } from "@/store/atoms";
import { createTrackableMenuItem, dashboardMenuItem } from "../../menu";

export default function TrackableLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ trackableId: string }>;
}) {
  const { trackableId } = use(params);

  const loading = useAtomValue(dashboardLoading);
  const { data: trackables } = useTrackables();
  const { data: trackable, isLoading } = useTrackableById(trackableId);
  const { data: trips, isLoading: isTripsLoading } = useTrips(trackableId);

  const menuItems: MenuItemProps[] = trackable
    ? ([
        trackables?.length > 1 ? dashboardMenuItem : createTrackableMenuItem,
        {
          icon: <Logo />,
          label: trackable.hostName,
          href: `/dashboard/trackables/${trackable.trackableId}`,
        },
        trips && trips.length > 0
          ? {
              icon: <FaRoute className="text-primary" />,
              label: "Trips",
              submenu: trips.map((trip) => ({
                icon: <FaVanShuttle className="text-primary" />,
                label: trip.title,
                href: `/dashboard/trackables/${trackable.trackableId}/trips/${trip.slug}`,
                active: trip.endDate == null,
              })),
            }
          : undefined,
      ].filter(Boolean) as MenuItemProps[])
    : [];

  const showOverlay = loading || isLoading || isTripsLoading;

  return (
    <div className="flex flex-1 relative">
      <Menu items={menuItems} />
      <Main>{children}</Main>

      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-40"></div>
      )}
    </div>
  );
}
