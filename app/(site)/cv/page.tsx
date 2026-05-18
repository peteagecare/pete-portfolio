import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  cvProjectsQuery,
  allEducationQuery,
} from "@/sanity/queries";
import type { Education, ProjectSummary } from "@/sanity/types";
import RoleProjects from "@/components/RoleProjects";
import {
  COMPANIES,
  flattenRoles,
  shortYearRange,
} from "@/lib/experience";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Pete Jenkins — six years across video, photography, design and web. Work history, tools and kit.",
  openGraph: {
    description:
      "Pete Jenkins — six years across video, photography, design and web. Work history, tools and kit.",
  },
};

const TOOLS_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Edit & Photo",
    items: ["Premiere Pro", "CapCut", "Lightroom", "Photoshop", "Canva"],
  },
  {
    label: "Cameras",
    items: ["Sony A7 V", "Sony A6700"],
  },
  {
    label: "Lenses & Support",
    items: [
      "Sigma 24-70mm F2.8 Art",
      "Sigma 18-50mm F2.8 DC",
      "Sigma 10-18mm F2.8 DC",
      "Sony FE 16mm F1.8 G",
      "DJI RS 3 Gimbal",
    ],
  },
];

const STATS: { headline: string; sublabel?: string; body: string }[] = [
  {
    headline: "3",
    sublabel: "TV adverts",
    body: "Shot or directed for national and regional broadcast",
  },
  {
    headline: "7",
    sublabel: "websites built",
    body: "From WordPress to Next.js, design through to deployment",
  },
  {
    headline: "4",
    sublabel: "person team",
    body: "Built and lead the in-house content team at Age Care Bathrooms",
  },
];

export default async function CVPage() {
  const [projects, education] = await Promise.all([
    sanityFetch<ProjectSummary[] | null>({
      query: cvProjectsQuery,
      tags: ["project"],
    }).then((r) => r ?? []),
    sanityFetch<Education[] | null>({
      query: allEducationQuery,
      tags: ["education"],
    }).then((r) => r ?? []),
  ]);

  const seenCompanies = new Set<string>();

  const flatRoles = flattenRoles(COMPANIES);

  return (
    <>
      <section className="pt-32 pb-6 md:pt-36 md:pb-8 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
          CV
        </span>
        <h1 className="font-display text-2xl md:text-3xl leading-tight">
          Work so far.
        </h1>
        <p className="mt-4 max-w-[68ch] text-[var(--color-ink-soft)] leading-relaxed text-base md:text-[1.0625rem]">
          Six years of creative work, three of them spent in-house at Age
          Care Bathrooms making pretty much everything that goes out: vertical
          social cuts, brand films, TV ads, photography, print and web. Most
          of what I know I taught myself, on the job, from running my own
          businesses before that.
        </p>
      </section>

      {/* TOOLS & KIT */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-12 md:pb-16">
        <h2 className="font-display text-2xl md:text-3xl mb-6 md:mb-8 border-b border-[var(--color-line)] pb-3">
          Tools & Kit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {TOOLS_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
                {g.label}
              </p>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-1 text-[0.75rem] text-[var(--color-ink)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 md:mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[0.7rem] tracking-[0.22em] uppercase">
          <Link
            href="/equipment"
            className="border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
          >
            Full equipment list →
          </Link>
          <Link
            href="/software"
            className="border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
          >
            Full software list →
          </Link>
        </div>
      </section>

      {/* SOME NUMBERS */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-12 md:pb-16">
        <h2 className="font-display text-2xl md:text-3xl mb-6 md:mb-8 border-b border-[var(--color-line)] pb-3">
          Some numbers
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {STATS.map((s) => (
            <li key={s.headline + s.body}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className={
                    s.sublabel
                      ? "font-display text-5xl md:text-6xl leading-none"
                      : "font-display text-2xl md:text-3xl leading-tight"
                  }
                >
                  {s.headline}
                </span>
                {s.sublabel ? (
                  <span className="font-display text-base md:text-lg text-[var(--color-mute)]">
                    {s.sublabel}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-[28ch]">
                {s.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-16">
          <div className="min-w-0">
            <h2 className="font-display text-2xl md:text-3xl mb-6 md:mb-8 border-b border-[var(--color-line)] pb-3">
              Experience
            </h2>
            <ol className="space-y-10">
              {flatRoles.map((r) => {
                const showProjects = !seenCompanies.has(r.companyId);
                if (showProjects) seenCompanies.add(r.companyId);
                const roleProjects = showProjects
                  ? projects.filter((p) => p.cvCompanies?.includes(r.companyId))
                  : [];
                return (
                  <li
                    key={`${r.companyId}-${r.title}-${r.start}`}
                    className="grid grid-cols-[88px_1fr] md:grid-cols-[110px_1fr] gap-4 md:gap-6 items-start"
                  >
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-soft)] text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-ink)] whitespace-nowrap">
                      {shortYearRange(r.start, r.end)}
                    </span>
                    <div>
                      <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                        {r.companyName}
                      </p>
                      <h3 className="font-display text-lg md:text-xl text-[var(--color-ink)] leading-tight">
                        {r.title}
                      </h3>
                      <p className="text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-mute)] mt-1">
                        {r.start} — {r.end}
                      </p>
                      {r.description ? (
                        <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm mt-3">
                          {r.description}
                        </p>
                      ) : null}
                      {roleProjects.length > 0 ? (
                        <RoleProjects
                          projects={roleProjects}
                          companyName={r.companyName}
                        />
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl mb-6 md:mb-8 border-b border-[var(--color-line)] pb-3">
              Education
            </h2>
            {education.length === 0 ? (
              <p className="font-serif italic text-[var(--color-mute)]">
                Add an education entry in the Studio.
              </p>
            ) : (
              <ol className="space-y-6">
                {education.map((e) => (
                  <li
                    key={e._id}
                    className="grid grid-cols-[88px_1fr] md:grid-cols-[110px_1fr] gap-4 md:gap-6 items-start"
                  >
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-soft)] text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-ink)] whitespace-nowrap">
                      {e.endYear ? `${e.startYear} – ${e.endYear}` : `${e.startYear} – Now`}
                    </span>
                    <div>
                      <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                        {e.institution}
                      </p>
                      <h3 className="font-display text-lg md:text-xl text-[var(--color-ink)] leading-tight">
                        {e.qualification}
                      </h3>
                      {e.description ? (
                        <p className="text-[var(--color-ink-soft)] leading-relaxed text-[0.95rem] mt-2">
                          {e.description}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

    </>
  );
}
