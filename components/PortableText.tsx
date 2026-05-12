import {
  PortableText as BasePortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import SanityImage from "./SanityImage";
import type { SanityImage as TSanityImage } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    em: ({ children }) => (
      <em className="font-serif italic text-[var(--color-ink)]">{children}</em>
    ),
    strong: ({ children }) => (
      <strong className="font-medium text-[var(--color-ink)]">{children}</strong>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: TSanityImage }) => (
      <figure className="my-10 -mx-2 sm:mx-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SanityImage image={value} sizes="(min-width: 768px) 68ch, 100vw" />
        </div>
        {value?.alt ? (
          <figcaption className="mt-3 text-xs italic text-[var(--color-mute)] font-serif">
            {value.alt}
          </figcaption>
        ) : null}
      </figure>
    ),
  },
};

export default function PortableText({
  value,
  className,
}: {
  value?: PortableTextBlock[];
  className?: string;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className={`prose-editorial ${className ?? ""}`}>
      <BasePortableText value={value} components={components} />
    </div>
  );
}
