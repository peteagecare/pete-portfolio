/**
 * Instagram Graph API fetch helper — uses the "Instagram API with Instagram Login"
 * flow that's available for Creator/Business accounts (no Facebook Page required).
 *
 * Reads:
 *   INSTAGRAM_ACCESS_TOKEN          — long-lived token (60-day expiry, refresh route below)
 *   NEXT_PUBLIC_INSTAGRAM_USERNAME  — used for the "View on Instagram" link only
 *
 * Cached for 1 hour. Tag with "instagram" to bust manually.
 */

const GRAPH = "https://graph.instagram.com";
const REVALIDATE_SECONDS = 3600;

export type InstagramMedia = {
  id: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  /** For VIDEO this is the .mp4. Use thumbnail for display. */
  mediaUrl: string;
  /** Display URL — thumbnail for video, mediaUrl otherwise. */
  displayUrl: string;
  permalink: string;
  timestamp: string;
};

type RawMedia = {
  id: string;
  caption?: string;
  media_type: InstagramMedia["mediaType"];
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

export async function getRecentInstagramMedia(
  count = 9
): Promise<InstagramMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `${GRAPH}/me/media?fields=${fields}&limit=${count}&access_token=${encodeURIComponent(token)}`;

  const start = Date.now();
  try {
    const res = await fetch(url, {
      next: { tags: ["instagram"], revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        JSON.stringify({
          level: "warn",
          msg: "instagram_fetch_failed",
          status: res.status,
          body: text.slice(0, 200),
          ms: Date.now() - start,
        })
      );
      return [];
    }
    const json = (await res.json()) as { data?: RawMedia[] };
    return (json.data ?? []).map(
      (m): InstagramMedia => ({
        id: m.id,
        caption: m.caption ?? "",
        mediaType: m.media_type,
        mediaUrl: m.media_url ?? m.thumbnail_url ?? "",
        displayUrl:
          m.media_type === "VIDEO"
            ? (m.thumbnail_url ?? m.media_url ?? "")
            : (m.media_url ?? ""),
        permalink: m.permalink,
        timestamp: m.timestamp,
      })
    );
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "instagram_fetch_error",
        error: err instanceof Error ? err.message : String(err),
        ms: Date.now() - start,
      })
    );
    return [];
  }
}

export function instagramProfileUrl(): string | null {
  const u = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME;
  if (!u) return null;
  return `https://www.instagram.com/${u}/`;
}
