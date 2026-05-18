import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allSoftwareQuery } from "@/sanity/queries";
import type { ProjectCategory, Software } from "@/sanity/types";
import SoftwareLogo from "@/components/SoftwareLogo";
import SanityImage from "@/components/SanityImage";
import { softwareLogoSources } from "@/lib/softwareLogo";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Pete Jenkins — software and tools, grouped by discipline, with the projects each one was used on.",
};

const CATEGORIES: { key: ProjectCategory; title: string }[] = [
  { key: "design", title: "Design" },
  { key: "video", title: "Video" },
  { key: "photo", title: "Photo" },
  { key: "web", title: "Web" },
];

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

      {software.length > 0 ? (
        <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-20">
          <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
            The toolkit
          </span>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {software.map((s) => (
              <li key={s._id}>
                <div className="rounded-2xl bg-[var(--color-bg)] border border-[var(--color-line)] p-4 md:p-5 flex flex-col items-center gap-3 h-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <SoftwareLogo
                      name={s.name}
                      sources={softwareLogoSources(s.name)}
                    />
                  </div>
                  <p className="text-[0.8rem] md:text-sm text-center text-[var(--color-ink)] leading-tight font-medium">
                    {s.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CATEGORIES.map(({ key, title }) => {
            const items = software
              .map((s) => ({
                software: s,
                projects: (s.projects ?? []).filter((p) => p.category === key),
              }))
              .filter((x) => x.projects.length > 0);

            return (
              <div
                key={key}
                className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6 md:p-8"
              >
                <h2 className="font-display text-2xl md:text-3xl mb-6">
                  {title}
                </h2>

                {items.length === 0 ? (
                  <p className="font-serif italic text-[var(--color-mute)]">
                    Nothing here yet.
                  </p>
                ) : (
                  <ul className="space-y-8">
                    {items.map(({ software: s, projects }) => (
                      <li key={s._id}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 flex items-center justify-center">
                            <SoftwareLogo
                              name={s.name}
                              sources={softwareLogoSources(s.name)}
                            />
                          </div>
                          <h3 className="text-[0.7rem] md:text-xs tracking-[0.18em] uppercase text-[var(--color-mute)] leading-tight">
                            Projects using{" "}
                            <span className="text-[var(--color-ink)] normal-case tracking-normal font-medium">
                              {s.name}
                            </span>
                          </h3>
                        </div>
                        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
                          {projects.map((p) => (
                            <li key={p._id}>
                              <Link
                                href={`/portfolio/${p.slug}`}
                                className="group block"
                              >
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-bg)] border border-[var(--color-line)]">
                                  <SanityImage
                                    image={p.coverImage}
                                    sizes="(min-width: 768px) 140px, 30vw"
                                    className="object-cover img-hover"
                                  />
                                </div>
                                <p className="mt-1.5 text-[0.7rem] text-[var(--color-ink)] leading-tight line-clamp-2">
                                  {p.title}
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
