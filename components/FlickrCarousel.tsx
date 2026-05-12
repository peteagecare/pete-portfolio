"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import FlickrLightbox from "./FlickrLightbox";
import type { FlickrPhoto } from "@/lib/flickr";

export default function FlickrCarousel({
  photos,
}: {
  photos: FlickrPhoto[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || photos.length === 0) return;

    let raf = 0;
    let paused = false;
    let resumeTimer: number | undefined;
    const speed = 0.4;

    const tick = () => {
      if (!paused) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    const pauseFor = (ms: number) => {
      paused = true;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, ms);
    };

    const onPointerEnter = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };
    const onPointerLeave = () => {
      paused = false;
    };
    const onTouchStart = () => pauseFor(2500);
    const onWheel = () => pauseFor(2500);

    el.addEventListener("mouseenter", onPointerEnter);
    el.addEventListener("mouseleave", onPointerLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      el.removeEventListener("mouseenter", onPointerEnter);
      el.removeEventListener("mouseleave", onPointerLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("wheel", onWheel);
    };
  }, [photos.length]);

  const looped = photos.length > 0 ? [...photos, ...photos] : [];

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-x-auto no-scrollbar -mx-6 md:-mx-10 px-6 md:px-10"
      >
        <ul className="flex gap-3 md:gap-4 min-w-max">
          {looped.map((p, i) => {
            const realIndex = i % photos.length;
            return (
              <li
                key={`${p.id}-${i}`}
                className="aspect-square w-[200px] md:w-[240px] flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(realIndex)}
                  className="group block relative w-full h-full overflow-hidden bg-[var(--color-bg-soft)] cursor-pointer"
                  aria-label={`${p.title || "Open photo"} — view details`}
                >
                  <Image
                    src={p.src}
                    alt={p.title || "Flickr photo"}
                    fill
                    sizes="240px"
                    className="object-cover img-hover"
                    unoptimized
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {selectedIndex !== null ? (
        <FlickrLightbox
          photos={photos}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={(i) => setSelectedIndex(i)}
        />
      ) : null}
    </>
  );
}
