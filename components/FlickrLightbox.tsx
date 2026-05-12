"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { FlickrPhoto, FlickrPhotoDetails } from "@/lib/flickr";

export default function FlickrLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: FlickrPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const photo = photos[index];
  const [details, setDetails] = useState<FlickrPhotoDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch details whenever the selected photo changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDetails(null);
    fetch(`/api/flickr/${photo.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return;
        setDetails(d);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [photo.id]);

  // Keyboard nav: Esc closes, ←/→ paginate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < photos.length - 1)
        onNavigate(index + 1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, photos.length, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || "Photo details"}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
    >
      {/* Prev / next */}
      {index > 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 z-10"
        >
          <ChevronLeft size={20} />
        </button>
      ) : null}
      {index < photos.length - 1 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 z-10"
        >
          <ChevronRight size={20} />
        </button>
      ) : null}

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 z-10"
      >
        <X size={20} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-7xl max-h-[92vh] grid md:grid-cols-[1fr_340px] gap-0 bg-[var(--color-bg)] overflow-hidden shadow-2xl"
      >
        {/* Image */}
        <div className="relative bg-black flex items-center justify-center min-h-[40vh] md:min-h-[60vh]">
          <Image
            key={photo.id}
            src={photo.src}
            alt={photo.title || "Flickr photo"}
            width={1600}
            height={1067}
            unoptimized
            priority
            className="object-contain max-h-[90vh] w-auto h-auto"
          />
        </div>

        {/* Details */}
        <aside className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-[40vh] md:max-h-[92vh]">
          <div>
            <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
              From Flickr · {index + 1} of {photos.length}
            </span>
            <h2 className="font-display text-xl md:text-2xl leading-tight text-[var(--color-ink)]">
              {photo.title || "Untitled"}
            </h2>
            {details?.description ? (
              <p className="mt-3 text-[var(--color-ink-soft)] text-sm leading-relaxed">
                {details.description}
              </p>
            ) : null}
          </div>

          {loading ? (
            <p className="text-sm text-[var(--color-mute)] font-serif italic">
              Loading details…
            </p>
          ) : details ? (
            <>
              {details.albums.length > 0 ? (
                <div>
                  <h3 className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
                    {details.albums.length === 1 ? "Album" : "Albums"}
                  </h3>
                  <ul className="space-y-1">
                    {details.albums.map((a) => (
                      <li
                        key={a.id}
                        className="font-serif italic text-lg text-[var(--color-ink)]"
                      >
                        {a.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {details.camera ? (
                <div>
                  <h3 className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
                    Shot on
                  </h3>
                  <p className="text-[var(--color-ink)]">{details.camera}</p>
                  {details.lens ? (
                    <p className="text-sm text-[var(--color-ink-soft)] mt-1">
                      {details.lens}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {details.focalLength ||
              details.aperture ||
              details.shutter ||
              details.iso ? (
                <div>
                  <h3 className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
                    Settings
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {details.focalLength ? (
                      <Stat
                        label="Focal length"
                        value={appendUnit(details.focalLength, "mm")}
                      />
                    ) : null}
                    {details.aperture ? (
                      <Stat
                        label="Aperture"
                        value={prependPrefix(details.aperture, "f/")}
                      />
                    ) : null}
                    {details.shutter ? (
                      <Stat
                        label="Shutter"
                        value={appendUnit(details.shutter, "s")}
                      />
                    ) : null}
                    {details.iso ? (
                      <Stat label="ISO" value={details.iso} />
                    ) : null}
                  </dl>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-[var(--color-mute)] font-serif italic">
              Couldn&apos;t load extended details.
            </p>
          )}

          <a
            href={photo.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto pt-4 text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 self-start hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
          >
            View on Flickr ↗
          </a>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--color-mute)] mb-0.5">
        {label}
      </dt>
      <dd className="text-[var(--color-ink)] font-serif italic">{value}</dd>
    </div>
  );
}

function appendUnit(value: string, unit: string): string {
  return value.toLowerCase().includes(unit.toLowerCase()) ? value : `${value} ${unit}`;
}

function prependPrefix(value: string, prefix: string): string {
  return value.toLowerCase().startsWith(prefix.toLowerCase())
    ? value
    : `${prefix}${value}`;
}
