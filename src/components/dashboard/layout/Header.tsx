"use client";
import { FaBars } from "react-icons/fa6";
import { useAtom } from "jotai";
import { mobileMenuOpen } from "@/store/atoms";
import Link from "next/link";
import { Logo } from "@snapiter/designsystem";

export default function Header() {
  const [isOpen, setIsOpen] = useAtom(mobileMenuOpen);

  return (
    <header className="bg-surface text-white p-4 flex items-center justify-between border-b border-border">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Link href="https://snapiter.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Logo size="lg" showTitle={true} />
            </Link>
          </div>
        </div>
      </div>
      {/* Hamburger (mobile only, hidden when menu open) */}
      {!isOpen && (
        <button
          className="md:hidden text-2xl z-30"
          onClick={() => setIsOpen(true)}
        >
          <FaBars />
        </button>
      )}
    </header>
  );
}