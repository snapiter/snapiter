// components/PrimaryButton.tsx
"use client";

import { ReactNode } from "react";

type SecondaryButtonProps = {
  text?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function SecondaryButton({
  text,
  icon,
  disabled,
  onClick,
}: SecondaryButtonProps) {
  return (
    <button
      className="button-secondary flex items-center gap-2"
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <>{icon}</>}
      {text && <span>{text}</span>}
    </button>
  );
}
