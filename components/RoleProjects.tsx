"use client";

import { useState } from "react";
import Link from "next/link";
import SanityImage from "@/components/SanityImage";
import type { ProjectSummary } from "@/sanity/types";

const INITIAL_COUNT = 4;

export default function RoleProjects({
  projects,
  companyName,
}: {
  projects: ProjectSummary[];
  companyName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? projects : projects.slice(0, INITIAL_COUNT);
  const remaining = projects.length - INITIAL_COUNT;

  return (
    <div className="mt-4">
      <span className="block text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
        Projects created at {companyName}
      </span>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {visible.map((p) => (
          <li key={p._id}>
            <Link href={`/portfolio/${p.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--color-bg-soft)] border border-[var(--color-line)]">
                <SanityImage
                  image={p.coverImage}
                  sizes="(min-width: 768px) 140px, 45vw"
                  className="object-cover img-hover"
                />
              </div>
              <p className="mt-1 text-[0.65rem] leading-tight text-[var(--color-ink)] line-clamp-2">
                {p.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {remaining > 0 && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] border-b border-[var(--color-line)] pb-0.5 hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
        >
          Load {remaining} more →
        </button>
      ) : null}
    </div>
  );
}
