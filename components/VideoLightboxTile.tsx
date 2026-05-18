"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Play, X } from "lucide-react";
import VideoEmbed from "./VideoEmbed";
import { parseVideoUrl, getYouTubeThumbnail } from "@/lib/video";

export default function VideoLightboxTile({
  url,
  title,
  numberLabel,
  orientation = "horizontal",
  className,
  showCaption = true,
}: {
  url: string;
  title?: string;
  numberLabel?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  showCaption?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const parsed = parseVideoUrl(url);
  const thumb =
    parsed?.provider === "YouTube" ? getYouTubeThumbnail(parsed.id) : null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isVertical = orientation === "vertical";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx("group block w-full text-left", className)}
        aria-label={title ? `Play ${title}` : "Play video"}
      >
        <div
          className={clsx(
            "relative overflow-hidden bg-black w-full transition-transform duration-300 group-hover:scale-[1.02]",
            isVertical ? "aspect-[9/16]" : "aspect-video",
          )}
        >
          {thumb ? (
            <img
              src={thumb}
              alt={title ?? ""}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 text-black shadow-lg group-hover:scale-110 transition-transform">
              <Play
                className="w-5 h-5 md:w-6 md:h-6 ml-0.5"
                fill="currentColor"
              />
            </span>
          </div>
        </div>
        {showCaption && (title || numberLabel) ? (
          <div className="mt-3">
            {numberLabel ? (
              <span className="block text-[0.55rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                {numberLabel}
              </span>
            ) : null}
            {title ? (
              <h3 className="font-display text-sm md:text-base leading-tight">
                {title}
              </h3>
            ) : null}
          </div>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Video player"}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close video"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className={clsx(
              "w-full",
              isVertical
                ? "max-w-[min(420px,calc(100vh-6rem)*9/16)]"
                : "max-w-5xl",
            )}
          >
            <VideoEmbed url={url} orientation={orientation} autoplay />
            {title ? (
              <h3 className="mt-4 font-display text-base md:text-lg text-white text-center">
                {title}
              </h3>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
