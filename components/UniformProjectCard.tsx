import Link from "next/link";
import clsx from "clsx";
import SanityImage from "./SanityImage";
import type { ProjectSummary, ThumbnailOrientation } from "@/sanity/types";

const CATEGORY_LABEL: Record<string, string> = {
  social: "Social",
  photo: "Photography",
  video: "Videography",
  web: "Web",
  design: "Design",
};

const ASPECT_CLASS: Record<ThumbnailOrientation, string> = {
  landscape: "aspect-[16/9]",
  portrait: "aspect-[9/16]",
  square: "aspect-square",
};

export default function UniformProjectCard({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  showCategory = false,
  orientationOverride,
}: {
  project: ProjectSummary;
  priority?: boolean;
  sizes?: string;
  /** Show category label under the title (useful when grid mixes categories). */
  showCategory?: boolean;
  /** Force a specific thumbnail aspect (e.g. when the parent grid is single-orientation). */
  orientationOverride?: ThumbnailOrientation;
}) {
  const orientation: ThumbnailOrientation =
    orientationOverride ?? project.thumbnailOrientation ?? "landscape";

  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div
        className={clsx(
          "relative overflow-hidden bg-[var(--color-bg-soft)]",
          ASPECT_CLASS[orientation],
        )}
      >
        <SanityImage
          image={project.coverImage}
          sizes={sizes}
          priority={priority}
          className="object-cover img-hover"
        />
        <span
          aria-hidden
          className="absolute top-3 right-3 md:top-4 md:right-4 w-9 h-9 rounded-full bg-[var(--color-bg)]/90 backdrop-blur-sm flex items-center justify-center text-[var(--color-ink)] text-base transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </div>
      <div className="mt-5">
        <h3 className="font-display text-xl md:text-2xl text-[var(--color-ink)] leading-tight">
          {project.title}
        </h3>
        <p className="mt-2 text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
          {showCategory
            ? `${CATEGORY_LABEL[project.category] ?? project.category}${project.year ? ` · ${project.year}` : ""}`
            : project.year ?? ""}
        </p>
      </div>
    </Link>
  );
}
