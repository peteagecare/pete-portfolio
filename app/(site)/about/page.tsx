import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery, latestProjectsQuery } from "@/sanity/queries";
import type { SiteSettings, ProjectSummary } from "@/sanity/types";
import SanityImage from "@/components/SanityImage";
import PortableText from "@/components/PortableText";
import Reveal from "@/components/Reveal";
import RecentProjectsCarousel from "@/components/RecentProjectsCarousel";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pete Jenkins — Nottingham-based creative working across video, photography, design and web.",
  openGraph: {
    description:
      "Pete Jenkins — Nottingham-based creative working across video, photography, design and web.",
  },
};

export default async function AboutPage() {
  const [settings, latestRaw] = await Promise.all([
    sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ["siteSettings"],
    }),
    sanityFetch<ProjectSummary[] | null>({
      query: latestProjectsQuery,
      tags: ["project"],
    }),
  ]);
  const latest = latestRaw ?? [];

  return (
    <>
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
          About
        </span>
        <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] max-w-[20ch]">
          A bit about me
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

          <div className="mt-16 border-t border-[var(--color-line)] pt-10">
            <h2 className="font-display text-xl mb-4">Get in touch</h2>
            <ul className="space-y-2 text-[var(--color-ink-soft)]">
              <li>
                <a href="tel:+447568945934" className="hover:text-[var(--color-ink)] transition-colors">
                  07568 945934
                </a>
              </li>
              <li>
                <a href="mailto:petejenkinss@hotmail.com" className="hover:text-[var(--color-ink)] transition-colors">
                  petejenkinss@hotmail.com
                </a>
              </li>
              <li>2 Truman Street</li>
              <li>Kimberley, Nottingham</li>
              <li>NG16 2HA</li>
            </ul>
          </div>
        </Reveal>
      </section>

      <div className="border-t border-[var(--color-line)]">
        <RecentProjectsCarousel projects={latest} />
      </div>
    </>
  );
}

function DefaultAboutCopy() {
  return (
    <div className="prose-editorial">
      <p className="font-serif italic text-2xl text-[var(--color-ink)] !leading-snug !mb-10">
        I&apos;m a creative based in Nottingham, working across video,
        photography, design and web. I shoot, I edit, I build, and I like
        that no two days look the same.
      </p>
      <p>
        My route in was music, not film school. I did a BA (Hons) in Music
        Production at York St John, started teaching with Rocksteady, then
        set up my own business, The Musical Me, where we launched World
        Music Day for primary schools across the UK. Around the same time
        my friend Harry gave me a start teaching guitar at Lime Tree Music
        Centre in Matlock. When he moved on to start a family, Corinne and
        I bought it off him and grew it into a thriving music centre
        that&apos;s still going strong.
      </p>
      <p>
        Wanting a new kind of challenge, I ended up at Age Care Bathrooms,
        freelance two days a week alongside an outside agency. A few years
        in, Sam (the owner) and I made the call to bring it all in-house. I
        took the lead and we&apos;ve built a small in-house content team.
        These days I&apos;m making most of the content that goes out,
        video, photography, design, print, web, copy. Bit of marketing
        strategy on the side.
      </p>
      <p>
        Photography crept in here too. We bought our first DSLR at Age Care
        for product and project shots, and somewhere between learning the
        kit properly and figuring out what made a bathroom actually look
        good in a frame, I fell for it. These days the camera comes with me
        on walks as well, mostly around Nottingham and the Peaks, mostly
        places I&apos;d want to visit anyway. Architecture, landscape,
        lifestyle, whatever catches my eye when I&apos;m not really looking
        for it.
      </p>
    </div>
  );
}
