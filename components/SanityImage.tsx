import Image from "next/image";
import { urlFor, type SanityImage as TSanityImage } from "@/sanity/lib/image";

type Props = {
  image: TSanityImage | undefined | null;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** When true, image fills its parent (parent must be relative + sized). */
  fill?: boolean;
  /** When fill is false, provide width to render fixed size. */
  width?: number;
  height?: number;
  quality?: number;
};

export default function SanityImage({
  image,
  alt,
  sizes = "100vw",
  priority,
  className,
  fill = true,
  width,
  height,
  quality = 80,
}: Props) {
  if (!image?.asset) {
    return (
      <div
        className={`bg-[var(--color-bg-soft)] ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  const dim = image.metadata?.dimensions;
  const lqip = image.metadata?.lqip;
  const altText = alt ?? image.alt ?? "";

  if (fill) {
    return (
      <Image
        src={urlFor(image).quality(quality).url()}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip}
        className={className}
      />
    );
  }

  const w = width ?? dim?.width ?? 1600;
  const h = height ?? (dim ? Math.round(w / dim.aspectRatio) : 1067);

  return (
    <Image
      src={urlFor(image).width(w).quality(quality).url()}
      alt={altText}
      width={w}
      height={h}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      className={className}
    />
  );
}
