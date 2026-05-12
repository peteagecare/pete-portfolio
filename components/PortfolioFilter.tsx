"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import UniformProjectCard from "./UniformProjectCard";
import type { ProjectSummary } from "@/sanity/types";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photography" },
  { value: "video", label: "Videography" },
  { value: "web", label: "Web" },
  { value: "design", label: "Design" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export default function PortfolioFilter({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12 border-b border-[var(--color-line)] pb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
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

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12">
        {filtered.map((p, i) => (
          <li key={p._id}>
            <UniformProjectCard
              project={p}
              priority={i < 3}
              showCategory={filter === "all"}
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
