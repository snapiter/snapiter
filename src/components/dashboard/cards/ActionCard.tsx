import type { ReactNode } from "react";

interface ActionCardProps {
  onClick?: () => void;
  icon: ReactNode;
  title: string;
  description: string;
}

export default function ActionCard({
  onClick,
  icon,
  title,
  description,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-border bg-surface 
                 cursor-pointer transition-colors duration-200 hover:border-primary hover:bg-surface/50"
    >
      <div className="w-24 h-24 text-primary flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium text-foreground">{title}</span>
      <p className="text-sm text-muted text-center">{description}</p>
    </button>
  );
}
