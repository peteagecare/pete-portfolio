import { draftMode } from "next/headers";
import { client, draftClient } from "./client";

type QueryParams = Record<string, unknown>;

/**
 * Server-side Sanity fetch that respects Next.js draft mode.
 * Caching is handled at the page level via `'use cache'` + `cacheTag('sanity')`.
 *
 * If Sanity is unreachable (e.g. during a build before env vars are wired up),
 * we log and return `null` instead of throwing — pages render empty rather
 * than failing the build. Real misconfiguration is still loud at runtime.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T> {
  const { isEnabled: cookieDraft } = await draftMode();
  // In local dev, always read the latest Sanity content (drafts or published,
  // whichever is newer) so edits in Studio appear without a server restart.
  // Requires SANITY_API_READ_TOKEN; falls back to the cached client otherwise.
  const isDev = process.env.NODE_ENV === "development";
  const hasReadToken = Boolean(process.env.SANITY_API_READ_TOKEN);
  const isDraft = cookieDraft || (isDev && hasReadToken);
  const c = isDraft ? draftClient : client;
  try {
    return await c.fetch<T>(query, params, {
      next: { tags: ["sanity", ...tags] },
      cache: isDraft ? "no-store" : "force-cache",
    });
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "sanity_fetch_failed",
        error: err instanceof Error ? err.message : String(err),
        tags,
      })
    );
    return null as T;
  }
}
