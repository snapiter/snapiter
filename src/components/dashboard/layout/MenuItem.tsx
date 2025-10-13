"use client";

import { useSetAtom } from "jotai";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { mobileMenuOpen } from "@/store/atoms";

export interface SubItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: ReactNode;
  className?: string;
}

export interface MenuItemProps {
  icon: ReactNode;
  label: string;
  href?: string;
  submenu?: SubItem[];
  className?: string;
}

export default function MenuItem({
  icon,
  label,
  href,
  submenu,
  className,
}: MenuItemProps) {
  const setMobileMenuOpen = useSetAtom(mobileMenuOpen);

  const [open, setOpen] = useState(true);
  const hasSubmenu = submenu && submenu.length > 0;

  return (
    <div className="w-full">
      {/* Main Item */}
      {hasSubmenu ? (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex items-center cursor-pointer justify-between w-full px-4 py-3 rounded-md text-left
                     hover:bg-surface transition-colors ${className}`}
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
        // Without submenu!
        <Link
          href={href || "#"}
          onClick={() => setMobileMenuOpen(false)}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-md hover:bg-surface ${className}`}
        >
          <span className="text-xl">{icon}</span>
          <span className="font-medium">{label}</span>
        </Link>
      )}

      {/* Submenu */}
      {hasSubmenu && open && (
        <ul className="">
          {submenu?.map((item) => (
            <li
              key={item.href}
              className="flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-md hover:bg-surface ${item.className}`}
              >
                <span className="text-xl pl-10">{item.icon}</span>
                <span className="flex font-medium">
                  {item.label}
                  {item.active && (
                    <span className="px-2 text-sm flex items-center gap-1 text-muted">
                      <FaCheck size={10} className="text-primary-light" />
                      active
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
