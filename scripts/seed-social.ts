/**
 * Scaffold two empty Social-category projects in Sanity.
 *
 * Re-running is safe — both docs have stable _ids, so the script upserts
 * without duplicating content. Populate the cover image, gallery and any
 * extra copy in Sanity Studio afterwards.
 *
 * Usage:
 *   1. .env.local must have NEXT_PUBLIC_SANITY_PROJECT_ID,
 *      NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN set.
 *   2. npx tsx scripts/seed-social.ts
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
    "Missing SANITY_API_WRITE_TOKEN — create one at manage.sanity.io with Editor permissions.",
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

function block(text: string) {
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

function socialProject(o: {
  id: string;
  slug: string;
  title: string;
  description: string;
}) {
  return {
    _id: o.id,
    _type: "project",
    title: o.title,
    slug: { _type: "slug", current: o.slug },
    category: "social",
    featured: false,
    year: 2026,
    videoOrientation: "vertical",
    thumbnailOrientation: "portrait",
    description: block(o.description),
  };
}

async function run() {
  const docs = [
    socialProject({
      id: "project-social-vertical-social-cuts",
      slug: "vertical-social-cuts",
      title: "Vertical Social Cuts",
      description:
        "Short-form vertical recuts of brand video work, cut for Reels and TikTok. Premiere Pro, 9:16, captions and motion.",
    }),
    socialProject({
      id: "project-social-lifestyle-and-garden",
      slug: "lifestyle-and-garden",
      title: "Lifestyle & Garden",
      description:
        "Personal lifestyle work — herb garden, food, slow walks. Shot vertical for social. Sony A7 V, A6700, Lightroom.",
    }),
  ];

  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  const result = await tx.commit();
  console.log(`✓ Seeded ${result.results.length} social project(s).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
