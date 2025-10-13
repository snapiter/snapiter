"use client";

import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  id: string;
};

export default function TextArea({
  label,
  id,
  required,
  ...props
}: TextAreaProps) {
  return (
    <div className="text-area-wrapper">
      {label && (
        <label htmlFor={id} className="text-area-label">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        required={required}
        className={`text-area ${required ? "required" : ""}`}
        {...props}
      />
    </div>
  );
}
