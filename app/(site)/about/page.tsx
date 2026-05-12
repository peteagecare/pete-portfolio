import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";
import SanityImage from "@/components/SanityImage";
import PortableText from "@/components/PortableText";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pete Jenkins — Nottingham-based photographer, filmmaker and web developer. Currently Head of Marketing at Age Care Bathrooms.",
};

export default async function AboutPage() {
  const settings = await sanityFetch<SiteSettings | null>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });

  return (
    <>
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
          About
        </span>
        <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] max-w-[14ch]">
          Pete Jenkins,
          <br />
          <span className="font-serif italic font-normal normal-case">
            in three minutes.
          </span>
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-32 grid md:grid-cols-12 gap-10 md:gap-16">
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-bg-soft)] md:sticky md:top-32">
            <SanityImage
              image={settings?.headshot}
              sizes="(min-width: 768px) 40vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="md:col-span-7">
          {settings?.aboutText && settings.aboutText.length > 0 ? (
            <PortableText value={settings.aboutText} />
          ) : (
            <DefaultAboutCopy />
          )}

          <div className="mt-16 grid sm:grid-cols-2 gap-10 border-t border-[var(--color-line)] pt-10">
            <div>
              <h2 className="font-display text-xl mb-4">What I shoot</h2>
              <ul className="space-y-2 text-[var(--color-ink-soft)]">
                <li>Editorial portraits</li>
                <li>Brand stills &amp; product</li>
                <li>Weddings &amp; events</li>
                <li>Documentary &amp; travel</li>
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl mb-4">What I build</h2>
              <ul className="space-y-2 text-[var(--color-ink-soft)]">
                <li>Marketing sites (WordPress)</li>
                <li>Headless builds (Next.js + Sanity)</li>
                <li>Lead engines &amp; landing pages</li>
                <li>Performance &amp; SEO retrofits</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function DefaultAboutCopy() {
  return (
    <div className="prose-editorial">
      <p className="font-serif italic text-2xl text-[var(--color-ink)] !leading-snug !mb-10">
        I&apos;m based in Nottingham, working across photography, video and
        the web. I shoot, I edit, I build.
      </p>
      <p>
        I picked up a point-and-shoot at 14 and never really put it down.
        Twenty-odd years later I&apos;m still doing the same thing, just with
        better kit.
      </p>
      <p>
        Today I&apos;m Head of Marketing at Age Care Bathrooms, running the
        full marketing function: paid media, SEO, CRM, content, and the data
        work that ties them together. The marketing job means I think about
        audience and conversion alongside the craft.
      </p>
      <p>
        Outside that I shoot weddings and editorial portraits across the
        Midlands and London, and build sites for friends, agencies and small
        brands. Owner-operated when the brief asks for it, with a small
        regular crew when it doesn&apos;t.
      </p>
      <p>
        If you&apos;ve got something in mind,{" "}
        <a href="/contact">drop me a line</a>.
      </p>
    </div>
  );
}
