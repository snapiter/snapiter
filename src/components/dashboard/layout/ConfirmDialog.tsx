"use client";

import { ReactNode } from "react";
import SecondaryButton from "../buttons/SecondaryButton";
import PrimaryButton from "../buttons/PrimaryButton";

interface ConfirmDialogProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: ReactNode;
}

export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="rounded bg-surface p-6 shadow-md w-full max-w-sm">
        {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
        <p className="text-sm text-muted mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <SecondaryButton text={cancelText} onClick={onCancel} />
          <PrimaryButton
            text={confirmText}
            icon={icon}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}
