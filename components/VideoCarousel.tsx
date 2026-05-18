"use client";

import { useRef } from "react";
import clsx from "clsx";
import VideoLightboxTile from "./VideoLightboxTile";

type VideoCard = {
  url: string;
  title?: string;
  description?: string;
  numberLabel?: string;
};

export default function VideoCarousel({
  items,
  orientation = "horizontal",
}: {
  items: VideoCard[];
  orientation?: "horizontal" | "vertical";
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const isVertical = orientation === "vertical";

  const cardWidthClass = isVertical
    ? "w-[180px] sm:w-[200px] md:w-[220px]"
    : "w-[280px] sm:w-[320px] md:w-[360px]";

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-vcard]");
    const step = (card?.offsetWidth ?? 220) + 16;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const showArrows = items.length > 1;

  return (
    <div className="relative">
      {showArrows ? (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll videos left"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-11 h-11 rounded-full bg-white border border-[var(--color-line)] shadow-md items-center justify-center hover:shadow-lg hover:bg-[var(--color-bg)] transition"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Scroll videos right"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-11 h-11 rounded-full bg-white border border-[var(--color-line)] shadow-md items-center justify-center hover:shadow-lg hover:bg-[var(--color-bg)] transition"
          >
            <span aria-hidden>→</span>
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        className="no-scrollbar overflow-x-auto flex gap-3 md:gap-4 snap-x snap-mandatory pb-4 px-6 md:px-10"
      >
        {items.map((item, i) => (
          <div
            key={`${item.url}-${i}`}
            data-vcard
            className={clsx("flex-shrink-0 snap-start", cardWidthClass)}
          >
            <VideoLightboxTile
              url={item.url}
              title={item.title}
              numberLabel={item.numberLabel}
              orientation={orientation}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
