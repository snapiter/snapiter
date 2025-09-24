"use client";

import { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  id: string;
};

export default function TextArea({ label, id, ...props }: TextAreaProps) {
  return (
    <div className="text-area-wrapper">
      {label && <label htmlFor={id} className="text-area-label">
        {label}
      </label>}
      <textarea id={id} name={id} className="text-area" {...props} />
    </div>
  );
}
