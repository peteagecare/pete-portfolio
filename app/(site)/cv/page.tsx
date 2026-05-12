import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { cvProjectsQuery, allSoftwareQuery } from "@/sanity/queries";
import type { ProjectSummary, Software } from "@/sanity/types";
import SanityImage from "@/components/SanityImage";

export const metadata: Metadata = {
  title: "CV",
  description: "Pete Jenkins — work history and roles.",
};

type Role = {
  title: string;
  start: string;
  end: string;
  description?: string;
};

type Company = {
  id: string;
  name: string;
  roles: Role[];
};

const COMPANIES: Company[] = [
  {
    id: "age-care-bathrooms",
    name: "Age Care Bathrooms",
    roles: [
      {
        title: "Head of Marketing",
        start: "March 2024",
        end: "Present",
        description:
          "Grew the company from relying on an outside marketing agency to an in-house team of four marketers.",
      },
      {
        title: "Freelance Marketing Executive",
        start: "February 2023",
        end: "March 2024",
        description:
          "Started here as a freelance marketer, working in-house alongside a marketing agency.",
      },
    ],
  },
  {
    id: "lime-tree-music-centre",
    name: "Lime Tree Music Centre",
    roles: [
      { title: "Co-Director", start: "September 2022", end: "Present" },
      {
        title: "Guitar & Bass Tutor",
        start: "September 2018",
        end: "October 2022",
      },
    ],
  },
  {
    id: "the-musical-me",
    name: "The Musical Me",
    roles: [{ title: "Co-Director", start: "June 2020", end: "March 2024" }],
  },
];

export default async function CVPage() {
  const [projects, software] = await Promise.all([
    sanityFetch<ProjectSummary[] | null>({
      query: cvProjectsQuery,
      tags: ["project"],
    }).then((r) => r ?? []),
    sanityFetch<Software[] | null>({
      query: allSoftwareQuery,
      tags: ["software"],
    }).then((r) => r ?? []),
  ]);

  return (
    <>
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
          CV
        </span>
        <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] max-w-[18ch] mb-6">
          Work
          <br />
          <span className="font-serif italic font-normal normal-case">
            so far.
          </span>
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-32 space-y-20 md:space-y-28">
        {COMPANIES.map((company) => {
          const companyProjects = projects.filter((p) =>
            p.cvCompanies?.includes(company.id)
          );

          return (
            <div key={company.id}>
              <div className="flex items-baseline justify-between mb-8 md:mb-10 border-b border-[var(--color-line)] pb-4">
                <h2 className="font-display text-2xl md:text-3xl">
                  {company.name}
                </h2>
                <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
                  {company.roles.length}{" "}
                  {company.roles.length === 1 ? "role" : "roles"}
                </span>
              </div>

              <div className="space-y-10 max-w-[1100px]">
                {company.roles.map((role) => (
                  <article
                    key={role.title}
                    className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-10"
                  >
                    <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] md:pt-1">
                      {role.start} — {role.end}
                    </p>
                    <div>
                      <h3 className="font-display text-lg md:text-xl text-[var(--color-ink)] leading-tight mb-3">
                        {role.title}
                      </h3>
                      {role.description ? (
                        <p className="text-[var(--color-ink-soft)] leading-relaxed text-[0.95rem]">
                          {role.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              {companyProjects.length > 0 ? (
                <ProjectCarousel
                  projects={companyProjects}
                  label="Work from this role"
                />
              ) : null}

              {(() => {
                const tools = software.filter((s) =>
                  s.cvCompanies?.includes(company.id)
                );
                if (tools.length === 0) return null;
                return (
                  <div className="mt-10 md:mt-12">
                    <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-4">
                      Software used
                    </span>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 max-w-[1100px] text-[0.95rem] text-[var(--color-ink)]">
                      {tools.map((s) => (
                        <li key={s._id}>{s.name}</li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </section>
    </>
  );
}

function ProjectCarousel({
  projects,
  label,
}: {
  projects: ProjectSummary[];
  label: string;
}) {
  return (
    <div className="mt-10 md:mt-12">
      <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-4">
        {label}
      </span>
      <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10 pb-2">
        <ul className="flex gap-4 md:gap-5 min-w-max">
          {projects.map((p) => (
            <li key={p._id} className="w-[200px] flex-shrink-0">
              <MiniProjectCard project={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MiniProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-bg-soft)] border border-[var(--color-line)]">
        <SanityImage
          image={project.coverImage}
          sizes="200px"
          className="object-cover object-top img-hover"
        />
      </div>
      <h4 className="mt-2 font-display text-sm text-[var(--color-ink)] leading-tight">
        {project.title}
      </h4>
      {project.year ? (
        <p className="mt-0.5 text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
          {project.year}
        </p>
      ) : null}
    </Link>
  );
}
