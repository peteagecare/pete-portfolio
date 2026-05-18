/**
 * Seeds Pete's actual kit list. Re-running is safe — every doc has a
 * stable _id so it upserts.
 *
 *   npm run seed:equipment
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

const items: Array<{
  _id: string;
  name: string;
  brand: string;
  category: "camera" | "lens" | "support";
  description: string;
  quantity?: number;
  order: number;
}> = [
  {
    _id: "eq-sony-a7v",
    name: "Sony Alpha 7 V",
    brand: "Sony",
    category: "camera",
    description:
      "Full-frame workhorse. Stills, video, almost everything paid. The body the rest of the kit revolves around.",
    order: 1,
  },
  {
    _id: "eq-sony-a6700",
    name: "Sony Alpha 6700",
    brand: "Sony",
    category: "camera",
    description:
      "APS-C B-cam and travel body. Fast autofocus, light enough to hold for a full day. Picks up the second angle on bigger shoots and goes most places I take a camera.",
    order: 2,
  },

  {
    _id: "eq-sigma-24-70",
    name: "Sigma 24-70mm F2.8 DG DN II Art",
    brand: "Sigma",
    category: "lens",
    description:
      "The do-everything zoom. Lives on the A7 V. Events, portraits, brand work, anything where I'd otherwise rotate three primes.",
    order: 1,
  },
  {
    _id: "eq-sony-fe-16",
    name: "Sony FE 16mm F1.8 G",
    brand: "Sony",
    category: "lens",
    description:
      "Wide full-frame prime. Interiors, environmental portraits, the occasional run-and-gun video where small and fast wins.",
    order: 2,
  },
  {
    _id: "eq-sigma-18-50",
    name: "Sigma 18-50mm F2.8 DC DN Contemporary",
    brand: "Sigma",
    category: "lens",
    description:
      "APS-C standard zoom for the A6700. Roughly a 27-75 on full-frame. Light, sharp, my walk-around for travel.",
    order: 3,
  },
  {
    _id: "eq-sigma-10-18",
    name: "Sigma 10-18mm F2.8 DC DN Contemporary",
    brand: "Sigma",
    category: "lens",
    description:
      "APS-C ultra-wide for the A6700. Tight interiors, architecture, vlog-style B-roll where the 16mm isn't wide enough.",
    order: 4,
  },

  {
    _id: "eq-kf-tripod",
    name: 'K&F Concept 61" Tripod',
    brand: "K&F Concept",
    category: "support",
    quantity: 2,
    description:
      "A pair of light carbon-style tripods. One for stills, one for B-cam or audio. Simple, reliable, packs small.",
    order: 1,
  },
  {
    _id: "eq-dji-rs3",
    name: "DJI RS 3 Gimbal",
    brand: "DJI",
    category: "support",
    description:
      "Three-axis stabiliser for video work. Fast switching between camera and lens combos, automated locks make setup quick.",
    order: 2,
  },
];

async function run() {
  const tx = client.transaction();
  for (const item of items) {
    tx.createOrReplace({
      _type: "equipment",
      ...item,
    });
  }
  const res = await tx.commit();
  console.log(`✓ Seeded ${res.results.length} equipment items.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
