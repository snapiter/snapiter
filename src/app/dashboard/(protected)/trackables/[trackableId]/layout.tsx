"use client";

import { type ReactNode, use } from "react";
import Menu from "@/components/dashboard/Menu";
import Main from "@/components/dashboard/layout/Main";
import { MenuItemProps } from "@/components/dashboard/layout/MenuItem";
import { FaRoute, FaVanShuttle, FaPlus } from "react-icons/fa6";
import { useTrackable } from "@/hooks/useTrackable";
import { dashboardLoading } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { useTrips } from "@/hooks/useTrips";
import Logo from "@/components/Logo";

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
  const { data: trips, isLoading: isTripsLoading, isError: isTripsError } = useTrips(trackableId);

  const menuItems: MenuItemProps[] = trackable
    ? [
      {
        icon: <Logo />,
        label: trackable.hostName,
        href: `/dashboard/trackables/${trackable.trackableId}`,
      },
      {
        icon: <FaRoute className="text-primary" />,
        label: "Trips",
        submenu: [
          ...(trips?.map((trip) => ({
            icon: <FaVanShuttle className="text-primary" />,
            label: trip.title,
            href: `/dashboard/trackables/${trackable.trackableId}/trips/${trip.slug}`,
          })) ?? []),
          {
            icon: <FaPlus className="text-primary" />,
            label: "Add Trip",
            href: `/dashboard/trackables/${trackable.trackableId}/trips/create`,
          },
        ]
        
      },
    ]
    : [];

  const showOverlay = loading || isLoading || isTripsLoading;

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
