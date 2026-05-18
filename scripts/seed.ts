/**
 * Seed the Sanity dataset with placeholder content so the site looks
 * populated on first run.
 *
 * Usage:
 *   1. Make sure .env.local has NEXT_PUBLIC_SANITY_PROJECT_ID,
 *      NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN set.
 *   2. npm run seed
 *
 * Re-running is safe — every doc has a stable _id, so the script upserts.
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN — create one at manage.sanity.io with Editor permissions."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// ─── Image upload helper ─────────────────────────────────────────────
async function uploadStockImage(
  url: string,
  filename: string
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

// Unsplash placeholder photos — neutral, editorial
const STOCK = {
  hero: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=2000&q=80",
  headshot:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80",
  photo1:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  photo2:
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600&q=80",
  photo3:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80",
  photo4:
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80",
  video1:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80",
  video2:
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80",
  web1: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=80",
  web2: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=1600&q=80",
};

async function block(text: string) {
  return [
    {
      _type: "block",
      _key: Math.random().toString(36).slice(2, 10),
      style: "normal",
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ];
}

async function run() {
  console.log("Uploading images…");
  const images = Object.fromEntries(
    await Promise.all(
      Object.entries(STOCK).map(async ([key, url]) => [
        key,
        await uploadStockImage(url, `${key}.jpg`),
      ])
    )
  );

  console.log("Writing documents…");

  const docs: Array<{ _id: string; [k: string]: unknown }> = [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      name: "Pete Jenkins",
      tagline:
        "Telling stories through stills, motion, and the web — for brands that want to feel real.",
      currentRoleText:
        "Currently Head of Marketing at Age Care Bathrooms — paid, SEO, CRM, content.",
      heroImage: { ...images.hero, alt: "Coastal landscape at golden hour" },
      headshot: { ...images.headshot, alt: "Pete Jenkins, headshot" },
      contactEmail: "hello@petejenkins.co.uk",
      socialLinks: [
        { _key: "ig", platform: "instagram", url: "https://instagram.com/" },
        {
          _key: "li",
          platform: "linkedin",
          url: "https://linkedin.com/in/petejenkins",
        },
      ],
      aboutText: [
        ...(await block(
          "I'm a creative based in Nottingham, working across photography, video and the web. I shoot, I edit, I build. The mix is the point."
        )),
        ...(await block(
          "I started this by accident. A point-and-shoot at 14, a school yearbook I wouldn't shut up about, and a stubborn habit of taking the long way home if there was decent light. Twenty-odd years later I'm still doing the same thing — just with better kit and a clearer view of why it matters."
        )),
        ...(await block(
          "Today I'm Head of Marketing at Age Care Bathrooms, where I run the full marketing function: paid media, SEO, CRM, content, and the data plumbing that joins them up. The discipline of marketing has changed how I make things — the films I shoot now have a clearer reason to exist; the photos hold up under a brand guideline; the websites I build convert because they were planned to."
        )),
        ...(await block(
          "Outside that, I shoot weddings and editorial portraits across the Midlands and London, and build sites for friends, agencies and small brands who want something that punches above its weight."
        )),
      ],
    },

    // Services
    {
      _id: "service-photo",
      _type: "service",
      title: "Photography",
      description:
        "Editorial portraits, brand stills, weddings and the bits in between. Sony A7 IV, fast primes, available light unless I think it ought to be otherwise.",
      order: 1,
    },
    {
      _id: "service-video",
      _type: "service",
      title: "Videography",
      description:
        "Short-form brand films, behind-the-scenes, social cuts. Owner-operated camera, sound and edit. I keep crews small so the room stays honest.",
      order: 2,
    },
    {
      _id: "service-web",
      _type: "service",
      title: "Web (WordPress & Next.js)",
      description:
        "Marketing sites, lead engines, headless builds. WordPress when the team needs to ship without a developer; Next.js when speed and craft matter.",
      order: 3,
    },

    // Photography projects
    project("photo-coastal", {
      title: "Coastal — Pembrokeshire",
      category: "photo",
      featured: true,
      year: 2025,
      role: "Photographer",
      client: "Personal",
      cover: { ...images.photo1, alt: "Pembrokeshire coastline, fog rolling" },
      gallery: [
        { ...images.photo1, alt: "Cliff edge at dawn" },
        { ...images.photo2, alt: "Sea-mist over rocks" },
      ],
      desc: "A weekend on the Pembrokeshire coast path, shot in fog and wind.",
    }),
    project("photo-portraits", {
      title: "Portraits — Studio Series",
      category: "photo",
      featured: true,
      year: 2025,
      role: "Photographer",
      client: "Various",
      cover: { ...images.photo2, alt: "Editorial portrait, soft light" },
      gallery: [{ ...images.photo3, alt: "Portrait detail" }],
      desc: "Editorial portrait series, available light, single 50mm lens.",
    }),
    project("photo-wedding-derby", {
      title: "Holly + Sam — Derbyshire",
      category: "photo",
      featured: true,
      year: 2024,
      role: "Photographer",
      client: "Holly & Sam",
      cover: { ...images.photo3, alt: "Wedding ceremony in the Peak District" },
      gallery: [{ ...images.photo4, alt: "Wedding details" }],
      desc: "A small wedding in the Peak District. Loose, documentary-led.",
    }),
    project("photo-brand-stills", {
      title: "Stillwell Coffee — Brand Stills",
      category: "photo",
      featured: false,
      year: 2024,
      role: "Photographer",
      client: "Stillwell Coffee",
      cover: { ...images.photo4, alt: "Coffee bag and beans on linen" },
      gallery: [],
      desc: "Product and lifestyle stills for an independent coffee roaster.",
    }),

    // Videography projects
    project("video-meridian", {
      title: "Meridian — Brand Film",
      category: "video",
      featured: true,
      year: 2025,
      role: "Director / DP / Editor",
      client: "Meridian Studio",
      videoUrl: "https://vimeo.com/76979871",
      cover: { ...images.video1, alt: "Workshop interior, warm tones" },
      gallery: [],
      desc: "A 90-second brand film for an architecture studio in Bristol.",
    }),
    project("video-northcoast", {
      title: "North Coast — Travel Edit",
      category: "video",
      featured: true,
      year: 2024,
      role: "DP / Editor",
      client: "Personal",
      videoUrl: "https://vimeo.com/76979871",
      cover: { ...images.video2, alt: "Coastal cliff, drone shot" },
      gallery: [],
      desc: "A short, slow travel edit shot on the NC500 over five days.",
    }),

    // Web projects
    project("web-acb", {
      title: "Age Care Bathrooms — Marketing Site",
      category: "web",
      featured: true,
      year: 2024,
      role: "Lead",
      client: "Age Care Bathrooms",
      cover: { ...images.web1, alt: "Marketing site detail, on a laptop" },
      gallery: [],
      externalUrl: "https://agecare-bathrooms.co.uk",
      desc: "Strategy, IA, design oversight and CRO for the ACB marketing site.",
    }),
    project("web-stillwell", {
      title: "Stillwell Coffee — Headless Build",
      category: "web",
      featured: false,
      year: 2024,
      role: "Designer / Developer",
      client: "Stillwell Coffee",
      cover: { ...images.web2, alt: "Editorial product page" },
      gallery: [],
      externalUrl: "https://example.com",
      desc: "Next.js + Sanity headless build for an indie coffee brand.",
    }),
  ];

  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc as any);
  const result = await tx.commit();
  console.log(`✓ Seeded ${result.results.length} documents.`);
}

function project(
  id: string,
  o: {
    title: string;
    category: "photo" | "video" | "web";
    featured?: boolean;
    year?: number;
    role?: string;
    client?: string;
    cover: { _type: "image"; asset: any; alt: string };
    gallery?: { _type: "image"; asset: any; alt: string }[];
    desc?: string;
    externalUrl?: string;
    videoUrl?: string;
  }
) {
  return {
    _id: id,
    _type: "project",
    title: o.title,
    slug: { _type: "slug", current: id.replace(/^project-|^photo-|^video-|^web-/, "") },
    category: o.category,
    featured: o.featured ?? false,
    year: o.year,
    role: o.role,
    client: o.client,
    coverImage: o.cover,
    gallery: (o.gallery ?? []).map((g, i) => ({ _key: `g${i}`, ...g })),
    externalUrl: o.externalUrl,
    videoUrl: o.videoUrl,
    description: o.desc
      ? [
          {
            _type: "block",
            _key: "p1",
            style: "normal",
            children: [{ _type: "span", _key: "s1", text: o.desc, marks: [] }],
            markDefs: [],
          },
        ]
      : [],
  };
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
