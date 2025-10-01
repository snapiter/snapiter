"use client";

import { type ReactNode } from "react";
import Main from "@/components/dashboard/layout/Main";
import Menu from "@/components/dashboard/layout/Menu";
import { useTrackables } from "@/hooks/dashboard/trackables/useTrackables";
import { createTrackableMenuItem } from "../../menu";
import { MenuItemProps } from "@/components/dashboard/layout/MenuItem";
import Logo from "@/components/Logo";

export default function TrackableCreateLayout({
  children
}: {
  children: ReactNode;
}) {
  const { data: trackables } = useTrackables();

  const menuItems: MenuItemProps[] = [
      createTrackableMenuItem,
      ...(trackables?.map((t) => ({
        icon: <Logo />,
        label: t.hostName,
        href: `/dashboard/trackables/${t.trackableId}`,
      })) ?? []),
    ]

  return (
    <div className="flex flex-1 relative">
    <Menu items={menuItems} />
      <Main>{children}</Main>
    </div>
  );
}
