"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const ids = navItems.map((n) => n.id);

function getItemHref(item: (typeof navItems)[number], pathname: string) {
  if (item.id === "education") {
    return pathname === "/" ? "#education" : "/education";
  }
  if ("href" in item && typeof item.href === "string") {
    return item.href;
  }
  return pathname === "/" ? `#${item.id}` : `/#${item.id}`;
}

export function Navbar() {
  const active = useActiveSection(ids);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentItemId = pathname === "/education" ? "education" : active;

  const isItemActive = (item: (typeof navItems)[number]) =>
    item.id === "education"
      ? pathname === "/education" || (pathname === "/" && currentItemId === "education")
      : "href" in item && typeof item.href === "string"
        ? pathname === item.href
        : pathname === "/" && currentItemId === item.id;

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-moss/40 bg-paper">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/#home" className="flex items-center gap-2 font-serif text-xl font-semibold text-forest">
          <span aria-hidden="true" className="grid size-9 -rotate-3 place-items-center rounded-md bg-forest text-sm text-cream">
            {siteConfig.monogram}
          </span>
          {siteConfig.name}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={getItemHref(item, pathname)}
                aria-current={isItemActive(item) ? (item.id === "education" && pathname === "/education" ? "page" : "location") : undefined}
                className="relative block px-3 py-2 text-sm font-medium text-forest"
              >
                {item.label}
                {/* The active section gets a little hand-drawn squiggle */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 40 6"
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-1.5 w-[calc(100%-1.5rem)] text-rose transition-opacity",
                    isItemActive(item) ? "opacity-100" : "opacity-0",
                  )}
                  preserveAspectRatio="none"
                >
                  <path d="M1 3 Q 6 0 11 3 T 21 3 T 31 3 T 39 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="grid size-11 place-items-center rounded-md text-forest md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-moss/40 bg-cream px-5 py-2 md:hidden">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={getItemHref(item, pathname)}
                onClick={() => setOpen(false)}
                aria-current={isItemActive(item) ? (item.id === "education" && pathname === "/education" ? "page" : "location") : undefined}
                className={cn(
                  "flex min-h-12 items-center font-serif text-xl text-forest",
                  isItemActive(item) && "italic underline decoration-rose decoration-2 underline-offset-4",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
