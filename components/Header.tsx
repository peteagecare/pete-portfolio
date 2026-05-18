"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/equipment", label: "Equipment" },
  { href: "/cv", label: "CV" },
  { href: "/software", label: "Software" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Only the home page has a dark hero behind the header. Every other route
  // starts on the light page background, so the header should be opaque from
  // the start (otherwise the white-on-cream text is invisible).
  const hasDarkHero = pathname === "/";
  const solid = scrolled || !hasDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solid
          ? "bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-line)] text-[var(--color-ink)]"
          : "bg-transparent text-white"
      )}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-7 pb-5 flex items-center justify-between">
        <Link href="/" className="group" onClick={() => setOpen(false)}>
          <span className="block font-serif italic text-[1.5rem] leading-none text-current">
            Pete Jenkins
          </span>
          <span
            className={clsx(
              "block mt-1 text-[0.625rem] tracking-[0.22em] uppercase",
              solid ? "text-[var(--color-mute)]" : "text-white/75",
            )}
          >
            Social-first · Video · Photo · Motion · Web
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-[0.7rem] tracking-[0.22em] uppercase text-current transition-colors",
                solid
                  ? "hover:text-[var(--color-mute)]"
                  : "hover:text-white/70",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden p-2 -mr-2 text-current"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-px bg-current" />
          <span className="block w-6 h-px bg-current mt-1.5" />
          <span className="block w-6 h-px bg-current mt-1.5" />
        </button>
      </div>

      {open ? (
        <div className="md:hidden bg-[var(--color-bg)] border-t border-[var(--color-line)]">
          <nav className="px-6 py-6 flex flex-col gap-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.18em] uppercase text-[var(--color-ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
