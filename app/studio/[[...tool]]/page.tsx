/**
 * Embedded Sanity Studio.
 * The Studio runs as a single-page client app inside this catch-all route.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
