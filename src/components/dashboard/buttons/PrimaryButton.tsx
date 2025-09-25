"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};


export default function PrimaryButton({
  text,
  icon,
  disabled,
  onClick,
  ...props
}: PrimaryButtonProps) {
  if (!text && !icon) {
    throw new Error("PrimaryButton must have either text or icon");
  }

  return (
    <button
      className="button-primary flex items-center gap-2"
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <>{icon}</>}
      {text && <span>{text}</span>}
    </button>
  );
}
