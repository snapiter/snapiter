"use client";

import { type ReactNode, use } from "react";
import Menu from "@/components/dashboard/Menu";
import Main from "@/components/dashboard/layout/Main";
import { MenuItemProps } from "@/components/dashboard/layout/MenuItem";
import { FaChartBar, FaPlane} from "react-icons/fa6";
import { useTrackable } from "@/hooks/useTrackable";

export default function TrackableLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ trackableId: string }>;
}) {
    const { trackableId } = use(params);

    const { data: trackable, isLoading, isError } = useTrackable(trackableId);


    const menuItems: MenuItemProps[] = trackable
      ? [
          {
            icon: <FaChartBar />, // first item icon
            label: trackable.hostName,
            href: `/dashboard/trackables/${trackable.trackableId}`,
          },
          {
            icon: <FaPlane />,
            label: "Trips",
            submenu: [
              {
                label: "List",
                href: `/dashboard/trackables/${trackable.trackableId}/trips`,
              },
              {
                label: "Create",
                href: `/dashboard/trackables/${trackable.trackableId}/trips/create`,
              },
            ],
          },
        ]
      : [];
    
  
  return (
    <div className="flex flex-1 relative">
        <Menu items={menuItems} />
      <Main>{children}</Main>
    </div>
  );
}
