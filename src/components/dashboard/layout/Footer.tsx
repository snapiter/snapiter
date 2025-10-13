import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface text-foreground py-6 px-4 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            © {year}&nbsp;
            <Link
              href="https://snapiter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              SnapIter
            </Link>
            . Licensed under the{" "}
            <Link
              href="https://www.apache.org/licenses/LICENSE-2.0"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Apache License 2.0
            </Link>
            .
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/snapiter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
