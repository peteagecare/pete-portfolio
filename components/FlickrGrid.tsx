"use client";

import { useState } from "react";
import Image from "next/image";
import FlickrLightbox from "./FlickrLightbox";
import type { FlickrPhoto } from "@/lib/flickr";

export default function FlickrGrid({ photos }: { photos: FlickrPhoto[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {photos.map((p, i) => (
          <li key={p.id} className="aspect-square">
            <button
              type="button"
              onClick={() => setSelectedIndex(i)}
              className="group block relative w-full h-full overflow-hidden bg-[var(--color-bg-soft)] cursor-pointer"
              aria-label={`${p.title || "Open photo"} — view details`}
            >
              <Image
                src={p.src}
                alt={p.title || "Flickr photo"}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover img-hover"
                unoptimized
              />
            </button>
          </li>
        ))}
      </ul>

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
