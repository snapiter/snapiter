"use client";

import { Logo } from "@snapiter/designsystem";
import { useAtom } from "jotai";
import { FaX } from "react-icons/fa6";
import { mobileMenuOpen } from "@/store/atoms";
import LogoutButton from "../buttons/LogoutButton";
import MenuItem, { type MenuItemProps } from "./MenuItem";

export default function Menu({ items }: { items: MenuItemProps[] }) {
  const [isOpen, setIsOpen] = useAtom(mobileMenuOpen);

  return (
    <aside
      className={` bg-background fixed w-full top-0 left-0 h-full border-r border-border md:w-92 text-foreground p-4 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 z-20`}
    >
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-6">
          <Logo size="sm" showTitle={true} />
          <button type="button" onClick={() => setIsOpen(false)}>
            <FaX />
          </button>
        </div>
      </div>

      <nav className="flex-1">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            icon={item.icon}
            label={item.label}
            href={item.href}
            submenu={item.submenu}
            className={item.className}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 text-sm text-muted">
        <LogoutButton />
      </div>
    </aside>
  );
}
