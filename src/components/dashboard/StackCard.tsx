"use client";

import { ReactNode } from "react";

type StackCardProps = {
  children: ReactNode;
  columns?: 1 | 2 | 3;
};

export default function StackCard({ children, columns = 2 }: StackCardProps) {
  const gridCols =
    columns === 1
      ? "md:grid-cols-1"
      : columns === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 pb-4 ${gridCols} gap-4`}>
      {children}
    </div>
  );
}
