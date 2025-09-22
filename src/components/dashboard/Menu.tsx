"use client";

import { mobileMenuOpen } from "@/store/atoms";
import { useAtom } from "jotai";
import { FaX } from "react-icons/fa6";
import MenuItem, { MenuItemProps } from "./layout/MenuItem";
import LogoutButton from "./LogoutButton";

export default function Menu({ items }: { items: MenuItemProps[] }) {
  const [isOpen, setIsOpen] = useAtom(mobileMenuOpen);

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background md:hidden z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed w-full top-0 left-0 h-full border-r border-border md:w-92 text-foreground p-4 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 z-20`}
      >
        {/* Close button (mobile only) */}
        <button
          className="md:hidden text-2xl mb-6"
          onClick={() => setIsOpen(false)}
        >
          <FaX />
        </button>

        <nav className="flex-1">
          {items.map((item, idx) => (
            <MenuItem
              key={idx}
              icon={item.icon}
              label={item.label}
              href={item.href}
              submenu={item.submenu}
            />
          ))}
        </nav>

        {/* Footer text */}
        <div className="mt-auto pt-6 text-sm text-muted text-center">
          <LogoutButton />
        </div>
      </aside>
    </div>
  );
}
