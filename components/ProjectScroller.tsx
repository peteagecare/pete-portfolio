"use client";

import { useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import SanityImage from "./SanityImage";
import type { ProjectSummary, ThumbnailOrientation } from "@/sanity/types";

const CATEGORY_LABEL: Record<string, string> = {
  social: "Social",
  photo: "Photography",
  video: "Videography",
  web: "Web",
  design: "Design",
};

// Uniform image height per breakpoint; width derives from orientation so the
// row aligns on a shared top baseline and never letterboxes vertical thumbs.
const TILE_IMAGE_HEIGHT = "h-[260px] sm:h-[300px] md:h-[340px]";
const TILE_WIDTH: Record<ThumbnailOrientation, string> = {
  portrait: "w-[146px] sm:w-[169px] md:w-[191px]", // 9:16
  landscape: "w-[347px] sm:w-[400px] md:w-[453px]", // 4:3
  square: "w-[260px] sm:w-[300px] md:w-[340px]", // 1:1
};

export default function ProjectScroller({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 320) + 20;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  if (projects.length === 0) {
    return (
      <p className="text-[var(--color-mute)] font-serif italic py-8">
        More projects coming soon.
      </p>
    );
  }

  return (
    <div className="relative">
      {projects.length > 3 ? (
        <>
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
        </>
      ) : null}

      <div
        ref={scrollerRef}
        className="no-scrollbar overflow-x-auto flex items-start gap-4 md:gap-5 snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {projects.map((p) => {
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
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 44vw, 78vw"
                  className="object-cover img-hover"
                />
              </div>
              <div className="px-4 py-3 md:px-5 md:py-4 h-[92px] md:h-[100px] flex flex-col">
                <span className="block text-[0.55rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                  {CATEGORY_LABEL[p.category] ?? p.category}
                  {p.year ? ` · ${p.year}` : ""}
                </span>
                <h3 className="font-display text-base md:text-lg text-[var(--color-ink)] leading-tight line-clamp-2">
                  {p.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
