import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  siteSettingsQuery,
  homepageWorkByCategoryQuery,
  heroPhotosQuery,
  latestProjectsQuery,
  equipmentByCategoryQuery,
  cvProjectsQuery,
  allSoftwareQuery,
} from "@/sanity/queries";
import type {
  SiteSettings,
  ProjectSummary,
  EquipmentByCategory,
  EquipmentCategory,
  Software,
} from "@/sanity/types";
import type { SanityImage as TSanityImage } from "@/sanity/lib/image";

type HomepageWork = {
  photo: ProjectSummary[];
  video: ProjectSummary[];
  web: ProjectSummary[];
  design: ProjectSummary[];
};

type HeroPhotosRow = {
  cover?: TSanityImage | null;
  images?: TSanityImage[] | null;
};

import SanityImage from "@/components/SanityImage";
import Reveal from "@/components/Reveal";
import FlickrFeed from "@/components/FlickrFeed";
import InstagramFeed from "@/components/InstagramFeed";
import RecentProjectsCarousel from "@/components/RecentProjectsCarousel";
import ProjectScroller from "@/components/ProjectScroller";
import SoftwareLogo from "@/components/SoftwareLogo";
import {
  Aperture,
  Camera,
  Code2,
  Film,
  Lightbulb,
  Mic,
  Package,
  PenTool,
  Wrench,
} from "lucide-react";

export default async function HomePage() {
  const [
    settings,
    workRaw,
    heroPhotosRaw,
    latestRaw,
    equipmentRaw,
    cvProjectsRaw,
    softwareRaw,
  ] = await Promise.all([
    sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ["siteSettings"],
    }),
    sanityFetch<HomepageWork | null>({
      query: homepageWorkByCategoryQuery,
      tags: ["project"],
    }),
    sanityFetch<HeroPhotosRow[] | null>({
      query: heroPhotosQuery,
      tags: ["project"],
    }),
    sanityFetch<ProjectSummary[] | null>({
      query: latestProjectsQuery,
      tags: ["project"],
    }),
    sanityFetch<EquipmentByCategory | null>({
      query: equipmentByCategoryQuery,
      tags: ["equipment"],
    }),
    sanityFetch<ProjectSummary[] | null>({
      query: cvProjectsQuery,
      tags: ["project"],
    }),
    sanityFetch<Software[] | null>({
      query: allSoftwareQuery,
      tags: ["software"],
    }),
  ]);
  const work = workRaw ?? { photo: [], video: [], web: [], design: [] };
  const latest = latestRaw ?? [];
  const equipment: EquipmentByCategory = equipmentRaw ?? {
    camera: [],
    lens: [],
    support: [],
    audio: [],
    lighting: [],
    accessory: [],
  };
  const equipmentCategories: {
    key: EquipmentCategory;
    title: string;
    Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }[] = [
    { key: "camera", title: "Cameras", Icon: Camera },
    { key: "lens", title: "Lenses", Icon: Aperture },
    { key: "support", title: "Support", Icon: Wrench },
    { key: "audio", title: "Audio", Icon: Mic },
    { key: "lighting", title: "Lighting", Icon: Lightbulb },
    { key: "accessory", title: "Accessories", Icon: Package },
  ];
  const equipmentTotal = equipmentCategories.reduce(
    (n, c) => n + equipment[c.key].length,
    0,
  );

  const software = softwareRaw ?? [];
  const cvProjects = cvProjectsRaw ?? [];
  const cvStops: {
    id: string;
    name: string;
    role: string;
    period: string;
    dotClass: string;
  }[] = [
    {
      id: "age-care-bathrooms",
      name: "Age Care Bathrooms",
      role: "Head of Marketing",
      period: "2023 — Present",
      dotClass: "bg-amber-300",
    },
    {
      id: "lime-tree-music-centre",
      name: "Lime Tree Music Centre",
      role: "Co-Director",
      period: "2018 — Present",
      dotClass: "bg-rose-400",
    },
    {
      id: "the-musical-me",
      name: "The Musical Me",
      role: "Co-Director",
      period: "2020 — 2024",
      dotClass: "bg-sky-400",
    },
  ];
  // heroPhotosRaw kept for future hero variants; intentionally unused here.
  void heroPhotosRaw;

  const skillSections: SkillSection[] = [
    {
      key: "design",
      title: "Design",
      blurb:
        "Brand identity, layout and motion across print and digital. I handle the full stack at Age Care Bathrooms, from brochures and flyers to targeted regional campaigns and subscription mailers, and I build each piece around how it'll actually be read, posted or handed over. Typography is where I spend most of my time; everything else gets out of the way.",
      projects: work.design,
      href: "/portfolio?category=design",
    },
    {
      key: "photo",
      title: "Photography",
      blurb:
        "Editorial portraits, brand stills, weddings and live events, shot on my Sony A7 IV with fast primes and whatever light I'm given. The bathroom work is where I get to balance craft and commerce, all clean lines and honest light, no over-styling. The personal stuff (architecture, landscape, slow countryside walks with a camera) is what keeps my eye sharp. Same kit, two very different briefs.",
      projects: work.photo,
      href: "/portfolio?category=photo",
    },
    {
      key: "video",
      title: "Videography",
      blurb:
        "Brand films, TV adverts, before-and-afters, music videos and short-form social. I run small crews and stay hands-on the whole way through, from first idea to final colour grade, scripting, shooting and editing the lot myself. The Age Care Bathroom Story and the 2026 TV advert are my recent flagships; the social cuts and transformation reels are what I'm churning out week to week.",
      projects: work.video,
      href: "/portfolio?category=video",
    },
    {
      key: "web",
      title: "Web",
      blurb:
        "Marketing sites and headless builds. I reach for WordPress when a team needs to maintain it themselves, and Next.js when I want full control over performance and bespoke functionality. Recent builds include Age Care Maintenance with a custom AI quote estimator I built from scratch, Town & Country Merchants, and the World Music Day schools site. I build them to load fast, rank well, and not need babysitting.",
      projects: work.web,
      href: "/portfolio?category=web",
    },
  ];

  return (
    <>
      {/* HERO — friendly intro with pills and headshot */}
      <section className="relative w-full overflow-hidden bg-[#1B2447] text-white min-h-[58vh] flex items-center">
        {/* Decorative chevrons — bottom right */}
        <svg
          aria-hidden
          className="absolute bottom-12 right-4 md:bottom-16 md:right-8 w-20 md:w-28 text-amber-300/90 pointer-events-none"
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <polyline
                key={`${row}-${col}`}
                points={`${15 + col * 25},${15 + row * 25} ${22 + col * 25},${22 + row * 25} ${29 + col * 25},${15 + row * 25}`}
                opacity={0.4 + (row + col) * 0.06}
              />
            )),
          )}
        </svg>

        <div className="relative mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-24 md:pt-24 pb-16 md:pb-20 grid md:grid-cols-[3fr_2fr] gap-10 md:gap-14 items-center">
          {/* Left — copy */}
          <Reveal>
            <span className="block text-[0.65rem] md:text-[0.7rem] tracking-[0.32em] uppercase text-amber-300 font-semibold mb-4">
              Creative · Nottingham
            </span>
            <h1 className="font-display text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[0.98]">
              Hi! I&apos;m
              <br />
              Pete Jenkins.
            </h1>
            <p className="mt-5 max-w-[68ch] text-white/80 leading-relaxed text-base md:text-[1.0625rem]">
              I&apos;m Head of Marketing at{" "}
              <span className="text-white">Age Care Bathrooms</span>, which
              really means I get to do a bit of everything — print, flyers,
              films, adverts, and building the websites too. Photography&apos;s
              the obsession I can&apos;t shake; beautiful bathrooms by day,
              countryside shots at weekends. And when I&apos;m not behind a
              lens or a laptop, I&apos;m teaching guitar at{" "}
              <span className="text-white">Lime Tree Music Centre</span> in
              Matlock, which I co-own.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {["Design", "Videographer", "Photographer", "Web Developer"].map(
                (label) => (
                  <li
                    key={label}
                    className="rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase font-medium backdrop-blur-sm"
                  >
                    {label}
                  </li>
                ),
              )}
            </ul>
          </Reveal>

          {/* Right — headshot in organic shape */}
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-[320px] md:max-w-[340px] aspect-square">
              <div
                className="absolute inset-0 overflow-hidden bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                style={{
                  borderRadius:
                    "62% 38% 55% 45% / 55% 50% 50% 45%",
                }}
              >
                <SanityImage
                  image={settings?.headshot}
                  alt="Pete Jenkins"
                  sizes="(min-width: 768px) 40vw, 80vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Wave divider into the page */}
        <svg
          aria-hidden
          className="absolute bottom-0 left-0 w-full h-12 md:h-16 text-[var(--color-bg)]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,80 C240,140 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" />
        </svg>
      </section>

      {/* RECENT PROJECTS — filterable horizontal carousel */}
      <RecentProjectsCarousel projects={latest} />

      {/* DISCIPLINES — four dark tiles, deliberately different from the cards above */}
      <section className="pt-2 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="mb-6 md:mb-8">
              <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                What I Do
              </span>
              <h2 className="font-display text-2xl md:text-3xl leading-[1.05]">
                Four Disciplines
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {DISCIPLINES.map((d, i) => {
              const { Icon } = d;
              return (
                <Reveal key={d.key} delay={i * 80}>
                  <Link
                    href={d.href}
                    className="group relative block rounded-3xl bg-[#1B2447] text-white p-6 md:p-7 aspect-square overflow-hidden hover:bg-[#243066] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        aria-hidden
                        className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/10 text-amber-300 transition-colors group-hover:bg-amber-300 group-hover:text-[#1B2447]"
                      >
                        <Icon
                          className="w-5 h-5 md:w-6 md:h-6"
                          strokeWidth={2}
                        />
                      </span>
                      <span className="font-serif italic text-amber-300/90 text-sm md:text-base mt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl mt-4 leading-[1.05]">
                      {d.title}
                    </h3>
                    <p className="mt-2 md:mt-3 text-sm text-white/70 leading-relaxed max-w-[26ch]">
                      {d.blurb}
                    </p>
                    <span
                      aria-hidden
                      className="absolute bottom-5 right-5 md:bottom-6 md:right-6 w-9 h-9 rounded-full border border-amber-300/60 text-amber-300 flex items-center justify-center group-hover:bg-amber-300 group-hover:text-[#1B2447] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    >
                      ↗
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUR SKILL SECTIONS — full-width with horizontal scroller */}
      <div className="border-t border-[var(--color-line)]">
        {skillSections.map((s, i) => (
          <section
            key={s.key}
            className={
              i % 2 === 1
                ? "bg-[var(--color-bg-soft)] border-b border-[var(--color-line)]"
                : "border-b border-[var(--color-line)]"
            }
          >
            <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-10 md:py-14">
              <Reveal>
                <div className="mb-6 md:mb-8">
                  <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
                    {String(i + 1).padStart(2, "0")} — Skill
                  </span>
                  <h2 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95]">
                    {s.title}
                  </h2>
                  <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed text-base md:text-[1.0625rem]">
                    {s.blurb}
                  </p>
                  <Link
                    href={s.href}
                    className="inline-block mt-6 text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
                  >
                    View all {s.title} →
                  </Link>
                </div>
              </Reveal>

              <ProjectScroller projects={s.projects} />
            </div>
          </section>
        ))}
      </div>

      {/* CV TIMELINE — alternating timeline summary linking to /cv */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-soft)] border-y border-[var(--color-line)]">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="mb-10 md:mb-14 flex items-end justify-between gap-6 flex-wrap">
              <div>
                <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
                  Career
                </span>
                <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
                  Work So Far
                </h2>
              </div>
              <Link
                href="/cv"
                className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
              >
                Full CV →
              </Link>
            </div>
          </Reveal>

          {/* Desktop: alternating horizontal timeline */}
          <div className="hidden md:block relative">
            <div
              aria-hidden
              className="absolute top-1/2 left-0 right-0 h-px bg-[var(--color-line)] -translate-y-1/2"
            />
            <ul className="grid grid-cols-3 gap-8">
              {cvStops.map((stop, i) => {
                const above = i % 2 === 0;
                const items = cvProjects
                  .filter((p) => p.cvCompanies?.includes(stop.id))
                  .slice(0, 3);
                return (
                  <li
                    key={stop.id}
                    className="grid grid-rows-[1fr_auto_1fr] gap-y-3 min-h-[460px]"
                  >
                    <div className="flex flex-col justify-end">
                      {above ? (
                        <Reveal delay={i * 80}>
                          <CvStopContent stop={stop} items={items} />
                          <span
                            aria-hidden
                            className="block w-px h-6 bg-[var(--color-line)] mx-auto mt-4"
                          />
                        </Reveal>
                      ) : null}
                    </div>
                    <div className="flex justify-center">
                      <span
                        aria-hidden
                        className={`block w-4 h-4 rounded-full ${stop.dotClass} ring-[6px] ring-[var(--color-bg-soft)] relative z-10`}
                      />
                    </div>
                    <div className="flex flex-col justify-start">
                      {!above ? (
                        <Reveal delay={i * 80}>
                          <span
                            aria-hidden
                            className="block w-px h-6 bg-[var(--color-line)] mx-auto mb-4"
                          />
                          <CvStopContent stop={stop} items={items} />
                        </Reveal>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile: stacked vertical timeline */}
          <ol className="md:hidden relative space-y-10 pl-7">
            <span
              aria-hidden
              className="absolute left-[10px] top-2 bottom-2 w-px bg-[var(--color-line)]"
            />
            {cvStops.map((stop, i) => {
              const items = cvProjects
                .filter((p) => p.cvCompanies?.includes(stop.id))
                .slice(0, 3);
              return (
                <li key={stop.id} className="relative">
                  <span
                    aria-hidden
                    className={`absolute -left-7 top-1.5 w-3 h-3 rounded-full ${stop.dotClass} ring-4 ring-[var(--color-bg-soft)]`}
                  />
                  <Reveal delay={i * 80}>
                    <CvStopContent stop={stop} items={items} />
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* EQUIPMENT SUMMARY — links to the full Equipment page */}
      {equipmentTotal > 0 ? (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <Reveal>
              <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
                    Kit
                  </span>
                  <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
                    The Equipment
                  </h2>
                </div>
                <Link
                  href="/equipment"
                  className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
                >
                  Full equipment list →
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {equipmentCategories.map((cat, i) => {
                const items = equipment[cat.key];
                if (items.length === 0) return null;
                const { Icon } = cat;
                return (
                  <Reveal key={cat.key} delay={i * 60}>
                    <div className="rounded-3xl bg-[var(--color-bg-soft)] p-6 md:p-7 h-full">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1B2447] text-amber-300"
                          >
                            <Icon className="w-5 h-5" strokeWidth={2} />
                          </span>
                          <h3 className="font-display text-xl md:text-2xl">
                            {cat.title}
                          </h3>
                        </div>
                        <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
                          {items.length}
                        </span>
                      </div>

                      <ul className="space-y-3">
                        {items.map((item) => (
                          <li
                            key={item._id}
                            className="flex items-center gap-3"
                          >
                            <span className="relative w-10 h-10 shrink-0 overflow-hidden rounded-xl bg-white">
                              {item.image ? (
                                <SanityImage
                                  image={item.image}
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <span
                                  aria-hidden
                                  className="absolute inset-0 flex items-center justify-center text-[var(--color-mute)]"
                                >
                                  <Icon
                                    className="w-4 h-4"
                                    strokeWidth={1.75}
                                  />
                                </span>
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm md:text-[0.95rem] text-[var(--color-ink)] leading-tight truncate">
                                {item.name}
                                {item.quantity && item.quantity > 1 ? (
                                  <span className="text-[var(--color-mute)] ml-1.5">
                                    ×{item.quantity}
                                  </span>
                                ) : null}
                              </p>
                              {item.brand ? (
                                <p className="mt-0.5 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-mute)] truncate">
                                  {item.brand}
                                </p>
                              ) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* SOFTWARE SUMMARY — links to the full Software page */}
      {software.length > 0 ? (
        <section className="py-16 md:py-20 bg-[var(--color-bg-soft)] border-t border-[var(--color-line)]">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <Reveal>
              <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
                    Tools
                  </span>
                  <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
                    The Software
                  </h2>
                </div>
                <Link
                  href="/software"
                  className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1 hover:text-[var(--color-mute)] hover:border-[var(--color-mute)] transition-colors"
                >
                  Full software list →
                </Link>
              </div>
            </Reveal>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {software.map((s, i) => {
                const sources = softwareLogoSources(s.name);
                return (
                  <li key={s._id}>
                    <Reveal delay={Math.min(i * 30, 240)}>
                      <div className="rounded-2xl bg-[var(--color-bg)] border border-[var(--color-line)] p-4 md:p-5 flex flex-col items-center gap-3 h-full">
                        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                          <SoftwareLogo name={s.name} sources={sources} />
                        </div>
                        <p className="text-[0.8rem] md:text-sm text-center text-[var(--color-ink)] leading-tight font-medium">
                          {s.name}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* FLICKR FEED — renders nothing if NEXT_PUBLIC_FLICKR_USER_ID isn't set */}
      <FlickrFeed count={12} />

      {/* INSTAGRAM FEED — renders nothing if INSTAGRAM_ACCESS_TOKEN isn't set */}
      <InstagramFeed count={9} />
    </>
  );
}

const DISCIPLINES: {
  key: string;
  title: string;
  blurb: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  {
    key: "design",
    title: "Design",
    blurb:
      "Print, flyers and brand identity — typography-led and built to sell.",
    href: "/portfolio?category=design",
    Icon: PenTool,
  },
  {
    key: "photo",
    title: "Photo",
    blurb:
      "Editorial portraits and brand stills by day; countryside at weekends.",
    href: "/portfolio?category=photo",
    Icon: Camera,
  },
  {
    key: "video",
    title: "Video",
    blurb:
      "Brand films, before-and-afters, ads and social cuts that earn their watch time.",
    href: "/portfolio?category=video",
    Icon: Film,
  },
  {
    key: "web",
    title: "Web Developer",
    blurb:
      "WordPress when it fits, Next.js when it shines — fast, considered builds.",
    href: "/portfolio?category=web",
    Icon: Code2,
  },
];

type SkillSection = {
  key: "design" | "photo" | "video" | "web";
  title: string;
  blurb: string;
  projects: ProjectSummary[];
  href: string;
};

const SIMPLE_ICONS_OVERRIDES: Record<string, string> = {
  "vs code": "visualstudiocode",
  "visual studio code": "visualstudiocode",
  "next.js": "nextdotjs",
  "node.js": "nodedotjs",
  "davinci resolve": "davinciresolve",
  "pro tools": "protools",
  "tailwind css": "tailwindcss",
  tailwind: "tailwindcss",
  "google analytics": "googleanalytics",
  "google search console": "googlesearchconsole",
  "final cut pro": "finalcutpro",
  "logic pro": "logicpro",
};

// Adobe and a few others were removed from Simple Icons over trademark
// concerns. Use vectorlogo.zone as a primary source for those, with simpleicons
// as a fallback (in case vectorlogo.zone is unreachable), and the SoftwareLogo
// client component shows a styled letter avatar if all sources fail.
const VECTORLOGO_OVERRIDES: Record<string, string> = {
  "adobe photoshop": "adobe_photoshop/adobe_photoshop-icon.svg",
  photoshop: "adobe_photoshop/adobe_photoshop-icon.svg",
  "adobe illustrator": "adobe_illustrator/adobe_illustrator-icon.svg",
  illustrator: "adobe_illustrator/adobe_illustrator-icon.svg",
  "adobe lightroom": "adobe_lightroom/adobe_lightroom-icon.svg",
  lightroom: "adobe_lightroom/adobe_lightroom-icon.svg",
  "adobe premiere pro": "adobe_premiere/adobe_premiere-icon.svg",
  "premiere pro": "adobe_premiere/adobe_premiere-icon.svg",
  "adobe after effects": "adobe_after_effects/adobe_after_effects-icon.svg",
  "after effects": "adobe_after_effects/adobe_after_effects-icon.svg",
  "adobe indesign": "adobe_indesign/adobe_indesign-icon.svg",
  indesign: "adobe_indesign/adobe_indesign-icon.svg",
};

function simpleIconsSlug(name: string): string {
  const key = name.toLowerCase().trim();
  if (SIMPLE_ICONS_OVERRIDES[key]) return SIMPLE_ICONS_OVERRIDES[key];
  return key.replace(/[^a-z0-9]/g, "");
}

function softwareLogoSources(name: string): string[] {
  const key = name.toLowerCase().trim();
  const sources: string[] = [];
  if (VECTORLOGO_OVERRIDES[key]) {
    sources.push(`https://www.vectorlogo.zone/logos/${VECTORLOGO_OVERRIDES[key]}`);
  }
  sources.push(`https://cdn.simpleicons.org/${simpleIconsSlug(name)}`);
  return sources;
}

function CvStopContent({
  stop,
  items,
}: {
  stop: {
    id: string;
    name: string;
    role: string;
    period: string;
    dotClass: string;
  };
  items: ProjectSummary[];
}) {
  return (
    <div>
      <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
        {stop.period}
      </p>
      <h3 className="font-display text-lg md:text-xl lg:text-2xl leading-tight mb-1 break-words">
        {stop.name}
      </h3>
      <p className="font-serif italic text-[var(--color-ink-soft)] text-sm mb-4">
        {stop.role}
      </p>

      {items.length > 0 ? (
        <ul className="flex gap-3 mt-4 overflow-x-auto -mx-1 px-1 pb-1">
          {items.map((p) => (
            <li
              key={p._id}
              className="w-[100px] md:w-[110px] lg:w-[120px] flex-shrink-0"
            >
              <Link href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-bg)] border border-[var(--color-line)]">
                  <SanityImage
                    image={p.coverImage}
                    sizes="120px"
                    className="object-cover img-hover"
                  />
                </div>
                <p className="mt-1.5 text-[0.7rem] text-[var(--color-ink)] leading-tight line-clamp-2">
                  {p.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
