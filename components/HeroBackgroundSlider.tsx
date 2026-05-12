"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import SanityImage from "./SanityImage";
import type { SanityImage as TSanityImage } from "@/sanity/lib/image";

type Props = {
  images: TSanityImage[];
  intervalMs?: number;
  className?: string;
};

export default function HeroBackgroundSlider({
  images,
  intervalMs = 5500,
  className,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) {
    return (
      <div
        className={clsx(
          "absolute inset-0 bg-[var(--color-bg-soft)]",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={clsx("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {images.map((img, i) => (
        <div
          key={i}
          className={clsx(
            "absolute inset-0 transition-opacity ease-in-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDuration: "1400ms" }}
        >
          <SanityImage
            image={img}
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
