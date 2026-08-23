import { Link } from "react-router-dom";

export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to main content
    </a>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper-2">
      <div className="mx-auto flex max-w-lg items-center px-4 py-4 sm:px-6">
        <Link
          to="/"
          aria-label="Russian Grammar Guide. Home."
          className="font-display text-xl font-semibold text-ink no-underline"
        >
          Russian Grammar Guide
        </Link>
      </div>
    </header>
  );
}
