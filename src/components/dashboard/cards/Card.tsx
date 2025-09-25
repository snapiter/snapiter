import { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export default function Card({ title, description, icon, className, children }: CardProps) {
  return (
    <div className={`bg-surface rounded-lg p-6 border border-border ${className}`}>
      {(title || description) && (
        <div className="flex items-start gap-3">
          {icon && (
            <div className="text-foreground mt-1">{icon}</div>
          )}
          <div>
            {title && (
              <h3 className="text-xl font-semibold text-foreground pb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-muted mb-4">{description}</p>
            )}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
