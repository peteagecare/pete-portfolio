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
  allEducationQuery,
} from "@/sanity/queries";
import type {
  SiteSettings,
  ProjectSummary,
  EquipmentByCategory,
  EquipmentCategory,
  Software,
  Education,
} from "@/sanity/types";
import { COMPANIES, companyDateRange } from "@/lib/experience";
import type { SanityImage as TSanityImage } from "@/sanity/lib/image";

type HomepageWork = {
  social: ProjectSummary[];
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
import SocialFeed from "@/components/SocialFeed";
import RecentProjectsCarousel from "@/components/RecentProjectsCarousel";
import ProjectScroller from "@/components/ProjectScroller";
import SoftwareLogo from "@/components/SoftwareLogo";
import { softwareLogoSources } from "@/lib/softwareLogo";
import {
  Aperture,
  ArrowLeft,
  ArrowUp,
  Camera,
  Code2,
  Film,
  Lightbulb,
  Mic,
  Package,
  PenTool,
  Smartphone,
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
    educationRaw,
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
    sanityFetch<Education[] | null>({
      query: allEducationQuery,
      tags: ["education"],
    }),
  ]);
  const work = workRaw ?? {
    social: [],
    photo: [],
    video: [],
    web: [],
    design: [],
  };
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
  const education = educationRaw ?? [];
  // heroPhotosRaw kept for future hero variants; intentionally unused here.
  void heroPhotosRaw;

  const skillSections: SkillSection[] = [
    {
      key: "social",
      title: "Social",
      blurb:
        "Short-form vertical is where most of my work ends up now. Reels, TikTok, shorts. I shoot on a Sony A7 V or A6700 depending on the brief, cut in Premiere Pro and add motion in After Effects when it serves the piece. The goal is the same every time: make something worth not scrolling past.",
      projects: work.social,
      href: "/portfolio?category=social",
    },
    {
      key: "video",
      title: "Video",
      blurb:
        "Brand films, TV ads, before-and-afters and customer testimonials. I helped shoot our Sky AdSmart and GB News spots, including a campaign with Brian Blessed. Switching between formats keeps it interesting and I'm always picking up new editing tricks, new lighting setups, new ways to make people stop and watch.",
      projects: work.video,
      href: "/portfolio?category=video",
    },
    {
      key: "photo",
      title: "Photo",
      blurb:
        "Photography started as a necessity. Age Care Bathrooms needed photos and I was the one to take them. I fell in love along the way. Now I shoot bathrooms by day and whatever catches my eye at the weekend: architecture, landscapes, slow walks with a camera around Nottingham and the Peak District. Same Sony A7 V, very different briefs.",
      projects: work.photo,
      href: "/portfolio?category=photo",
    },
    {
      key: "design",
      title: "Motion & Design",
      blurb:
        "At Age Care Bathrooms I work across print and digital. Brochures, flyers, email campaigns, regional direct mail. I'm always thinking about how a piece will actually be read, held or handed over. Motion sits alongside that: captions, lower-thirds, the short animated bits that hold a social cut together.",
      projects: work.design,
      href: "/portfolio?category=design",
    },
    {
      key: "web",
      title: "Web",
      blurb:
        "I taught myself web development out of necessity when the businesses I was running needed sites, and I never stopped. Somewhere along the way I picked up SEO properly, with a bit of PPC on the side, so the sites I built actually got found. These days it's WordPress when a team needs to maintain it themselves, Next.js when I want full control. Built this site, Age Care Maintenance with its custom AI quote estimator, Town & Country Merchants, and the World Music Day schools site.",
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
              I film, edit and shoot photos, mostly for social. Short-form,
              vertical, the kind of thing you actually want to watch. My
              current day job is at{" "}
              <span className="text-white">Age Care Bathrooms</span>, where I
              shoot and edit all the video, handle all the photography,
              design the print media and write the website copy. I run a
              small in-house team of four, but spend most days hands-on with
              a camera or in Premiere Pro editing. Most of what I know I
              learned by doing. Outside of work I co-own a music school in
              Matlock and teach guitar. I shoot personal photography on long
              walks around Nottingham and the Peak District.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {["Videographer", "Photographer", "Motion & Design", "Web Developer"].map(
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
                Five Disciplines
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {DISCIPLINES.map((d, i) => {
              const { Icon } = d;
              return (
                <Reveal key={d.key} delay={i * 80}>
                  <Link
                    href={d.href}
                    className="group relative flex h-full flex-col rounded-2xl md:rounded-3xl bg-[#1B2447] text-white p-4 sm:p-5 md:p-7 overflow-hidden hover:bg-[#243066] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        aria-hidden
                        className="inline-flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 text-amber-300 transition-colors group-hover:bg-amber-300 group-hover:text-[#1B2447] shrink-0"
                      >
                        <Icon
                          className="w-4 h-4 md:w-6 md:h-6"
                          strokeWidth={2}
                        />
                      </span>
                      <span className="font-serif italic text-amber-300/90 text-xs md:text-base mt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl md:text-3xl mt-3 md:mt-4 leading-[1.1]">
                      {d.title}
                    </h3>
                    <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/70 leading-relaxed pr-10 md:pr-12 pb-12 md:pb-14">
                      {d.blurb}
                    </p>
                    <span
                      aria-hidden
                      className="absolute bottom-3 right-3 md:bottom-6 md:right-6 w-7 h-7 md:w-9 md:h-9 rounded-full border border-amber-300/60 text-amber-300 text-sm md:text-base flex items-center justify-center group-hover:bg-amber-300 group-hover:text-[#1B2447] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
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
                    {String(i + 1).padStart(2, "0")} · Skill
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
            <div className="mb-6 md:mb-8 flex items-end justify-between gap-6 flex-wrap">
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

          <Reveal delay={80}>
            <p className="mb-10 md:mb-14 max-w-[68ch] text-[var(--color-ink-soft)] leading-relaxed text-base md:text-[1.0625rem]">
              Most of what I know came from running my own businesses, where
              there was no one else to take the photos, cut the video, build
              the websites or do the design. By the time I joined Age Care
              Bathrooms I'd taught myself most of it the hard way.
            </p>
          </Reveal>

          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {COMPANIES.map((company, i) => {
              const matchIds = company.cvIds ?? [company.id];
              const items = cvProjects
                .filter((p) =>
                  p.cvCompanies?.some((c) => matchIds.includes(c)),
                )
                .slice(0, 4);
              const isAcb = company.id === "age-care-bathrooms";
              return (
                <li key={company.id} className="relative h-full">
                  {i > 0 ? (
                    <span
                      aria-hidden
                      className="hidden lg:inline-flex absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-mute)]"
                    >
                      <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                    </span>
                  ) : null}
                    <Reveal delay={i * 80} className="h-full">
                      <div className="rounded-3xl bg-[var(--color-bg)] border border-[var(--color-line)] p-6 md:p-7 h-full flex flex-col">
                        <span className="inline-flex self-start items-center justify-center px-2 py-1 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-soft)] text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-ink)] whitespace-nowrap mb-4">
                          {companyDateRange(company)}
                        </span>
                        <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3">
                          {company.name}
                        </p>
                        <ul className="space-y-3 mb-5">
                          {company.roles.map((role, roleIdx) => (
                            <li key={role.title}>
                              {isAcb && roleIdx === 1 ? (
                                <div className="flex items-center gap-2 mb-3 -ml-px">
                                  <span
                                    aria-hidden
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] text-[var(--color-mute)] flex-shrink-0"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />
                                  </span>
                                  <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--color-mute)]">
                                    Promoted from
                                  </span>
                                </div>
                              ) : null}
                              <div className="border-l-2 border-[var(--color-line)] pl-3">
                                <h3 className="font-display text-lg md:text-xl text-[var(--color-ink)] leading-tight">
                                  {role.title}
                                </h3>
                                <p className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-mute)] mt-0.5">
                                  {role.start} - {role.end}
                                </p>
                                {role.description ? (
                                  <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm mt-2">
                                    {role.description}
                                  </p>
                                ) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                        {items.length > 0 ? (
                          <ul className={`grid gap-2 mt-auto ${isAcb ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
                            {items.map((p) => (
                              <li key={p._id}>
                                <Link
                                  href={`/portfolio/${p.slug}`}
                                  className="group block"
                                >
                                  <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-[var(--color-bg-soft)] border border-[var(--color-line)]">
                                    <SanityImage
                                      image={p.coverImage}
                                      sizes="160px"
                                      className="object-cover img-hover"
                                    />
                                  </div>
                                  <p className="mt-1 text-[0.7rem] leading-tight text-[var(--color-ink)] line-clamp-2">
                                    {p.title}
                                  </p>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </Reveal>
                  </li>
                );
              })}
          </ul>

          {education.length > 0 ? (
            <Reveal>
              <div className="mt-10 md:mt-14">
                <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-4">
                  Education
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {education.map((e) => (
                    <li
                      key={e._id}
                      className="rounded-2xl bg-[var(--color-bg)] border border-[var(--color-line)] p-5 md:p-6"
                    >
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-soft)] text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-ink)] whitespace-nowrap mb-3">
                        {e.endYear ? `${e.startYear} – ${e.endYear}` : `${e.startYear} – Now`}
                      </span>
                      <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                        {e.institution}
                      </p>
                      <h3 className="font-display text-lg md:text-xl text-[var(--color-ink)] leading-tight">
                        {e.qualification}
                      </h3>
                      {e.description ? (
                        <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm mt-2">
                          {e.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}
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
                        {s.projects && s.projects.length > 0 ? (
                          <div className="mt-auto pt-2 w-full flex flex-col gap-1.5">
                            <span className="text-[0.55rem] md:text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-mute)] text-center">
                              Projects using {s.name}
                            </span>
                            <ul className="flex flex-col gap-1.5">
                              {s.projects.slice(0, 3).map((p) => (
                                <li key={p._id}>
                                  <Link
                                    href={`/portfolio/${p.slug}`}
                                    title={p.title}
                                    className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] hover:border-[var(--color-ink)] transition-colors"
                                  >
                                    <span className="relative w-6 h-6 rounded-full overflow-hidden border border-[var(--color-line)] flex-shrink-0">
                                      <SanityImage
                                        image={p.coverImage}
                                        sizes="24px"
                                        className="object-cover"
                                      />
                                    </span>
                                    <span className="text-[0.65rem] leading-tight text-[var(--color-ink)] truncate">
                                      {p.title}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <FlickrFeed count={12} />

      <SocialFeed />
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
    key: "social",
    title: "Social",
    blurb:
      "Reels, TikTok and shorts. Vertical, short-form, fast turnaround. I shoot on a Sony A7 V or A6700, cut in Premiere and caption in-house. The kind of thing you actually stop scrolling for.",
    href: "/portfolio?category=social",
    Icon: Smartphone,
  },
  {
    key: "video",
    title: "Video",
    blurb:
      "Brand films, before-and-afters, customer testimonials, TV ads. Helped shoot our Sky AdSmart and GB News spots, including one with Brian Blessed. Premiere Pro, Sony A7 V, gimbal when the shot needs it.",
    href: "/portfolio?category=video",
    Icon: Film,
  },
  {
    key: "photo",
    title: "Photo",
    blurb:
      "Bathrooms by day, whatever catches my eye at the weekend. I shoot in our in-house studio (which I built from scratch) and on location. Architecture and landscapes on long walks around Nottingham and the Peak District.",
    href: "/portfolio?category=photo",
    Icon: Camera,
  },
  {
    key: "design",
    title: "Motion & Design",
    blurb:
      "Brochures, flyers, email campaigns and schools' resource packs. Captions and motion graphics for the social cuts. Typography first, everything else after that.",
    href: "/portfolio?category=design",
    Icon: PenTool,
  },
  {
    key: "web",
    title: "Web",
    blurb:
      "WordPress when a team needs to maintain it, Next.js when I want full control. Built this site, Age Care Maintenance with its AI quote tool, Town & Country Merchants, and the World Music Day schools site.",
    href: "/portfolio?category=web",
    Icon: Code2,
  },
];

type SkillSection = {
  key: "social" | "design" | "photo" | "video" | "web";
  title: string;
  blurb: string;
  projects: ProjectSummary[];
  href: string;
};

