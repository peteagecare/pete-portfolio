/**
 * One-off helper to patch the siteSettings socialLinks with real URLs.
 * Run via: npm run socials
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

const socialLinks = [
  {
    _key: "ig",
    platform: "instagram",
    url: "https://www.instagram.com/petejenkinssss",
  },
  {
    _key: "fl",
    platform: "flickr",
    url: "https://www.flickr.com/photos/203368911@N04/",
  },
  {
    _key: "li",
    platform: "linkedin",
    url: "https://linkedin.com/in/petejenkins",
  },
];

async function run() {
  await client.patch("siteSettings").set({ socialLinks }).commit();
  console.log("✓ socialLinks updated on siteSettings");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
