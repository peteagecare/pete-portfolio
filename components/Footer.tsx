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
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <span className="block font-serif italic text-2xl">
            Pete Jenkins
          </span>
          <span className="block mt-2 text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
            Nottingham, UK · Working UK-wide
          </span>
        </div>

        <div className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
          <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
            Get in touch
          </span>
          <a
            href="tel:+447568945934"
            className="block hover:text-[var(--color-ink)] transition-colors"
          >
            07568 945934
          </a>
          <a
            href="mailto:petejenkinss@hotmail.com"
            className="block hover:text-[var(--color-ink)] transition-colors"
          >
            petejenkinss@hotmail.com
          </a>
          <span className="block mt-2">
            2 Truman Street
            <br />
            Kimberley, Nottingham
            <br />
            NG16 2HA
          </span>
        </div>

        <div className="flex md:justify-end items-start gap-6 text-[0.7rem] tracking-[0.22em] uppercase flex-wrap">
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
