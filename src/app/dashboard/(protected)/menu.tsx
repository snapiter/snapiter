import { MenuItemProps } from "@/components/dashboard/layout/MenuItem";
import { FaLocationCrosshairs } from "react-icons/fa6";

export const createTrackableMenuItem: MenuItemProps =
  {
    icon: <FaLocationCrosshairs className="text-primary" />, 
    label: "Create Trackable",
    href: "/dashboard/trackables/create",
  }
