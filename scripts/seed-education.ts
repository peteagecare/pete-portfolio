/**
 * One-off: seed initial education entries.
 *
 * Usage:
 *   npx tsx scripts/seed-education.ts
 *
 * Safe to re-run — every entry has a stable _id so it upserts.
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

async function run() {
  const docs = [
    {
      _id: "education-york-st-john",
      _type: "education",
      institution: "York St John University",
      qualification: "BA (Hons) Music Production",
      startYear: 2011,
      endYear: 2014,
      order: 0,
    },
  ];

  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc as any);
  const result = await tx.commit();
  console.log(`✓ Seeded ${result.results.length} education entries.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
