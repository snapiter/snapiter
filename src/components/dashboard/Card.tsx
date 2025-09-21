import { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-surface my-4 rounded-lg p-6 border border-border">
      {title && (
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="text-muted mt-2 mb-4">{description}</p>
      )}
      <div>{children}</div>
    </div>
  );
}
