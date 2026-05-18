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
import VideoCarousel from "@/components/VideoCarousel";
import VideoLightboxTile from "@/components/VideoLightboxTile";
import ProjectGallery from "@/components/ProjectGallery";

const CATEGORY_LABEL: Record<string, string> = {
  social: "Social",
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

  const orientation = project.videoOrientation ?? "horizontal";
  const galleryVideos = (project.videoGallery ?? []).map((v, i) => ({
    url: v.url,
    title: v.title,
    description: v.description,
    numberLabel: `No. ${String(i + 1).padStart(2, "0")}`,
  }));
  const carouselItems = project.videoUrl
    ? [
        {
          url: project.videoUrl,
          title: project.title,
          numberLabel: "Featured",
        },
        ...galleryVideos,
      ]
    : galleryVideos;

  const hasVideoCarousel = carouselItems.length > 1;
  const hasSingleVideo = !hasVideoCarousel && carouselItems.length === 1;

  const coverIsAvailable = Boolean(project.coverImage?.asset);
  const showVideoInHero = hasSingleVideo;
  const showCoverInHero = coverIsAvailable && !showVideoInHero;
  const heroHasMedia = showVideoInHero || showCoverInHero;

  const coverAspectClass =
    project.thumbnailOrientation === "portrait"
      ? "aspect-[9/16] max-w-[240px] md:max-w-[260px] mx-auto"
      : project.thumbnailOrientation === "square"
        ? "aspect-square max-w-[420px] mx-auto"
        : "aspect-[16/9]";

  const heroVideoWrapClass =
    orientation === "vertical"
      ? "max-w-[240px] md:max-w-[260px] mx-auto"
      : "max-w-full";

  return (
    <article>
      {/* HERO — left: title, description, meta table | right: cover image */}
      <section className="pt-24 md:pt-28 pb-4 md:pb-6 mx-auto max-w-[1600px] px-6 md:px-10 grid md:grid-cols-12 gap-6 md:gap-10">
        <div className={heroHasMedia ? "md:col-span-7" : "md:col-span-12"}>
          <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
            {CATEGORY_LABEL[project.category] ?? project.category}
          </span>
          <h1 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[0.98] mb-3 max-w-[22ch]">
            {project.title}
          </h1>

          <div className="text-[var(--color-ink-soft)] leading-snug text-[0.9rem] md:text-[0.95rem] max-w-prose">
            <PortableText value={project.description} />
          </div>

          <dl className="mt-5 space-y-2.5 text-sm border-t border-[var(--color-line)] pt-4 max-w-prose">
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
        </div>

        {showVideoInHero ? (
          <div className="md:col-span-5">
            <div className={heroVideoWrapClass}>
              <VideoLightboxTile
                url={carouselItems[0].url}
                orientation={orientation}
                showCaption={false}
              />
            </div>
          </div>
        ) : showCoverInHero ? (
          <div className="md:col-span-5">
            <div
              className={`relative w-full overflow-hidden bg-[var(--color-bg-soft)] border border-[var(--color-line)] ${coverAspectClass}`}
            >
              <SanityImage
                image={project.coverImage}
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="object-cover object-top"
              />
            </div>
          </div>
        ) : null}
      </section>

      {/* VIDEO ROW — smaller Netflix-style tiles, click opens lightbox */}
      {hasVideoCarousel ? (
        <section className="mb-10 md:mb-14">
          <VideoCarousel items={carouselItems} orientation={orientation} />
        </section>
      ) : null}

      {project.gallery && project.gallery.length > 0 ? (
        project.category === "photo" ? (
          <section className="mb-10 md:mb-14">
            <ProjectGallery images={project.gallery} layout="scroll" />
          </section>
        ) : (
          <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-24">
            <ProjectGallery images={project.gallery} />
          </section>
        )
      ) : null}

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
    <div className="flex justify-between items-baseline gap-4 border-b border-[var(--color-line)] pb-2">
      <dt className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
        {label}
      </dt>
      <dd className="text-[var(--color-ink)] text-right text-sm">{value}</dd>
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
