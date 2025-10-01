"use client";

import { type ReactNode } from "react";
import Main from "@/components/dashboard/layout/Main";

export default function TrackableCreateLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 relative">
      <Main>{children}</Main>
    </div>
  );
}
