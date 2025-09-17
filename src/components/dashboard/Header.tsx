import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="SnapIter Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="font-bold text-foreground text-2xl">
              SnapIter
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#hero"
              className="text-muted hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-muted hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-muted hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#cta"
              className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary-hover transition-colors"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile menu with CSS-only toggle */}
          <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
          <label htmlFor="mobile-menu-toggle" className="md:hidden p-2 cursor-pointer">
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          {/* Mobile menu dropdown */}
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg hidden peer-checked:block md:hidden z-40">
            <nav className="flex flex-col p-4 space-y-4">
              <a
                href="#hero"
                className="text-muted hover:text-foreground transition-colors py-2"
              >
                Home
              </a>
              <a
                href="#how-it-works"
                className="text-muted hover:text-foreground transition-colors py-2"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-muted hover:text-foreground transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#cta"
                className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary-hover transition-colors text-center"
              >
                Get Started
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}