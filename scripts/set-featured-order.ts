/**
 * Pin the top homepage Recent Projects in a specific order.
 *
 * Matches projects by exact title (case-insensitive, trimmed), sets
 * `featuredOrder` to 1..N, and clears `featuredOrder` on every other project
 * so this script is the single source of truth.
 *
 * Usage:
 *   1. .env.local must have NEXT_PUBLIC_SANITY_PROJECT_ID,
 *      NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 *   2. npx tsx scripts/set-featured-order.ts
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
  console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const FEATURED_ORDER = [
  "a-day-in-the-life-video-series",
  "my-favourite-architecture-shots",
  "on-the-front-line-social-video",
  "bathroom-photography-collection",
  "behind-the-scenes-of-our-tv-advert",
  "my-favourite-countryside-photos",
];

async function run() {
  const all = await client.fetch<
    { _id: string; title: string; slug: string }[]
  >(`*[_type == "project"]{ _id, title, "slug": slug.current }`);

  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const tx = client.transaction();
  const matchedIds = new Set<string>();
  const missing: string[] = [];

  FEATURED_ORDER.forEach((slug, i) => {
    const match = bySlug.get(slug);
    if (!match) {
      missing.push(slug);
      return;
    }
    matchedIds.add(match._id);
    tx.patch(match._id, (p) => p.set({ featuredOrder: i + 1 }));
    console.log(`  ${i + 1}. ${match.title}`);
  });

  // Clear featuredOrder on every other project so this script is authoritative.
  for (const p of all) {
    if (matchedIds.has(p._id)) continue;
    tx.patch(p._id, (patch) => patch.unset(["featuredOrder"]));
  }

  if (missing.length > 0) {
    console.warn(
      `\n⚠ Could not find these in Sanity (check the title spelling):`,
    );
    for (const t of missing) console.warn(`  - ${t}`);
  }

  await tx.commit();
  console.log(
    `\n✓ Pinned ${matchedIds.size} project(s); cleared featuredOrder on ${
      all.length - matchedIds.size
    } other(s).`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
