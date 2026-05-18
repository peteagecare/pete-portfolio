"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import UniformProjectCard from "./UniformProjectCard";
import type { ProjectSummary } from "@/sanity/types";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "social", label: "Social" },
  { value: "video", label: "Videography" },
  { value: "photo", label: "Photography" },
  { value: "design", label: "Design" },
  { value: "web", label: "Web" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

const VALID_FILTERS = new Set<string>(FILTERS.map((f) => f.value));

function parseFilter(raw: string | undefined): FilterValue {
  if (raw && VALID_FILTERS.has(raw)) return raw as FilterValue;
  return "all";
}

export default function PortfolioFilter({
  projects,
  initialCategory,
}: {
  projects: ProjectSummary[];
  initialCategory?: string;
}) {
  const [filter, setFilter] = useState<FilterValue>(() =>
    parseFilter(initialCategory),
  );

  const updateFilter = (next: FilterValue) => {
    setFilter(next);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState({}, "", url.toString());
  };

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects]
  );

  const isSocialGrid = filter === "social";
  const gridClass = isSocialGrid
    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-y-12"
    : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-x-6";
  const itemClass = isSocialGrid ? undefined : "break-inside-avoid mb-10 md:mb-12";

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12 border-b border-[var(--color-line)] pb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => updateFilter(f.value)}
            className={clsx(
              "text-[0.7rem] tracking-[0.22em] uppercase transition-colors",
              filter === f.value
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-mute)] hover:text-[var(--color-ink)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className={gridClass}>
        {filtered.map((p, i) => (
          <li key={p._id} className={itemClass}>
            <UniformProjectCard
              project={p}
              priority={i < 3}
              showCategory={filter === "all"}
              orientationOverride={isSocialGrid ? "portrait" : undefined}
            />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-[var(--color-mute)] py-24 font-serif italic text-xl">
          Nothing here yet.
        </p>
      ) : null}
    </div>
  );
}
