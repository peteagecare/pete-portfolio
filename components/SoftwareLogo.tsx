"use client";

import { useState } from "react";

const FALLBACK_PALETTE = [
  "bg-amber-300 text-[#1B2447]",
  "bg-rose-400 text-white",
  "bg-sky-400 text-white",
  "bg-violet-400 text-white",
  "bg-emerald-400 text-[#1B2447]",
  "bg-indigo-400 text-white",
  "bg-orange-400 text-white",
  "bg-teal-400 text-[#1B2447]",
];

function paletteFor(name: string): string {
  const hash = Array.from(name).reduce(
    (a, c) => (a + c.charCodeAt(0)) >>> 0,
    0,
  );
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}

export default function SoftwareLogo({
  name,
  sources,
}: {
  name: string;
  sources: string[];
}) {
  const [index, setIndex] = useState(0);
  const errored = index >= sources.length;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (errored) {
    return (
      <div
        className={`w-full h-full rounded-xl flex items-center justify-center font-display text-2xl md:text-3xl ${paletteFor(name)}`}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      key={sources[index]}
      src={sources[index]}
      alt=""
      aria-hidden
      loading="lazy"
      width={56}
      height={56}
      className="max-w-full max-h-full"
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
