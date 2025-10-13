"use client";

import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id: string;
};

export default function TextInput({
  label,
  id,
  required,
  ...props
}: TextInputProps) {
  return (
    <div className="text-input-wrapper">
      {label && (
        <label htmlFor={id} className="text-input-label">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        required={required}
        className={`text-input ${required ? "required" : ""}`}
        {...props}
      />
    </div>
  );
}
