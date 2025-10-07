import { MenuItemProps } from "@/components/dashboard/layout/MenuItem";
import { FaHome } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";

export const createTrackableMenuItem: MenuItemProps =
  {
    icon: <FaLocationCrosshairs className="text-primary" />, 
    label: "Create Trackable",
    href: "/dashboard/trackables/create",
    className: "border-b border-border",
  }
  export const dashboardMenuItem: MenuItemProps =
  {
    icon: <FaHome className="text-primary" />, 
    label: "Dashboard",
    href: "/dashboard",
    className: "border-b border-border",
  }