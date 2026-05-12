"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import SanityImage from "./SanityImage";
import type { ProjectSummary } from "@/sanity/types";

const CATEGORY_LABEL: Record<string, string> = {
  photo: "Photography",
  video: "Videography",
  web: "Web",
  design: "Design",
};

export default function HeroSlider({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (projects.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % projects.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [projects.length]);

  if (projects.length === 0) {
    return (
      <div className="h-full w-full bg-[var(--color-bg-soft)] flex items-center justify-center">
        <span className="font-serif italic text-[var(--color-mute)]">
          Add a project in Studio.
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--color-bg-soft)]">
      {projects.map((p, i) => (
        <Link
          key={p._id}
          href={`/portfolio/${p.slug}`}
          className={clsx(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === index
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          aria-hidden={i !== index}
          tabIndex={i === index ? 0 : -1}
        >
          <SanityImage
            image={p.coverImage}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={i === 0}
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white">
            <span className="block text-[0.65rem] tracking-[0.22em] uppercase mb-2 opacity-80">
              {CATEGORY_LABEL[p.category] ?? p.category}
              {p.year ? ` · ${p.year}` : ""}
            </span>
            <h2 className="font-display text-2xl md:text-3xl leading-tight">
              {p.title}
            </h2>
          </div>
        </Link>
      ))}

      {projects.length > 1 ? (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={clsx(
                "w-2 h-2 rounded-full transition-colors",
                i === index
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
