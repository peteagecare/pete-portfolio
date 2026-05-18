import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { projectSlugsQuery } from "@/sanity/queries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://petejenkins.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectSlugs = await client
    .fetch<string[]>(projectSlugsQuery)
    .catch(() => [] as string[]);

  const now = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/portfolio",
    "/equipment",
    "/contact",
  ].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  return [
    ...staticRoutes,
    ...projectSlugs.map((slug) => ({
      url: `${SITE_URL}/portfolio/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
