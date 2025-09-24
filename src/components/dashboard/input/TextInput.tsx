"use client";

import { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id: string;
};

export default function TextInput({ label, id, ...props }: TextInputProps) {
  return (
    <div className="text-input-wrapper">
      {label && <label htmlFor={id} className="text-input-label">
        {label}
      </label>}
      <input 
      id={id} 
      name={id}
      className="text-input" {...props} />
    </div>
  );
}
