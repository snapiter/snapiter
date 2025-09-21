"use client";

import { ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Link from "next/link";

export interface SubItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface MenuItemProps {
  icon: ReactNode;
  label: string;
  href?: string;
  submenu?: SubItem[];
}

export default function MenuItem({ icon, label, href, submenu }: MenuItemProps) {
  const [open, setOpen] = useState(true);
  const hasSubmenu = submenu && submenu.length > 0;

  return (
    <div className="w-full">
      {/* Main Item */}
      {hasSubmenu ? (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center cursor-pointer justify-between w-full px-4 py-3 rounded-md text-left
                     hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
          </span>
          <FaChevronDown
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        <Link
          href={href || "#"}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-md hover:bg-white/10 transition-colors"
        >
          <span className="text-xl">{icon}</span>
          <span className="font-medium">{label}</span>
        </Link>
      )}

      {/* Submenu */}
      {hasSubmenu && open && (
        <ul className="mt-2 space-y-2">
          {submenu!.map((item) => (
            <li key={item.href} className="flex items-center gap-3">
              <Link
                href={item.href}
                className="block w-full px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-white/10 pl-11 "
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
