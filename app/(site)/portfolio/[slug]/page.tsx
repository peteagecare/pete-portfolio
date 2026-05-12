import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import {
  projectBySlugQuery,
  projectSlugsQuery,
} from "@/sanity/queries";
import type { Project } from "@/sanity/types";
import SanityImage from "@/components/SanityImage";
import PortableText from "@/components/PortableText";
import VideoEmbed from "@/components/VideoEmbed";
import ProjectGallery from "@/components/ProjectGallery";

const CATEGORY_LABEL: Record<string, string> = {
  photo: "Photography",
  video: "Videography",
  web: "Web",
  design: "Design",
};

type Params = { slug: string };

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(projectSlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project"],
  });
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.client
      ? `${project.title} — ${CATEGORY_LABEL[project.category]} for ${project.client}`
      : `${project.title} — ${CATEGORY_LABEL[project.category]} project by Pete Jenkins.`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project"],
  });

  if (!project) notFound();

  return (
    <article>
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-40 pb-16 md:pb-24 grid md:grid-cols-12 gap-10 md:gap-16">
        <aside className="md:col-span-5">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-soft)] border border-[var(--color-line)] mb-10">
            <SanityImage
              image={project.coverImage}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              className="object-cover object-top"
            />
          </div>

          <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
            {CATEGORY_LABEL[project.category] ?? project.category}
          </span>
          <dl className="space-y-5 text-sm border-t border-[var(--color-line)] pt-6">
            {project.year ? (
              <Meta label="Year" value={String(project.year)} />
            ) : null}
            {project.client ? (
              <Meta label="Client" value={project.client} />
            ) : null}
            {project.role ? <Meta label="Role" value={project.role} /> : null}
            {project.externalUrl ? (
              <Meta
                label="Visit"
                value={
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {prettyUrl(project.externalUrl)} ↗
                  </a>
                }
              />
            ) : null}
            {project.software && project.software.length > 0 ? (
              <Meta
                label="Software"
                value={
                  <span>
                    {project.software.map((s) => s.name).join(", ")}
                  </span>
                }
              />
            ) : null}
          </dl>
        </aside>

        <div className="md:col-span-7">
          <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] mb-10">
            {project.title}
          </h1>

          {project.videoUrl ? (
            <div className="mb-12">
              <VideoEmbed url={project.videoUrl} />
            </div>
          ) : null}

          <PortableText value={project.description} />

          {project.videoGallery && project.videoGallery.length > 0 ? (
            <div className="mt-12 space-y-12">
              {project.videoGallery.map((v, i) => (
                <div key={i}>
                  {v.title ? (
                    <h3 className="font-display text-xl md:text-2xl mb-4">
                      {v.title}
                    </h3>
                  ) : null}
                  <VideoEmbed url={v.url} />
                  {v.description ? (
                    <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed text-[0.95rem]">
                      {v.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {project.gallery && project.gallery.length > 0 ? (
            <ProjectGallery images={project.gallery} />
          ) : null}
        </div>
      </section>

      <div className="border-t border-[var(--color-line)] mx-auto max-w-[1600px] px-6 md:px-10 py-12 flex justify-between items-center">
        <Link
          href="/portfolio"
          className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1"
        >
          ← All work
        </Link>
        <Link
          href="/contact"
          className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1"
        >
          Start a project →
        </Link>
      </div>
    </article>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-baseline gap-4 border-b border-[var(--color-line)] pb-3">
      <dt className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
        {label}
      </dt>
      <dd className="text-[var(--color-ink)] text-right">{value}</dd>
    </div>
  );
}

function prettyUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
