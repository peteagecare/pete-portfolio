import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allProjectsQuery } from "@/sanity/queries";
import type { ProjectSummary } from "@/sanity/types";
import PortfolioFilter from "@/components/PortfolioFilter";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected photography, video, web and design projects by Pete Jenkins, Nottingham UK.",
};

type SearchParams = Promise<{ category?: string | string[] }>;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;
  const initialCategory = Array.isArray(category) ? category[0] : category;

  const projects =
    (await sanityFetch<ProjectSummary[] | null>({
      query: allProjectsQuery,
      tags: ["project"],
    })) ?? [];

  return (
    <>
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
          Portfolio
        </span>
        <h1 className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] max-w-[18ch]">
          Selected{" "}
          <span className="font-serif italic font-normal normal-case">
            work.
          </span>
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-32">
        <PortfolioFilter
          projects={projects}
          initialCategory={initialCategory}
        />
      </section>
    </>
  );
}
