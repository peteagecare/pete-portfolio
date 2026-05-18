/**
 * Overwrite siteSettings.aboutText with the new About page copy.
 *
 * Idempotent: re-runnable. Replaces aboutText each time.
 *
 * Usage:
 *   1. .env.local must have NEXT_PUBLIC_SANITY_PROJECT_ID,
 *      NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 *   2. npx tsx scripts/update-about.ts
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

const PARAGRAPHS = [
  "I'm a creative based in Nottingham, working across video, photography, design and web. I shoot, I edit, I build, and I like that no two days look the same.",
  "My route in was music, not film school. I did a BA (Hons) in Music Production at York St John, started teaching with Rocksteady, then set up my own business, The Musical Me, where we launched World Music Day for primary schools across the UK. Around the same time my friend Harry gave me a start teaching guitar at Lime Tree Music Centre in Matlock. When he moved on to start a family, Corinne and I bought it off him and grew it into a thriving music centre that's still going strong.",
  "Wanting a new kind of challenge, I ended up at Age Care Bathrooms, freelance two days a week alongside an outside agency. A few years in, Sam (the owner) and I made the call to bring it all in-house. I took the lead and we've built a small in-house content team. These days I'm making most of the content that goes out, video, photography, design, print, web, copy. Bit of marketing strategy on the side.",
  "Photography crept in here too. We bought our first DSLR at Age Care for product and project shots, and somewhere between learning the kit properly and figuring out what made a bathroom actually look good in a frame, I fell for it. These days the camera comes with me on walks as well, mostly around Nottingham and the Peaks, mostly places I'd want to visit anyway. Architecture, landscape, lifestyle, whatever catches my eye when I'm not really looking for it.",
];

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function block(text: string) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    children: [
      {
        _type: "span",
        _key: key(),
        text,
        marks: [],
      },
    ],
    markDefs: [],
  };
}

async function run() {
  const aboutText = PARAGRAPHS.map(block);

  await client
    .patch("siteSettings")
    .set({ aboutText })
    .commit();

  console.log(`✓ Updated siteSettings.aboutText (${PARAGRAPHS.length} paragraphs).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
