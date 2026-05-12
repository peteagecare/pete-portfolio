import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allSoftwareQuery } from "@/sanity/queries";
import type { Software } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Software",
  description: "Pete Jenkins — software and tools, with the projects each one was used on.",
};

export default async function SoftwarePage() {
  const software =
    (await sanityFetch<Software[] | null>({
      query: allSoftwareQuery,
      tags: ["software"],
    })) ?? [];

  return (
    <>
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
          Software
        </span>
        <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] max-w-[18ch] mb-6">
          What I work
          <br />
          <span className="font-serif italic font-normal normal-case">
            with.
          </span>
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-32">
        {software.length === 0 ? (
          <p className="text-center text-[var(--color-mute)] font-serif italic text-xl py-16">
            Add software in the Studio to populate this page.
          </p>
        ) : (
          <ul className="max-w-[1100px] divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {software.map((s) => (
              <li
                key={s._id}
                className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-3 md:gap-10 py-6"
              >
                <h2 className="font-display text-xl md:text-2xl text-[var(--color-ink)] leading-tight">
                  {s.name}
                </h2>
                {s.projects && s.projects.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-4 gap-y-2 items-baseline">
                    {s.projects.map((p) => (
                      <li key={p._id}>
                        <Link
                          href={`/portfolio/${p.slug}`}
                          className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-line)] hover:decoration-[var(--color-ink)] transition-colors"
                        >
                          {p.title}
                        </Link>
                        {p.year ? (
                          <span className="ml-2 text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
                            {p.year}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="font-serif italic text-[var(--color-mute)]">
                    —
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
