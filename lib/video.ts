export type ParsedVideo = {
  src: string;
  provider: "YouTube" | "Vimeo";
  id: string;
};

export function parseVideoUrl(url: string): ParsedVideo | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname === "youtu.be") {
      const id =
        u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : u.searchParams.get("v") ?? u.pathname.split("/").pop();
      if (!id) return null;
      return {
        src: `https://www.youtube.com/embed/${id}`,
        provider: "YouTube",
        id,
      };
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      return {
        src: `https://player.vimeo.com/video/${id}`,
        provider: "Vimeo",
        id,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function getYouTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
