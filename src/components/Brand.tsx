"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { EnvContext } from "@/utils/env/EnvProvider";

export default function Brand() {
  const env = useContext(EnvContext);

  if (!env.SNAPITER_SHOW_BRAND) {
    return null;
  }
  
  return (
    <div className="hidden md:block absolute bottom-4 left-4 z-10">

    <Link
      href="https://snapiter.com"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center hover:opacity-80 transition-opacity duration-200"
    >
      <Image
        src="/logo.svg"
        alt="SnapIter Logo"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span className="text-xs font-semibold text-primary">SnapIter</span>
    </Link>
    </div>
  );
}
