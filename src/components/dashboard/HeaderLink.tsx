import Link from "next/link";
import { ReactNode } from "react";

type HeaderLinkProps = {
  href: string;
  icon: ReactNode;
  text: string;
};

export default function HeaderLink({ href, icon, text }: HeaderLinkProps) {
  return (
    <Link
      href={href}
      className="
      group flex items-center md:rounded-full md:border border-border bg-surface text-lightest transition-colors hover:bg-surface/80"
    >
      {/* Icon area */}
      <div className="flex h-10 w-10 items-center justify-center">
        {icon}
      </div>

      {/* Expanding text */}
      <span
        className={`
            whitespace-nowrap
          md:max-w-0 md:opacity-0 md:overflow-hidden
          md:transition-all md:duration-700 md:group-hover:max-w-xs md:group-hover:opacity-100 md:group-hover:pr-4
        `}
      >
        {text}
      </span>
    </Link>
  );
}
