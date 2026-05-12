import Image from "next/image";
import { Play } from "lucide-react";
import {
  getRecentInstagramMedia,
  instagramProfileUrl,
} from "@/lib/instagram";

export default async function InstagramFeed({
  count = 9,
  heading = "On Instagram",
  kicker = "Day to day",
}: {
  count?: number;
  heading?: string;
  kicker?: string;
}) {
  const [posts, profile] = await Promise.all([
    getRecentInstagramMedia(count),
    Promise.resolve(instagramProfileUrl()),
  ]);

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between mb-12 md:mb-16 gap-6 flex-wrap">
          <div>
            <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-4">
              {heading}
            </span>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] max-w-[14ch]">
              {kicker}
            </h2>
          </div>
          {profile ? (
            <a
              href={profile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
            >
              Follow on Instagram ↗
            </a>
          ) : null}
        </div>

        <ul className="grid grid-cols-3 gap-2 md:gap-3">
          {posts.map((p) => (
            <li key={p.id} className="aspect-square">
              <a
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative w-full h-full overflow-hidden bg-[var(--color-bg)]"
                aria-label={p.caption ? p.caption.slice(0, 80) : "Instagram post"}
              >
                {p.displayUrl ? (
                  <Image
                    src={p.displayUrl}
                    alt={p.caption || "Instagram post"}
                    fill
                    sizes="(min-width: 768px) 33vw, 33vw"
                    className="object-cover img-hover"
                    unoptimized
                  />
                ) : null}
                {p.mediaType === "VIDEO" ? (
                  <span className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5">
                    <Play size={14} fill="currentColor" />
                  </span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
