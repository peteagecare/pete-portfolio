import Script from "next/script";

export default function SocialFeed({
  heading = "Off the lens",
  kicker = "Day to day",
}: {
  heading?: string;
  kicker?: string;
}) {
  const instagramUser = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME;
  const instagramUrl = instagramUser
    ? `https://www.instagram.com/${instagramUser}/`
    : null;

  return (
    <section className="border-t border-[var(--color-line)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-24 md:pt-32 pb-10 md:pb-14">
        <div className="flex items-end justify-between mb-12 md:mb-16 gap-6 flex-wrap">
          <div>
            <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-4">
              {heading}
            </span>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] max-w-[14ch]">
              {kicker}
            </h2>
          </div>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
            >
              Follow on Instagram ↗
            </a>
          ) : null}
        </div>

        <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
        <div
          className="elfsight-app-71c06c71-d29b-4e0c-be43-3f6294f4a7a0"
          data-elfsight-app-lazy
        />
      </div>
    </section>
  );
}
