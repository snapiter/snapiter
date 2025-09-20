"use client";
import { FaBars } from "react-icons/fa6";
import { useAtom } from "jotai";
import { mobileMenuOpen } from "@/store/atoms";
import Link from "next/link";
import Image from "next/image";


export default function Header() {
  const [isOpen, setIsOpen] = useAtom(mobileMenuOpen);

  return (
    <header className="bg-surface text-white p-4 flex items-center justify-between">
        <div className="container mx-auto px-4 relative">
         <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
             <Link href="https://snapiter.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
               <Image
                 src="/logo.svg"
                 alt="SnapIter Logo"
                 width={40}
                 height={40}
                 className="w-10 h-10"
               />
               <h1 className="font-bold text-foreground text-2xl">
                 SnapIter
               </h1>
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
  // return (
  //   <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border supports-[backdrop-filter]:bg-background/60">
  //     <div className="container mx-auto px-4 max-w-7xl relative">
  //       <div className="flex items-center justify-between py-4">
  //         <div className="flex items-center space-x-3">
  //           <Link href="https://snapiter.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
  //             <Image
  //               src="/logo.svg"
  //               alt="SnapIter Logo"
  //               width={40}
  //               height={40}
  //               className="w-10 h-10"
  //             />
  //             <h1 className="font-bold text-foreground text-2xl">
  //               SnapIter
  //             </h1>
  //           </Link>
  //         </div>

  //         <nav className="hidden md:flex items-center space-x-8">

  //           <HeaderLink
  //             href="/dashboard/trackables/create"
  //             icon={<FaLocationCrosshairs />}
  //             text="New Trackable"
  //           />
  //         </nav>

  //         {/* Mobile menu with CSS-only toggle */}
  //         <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
  //         <label htmlFor="mobile-menu-toggle" className="md:hidden p-2 cursor-pointer">
  //           <FaBars />
  //         </label>

  //         {/* Mobile menu dropdown */}
  //         <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg hidden peer-checked:block md:hidden z-40">
  //           <nav className="flex flex-col p-4 space-y-4">
  //             <HeaderLink
  //               href="/dashboard/trackables/create"
  //               icon={<FaLocationCrosshairs />}
  //               text="New Trackable"
  //             />
  //           </nav>
  //         </div>
  //       </div>
  //     </div>
  //   </header>
  // );