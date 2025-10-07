"use client";

import { ReactNode } from "react";

type StackCardProps = {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
};

export default function StackCard({ children, columns = 2, className = "" }: StackCardProps) {
  const gridCols =
    columns === 1
      ? "md:grid-cols-1"
      : columns === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-3";

  return (
    <div
      className={`grid grid-cols-1 gap-4 pb-4 
                  ${gridCols} 
                  w-full max-w-7xl mx-auto px-4 ${className}`}
    >
      {children}
    </div>
  );
}
