"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import SanityImage from "./SanityImage";
import type { ProjectSummary, ThumbnailOrientation } from "@/sanity/types";

type Filter = "all" | "social" | "design" | "photo" | "video" | "web";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "social", label: "Social" },
  { key: "video", label: "Videography" },
  { key: "photo", label: "Photography" },
  { key: "design", label: "Design" },
  { key: "web", label: "Web" },
];

const CATEGORY_LABEL: Record<string, string> = {
  social: "Social",
  photo: "Photography",
  video: "Videography",
  web: "Web",
  design: "Design",
};

// All tiles share the same image height per breakpoint; width derives from
// the project's thumbnailOrientation so the row aligns on a top baseline
// and never leaves blank gaps inside a card.
const TILE_IMAGE_HEIGHT = "h-[220px] sm:h-[260px] md:h-[300px]";
const TILE_WIDTH: Record<ThumbnailOrientation, string> = {
  portrait: "w-[124px] sm:w-[146px] md:w-[169px]", // 9:16
  landscape: "w-[293px] sm:w-[347px] md:w-[400px]", // 4:3
  square: "w-[220px] sm:w-[260px] md:w-[300px]", // 1:1
};

export default function RecentProjectsCarousel({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [projects, filter],
  );

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 280) + 20;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  if (projects.length === 0) return null;

  return (
    <section>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
              Latest Work
            </span>
            <h2 className="font-display text-2xl md:text-3xl leading-[1.05]">
              Recent Projects
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={isActive}
                  className={clsx(
                    "rounded-full border px-3.5 py-1.5 text-[0.65rem] tracking-[0.18em] uppercase transition-colors",
                    isActive
                      ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]"
                      : "border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <Link
            href="/portfolio"
            className="text-[0.65rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Carousel + arrows */}
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll left"
            className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-white border border-[var(--color-line)] shadow-md items-center justify-center hover:shadow-lg transition-shadow"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Scroll right"
            className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-white border border-[var(--color-line)] shadow-md items-center justify-center hover:shadow-lg transition-shadow"
          >
            <span aria-hidden>→</span>
          </button>

          {filtered.length > 0 ? (
            <div
              ref={scrollerRef}
              className="no-scrollbar overflow-x-auto flex items-start gap-4 md:gap-5 snap-x snap-mandatory pb-2 -mx-1 px-1"
            >
              {filtered.map((p) => {
                const orientation: ThumbnailOrientation =
                  p.thumbnailOrientation ?? "landscape";
                return (
                  <Link
                    key={p._id}
                    data-card
                    href={`/portfolio/${p.slug}`}
                    className={clsx(
                      "group flex-shrink-0 snap-start block rounded-2xl overflow-hidden bg-[var(--color-bg-soft)] border border-[var(--color-line)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-shadow",
                      TILE_WIDTH[orientation],
                    )}
                  >
                    <div
                      className={clsx(
                        "relative overflow-hidden w-full",
                        TILE_IMAGE_HEIGHT,
                      )}
                    >
                      <SanityImage
                        image={p.coverImage}
                        sizes="(min-width: 768px) 25vw, 60vw"
                        className="object-cover img-hover"
                      />
                    </div>
                    <div className="px-3 py-3 md:px-4 md:py-3 h-[84px] md:h-[92px] flex flex-col">
                      <span className="block text-[0.55rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                        {CATEGORY_LABEL[p.category] ?? p.category}
                        {p.year ? ` · ${p.year}` : ""}
                      </span>
                      <h3 className="font-display text-sm md:text-base text-[var(--color-ink)] leading-tight line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--color-mute)] font-serif italic py-8">
              No {filter} projects yet — check back soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
