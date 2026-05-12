import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  flickr: "Flickr",
  vimeo: "Vimeo",
  youtube: "YouTube",
  twitter: "X",
};

export default async function Footer() {
  const settings = await sanityFetch<SiteSettings | null>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });

  const social = settings?.socialLinks ?? [];

  return (
    <footer className="border-t border-[var(--color-line)] mt-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <span className="block font-serif italic text-2xl">
            Pete Jenkins
          </span>
          <span className="block mt-2 text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
            Nottingham, UK · Working UK-wide
          </span>
        </div>

        <div className="flex md:justify-end items-start gap-6 text-[0.7rem] tracking-[0.22em] uppercase">
          {social.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-ink)] hover:text-[var(--color-mute)]"
            >
              {PLATFORM_LABEL[s.platform] ?? s.platform}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-6 flex flex-col md:flex-row md:justify-between gap-2 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-mute)]">
          <span>© {new Date().getFullYear()} Pete Jenkins</span>
          <span>Built with Next.js + Sanity</span>
        </div>
      </div>
    </footer>
  );
}
