import { getRecentFlickrPhotos, flickrProfileUrl } from "@/lib/flickr";
import FlickrCarousel from "./FlickrCarousel";

export default async function FlickrFeed({
  count = 12,
  heading = "Latest from the lens",
  kicker = "Fresh on Flickr",
}: {
  count?: number;
  heading?: string;
  kicker?: string;
}) {
  const [photos, profile] = await Promise.all([
    getRecentFlickrPhotos(count),
    Promise.resolve(flickrProfileUrl()),
  ]);

  if (photos.length === 0) return null;

  return (
    <section className="border-t border-[var(--color-line)] bg-[var(--color-bg)]">
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
              View on Flickr ↗
            </a>
          ) : null}
        </div>

        <FlickrCarousel photos={photos} />
      </div>
    </section>
  );
}
