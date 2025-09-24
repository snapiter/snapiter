// components/PrimaryButton.tsx
"use client";

import { ReactNode } from "react";

type PrimaryButtonProps = {
  text: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function PrimaryButton({
  text,
  icon,
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      className="button-primary flex items-center gap-2"
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <>{icon}</>}
      <span>{text}</span>
    </button>
  );
}
