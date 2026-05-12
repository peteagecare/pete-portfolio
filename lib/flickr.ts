/**
 * Flickr public photostream feed — no API key, no Pro account required.
 *
 * Uses the legacy `flickr.com/services/feeds/photos_public.gne` JSON feed
 * which returns the latest ~20 public photos for a user. Free for everyone.
 *
 * For per-photo details (camera, EXIF, albums) we use the same site_key
 * Flickr embeds in every photo page — it's their public frontend key, used
 * by their own JS for read-only operations. Cached, refetched if stale.
 *
 * Reads:
 *   NEXT_PUBLIC_FLICKR_USER_ID — required, e.g. "203368911@N04"
 */

const FEED_URL = "https://api.flickr.com/services/feeds/photos_public.gne";
const REST_URL = "https://api.flickr.com/services/rest/";
const REVALIDATE_FEED = 3600; // 1h
const REVALIDATE_DETAILS = 86400; // 24h
const REVALIDATE_SITE_KEY = 1800; // 30m — Flickr rotates this

export type FlickrPhoto = {
  id: string;
  title: string;
  pageUrl: string;
  src: string;
};

export type FlickrPhotoDetails = {
  id: string;
  title: string;
  description: string;
  dateTaken: string | null;
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  shutter: string | null;
  iso: string | null;
  albums: { id: string; title: string }[];
};

type FeedItem = {
  title: string;
  link: string;
  media: { m: string };
};

function upscale(mediumUrl: string, suffix: "z" | "b" | "h" = "b"): string {
  return mediumUrl.replace(/_m\.(jpg|jpeg|png)$/i, `_${suffix}.$1`);
}

function extractPhotoId(pageUrl: string): string {
  const match = pageUrl.match(/\/photos\/[^/]+\/(\d+)/);
  return match?.[1] ?? pageUrl;
}

export async function getRecentFlickrPhotos(
  count = 12
): Promise<FlickrPhoto[]> {
  const userId = process.env.NEXT_PUBLIC_FLICKR_USER_ID;
  if (!userId) return [];

  const params = new URLSearchParams({
    id: userId,
    format: "json",
    nojsoncallback: "1",
  });

  try {
    const res = await fetch(`${FEED_URL}?${params}`, {
      next: { tags: ["flickr"], revalidate: REVALIDATE_FEED },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { items?: FeedItem[] };
    return (json.items ?? []).slice(0, count).map(
      (item): FlickrPhoto => ({
        id: extractPhotoId(item.link),
        title: item.title || "",
        pageUrl: item.link,
        src: upscale(item.media.m, "b"),
      })
    );
  } catch {
    return [];
  }
}

export function flickrProfileUrl(): string | null {
  const userId = process.env.NEXT_PUBLIC_FLICKR_USER_ID;
  if (!userId) return null;
  return `https://www.flickr.com/photos/${userId}/`;
}

/**
 * Scrape Flickr's public frontend site_key from the user's profile page.
 * Cached for 30 min — Flickr rotates the key but slowly.
 */
async function getFlickrSiteKey(): Promise<string | null> {
  const userId = process.env.NEXT_PUBLIC_FLICKR_USER_ID;
  if (!userId) return null;
  try {
    const res = await fetch(`https://www.flickr.com/photos/${userId}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://github.com)",
      },
      next: { tags: ["flickr-site-key"], revalidate: REVALIDATE_SITE_KEY },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/site_key\s*=\s*"([a-f0-9]{32})"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

type ExifTag = {
  tag: string;
  raw?: { _content?: string };
  clean?: { _content?: string };
};

/**
 * Privacy filter — only extract camera/settings tags. Drops GPS, location,
 * software, and anything else that could leak.
 */
const ALLOWED_EXIF_TAGS = new Set([
  "Make",
  "Model",
  "LensModel",
  "FocalLength",
  "FNumber",
  "ApertureValue",
  "ExposureTime",
  "ISO",
  "ISOSpeedRatings",
]);

function exifValue(tags: ExifTag[], name: string): string | null {
  if (!ALLOWED_EXIF_TAGS.has(name)) return null;
  const t = tags.find((x) => x.tag === name);
  return t?.clean?._content ?? t?.raw?._content ?? null;
}

export async function getFlickrPhotoDetails(
  photoId: string
): Promise<FlickrPhotoDetails | null> {
  const siteKey = await getFlickrSiteKey();
  if (!siteKey) return null;

  const call = (method: string) =>
    fetch(
      `${REST_URL}?method=${method}&api_key=${siteKey}&photo_id=${photoId}&format=json&nojsoncallback=1`,
      { next: { tags: ["flickr-photo"], revalidate: REVALIDATE_DETAILS } }
    )
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

  const [info, exif, contexts] = await Promise.all([
    call("flickr.photos.getInfo"),
    call("flickr.photos.getExif"),
    call("flickr.photos.getAllContexts"),
  ]);

  if (!info?.photo) return null;

  const exifTags: ExifTag[] = exif?.photo?.exif ?? [];
  const camera = exif?.photo?.camera ?? null;

  return {
    id: photoId,
    title: info.photo.title?._content ?? "",
    description: info.photo.description?._content ?? "",
    dateTaken: info.photo.dates?.taken ?? null,
    camera,
    lens: exifValue(exifTags, "LensModel"),
    focalLength: exifValue(exifTags, "FocalLength"),
    aperture:
      exifValue(exifTags, "FNumber") ?? exifValue(exifTags, "ApertureValue"),
    shutter: exifValue(exifTags, "ExposureTime"),
    iso:
      exifValue(exifTags, "ISO") ?? exifValue(exifTags, "ISOSpeedRatings"),
    albums: ((contexts?.set ?? []) as { id: string; title: string }[]).map(
      (s) => ({ id: s.id, title: s.title })
    ),
  };
}
