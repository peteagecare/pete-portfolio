"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SanityImage from "./SanityImage";
import type { SanityImage as TSanityImage } from "@/sanity/lib/image";

export default function ProjectGallery({
  images,
}: {
  images: TSanityImage[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-16 space-y-10">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label="Open image"
            className="group relative w-full overflow-hidden bg-[var(--color-bg-soft)] block cursor-zoom-in"
            style={{
              aspectRatio: img.metadata?.dimensions?.aspectRatio ?? 1.5,
            }}
          >
            <SanityImage
              image={img}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover img-hover"
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <Lightbox
          images={images}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: TSanityImage[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const img = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1)
        onNavigate(index + 1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
    >
      {index > 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 z-10"
        >
          <ChevronLeft size={22} />
        </button>
      ) : null}
      {index < images.length - 1 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 z-10"
        >
          <ChevronRight size={22} />
        </button>
      ) : null}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 z-10"
      >
        <X size={22} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full flex items-center justify-center"
      >
        <div
          className="relative w-full max-w-7xl"
          style={{
            aspectRatio: img.metadata?.dimensions?.aspectRatio ?? 1.5,
            maxHeight: "90vh",
          }}
        >
          <SanityImage
            image={img}
            sizes="100vw"
            priority
            className="object-contain"
            quality={95}
          />
        </div>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.65rem] tracking-[0.22em] uppercase text-white/70">
          {index + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
