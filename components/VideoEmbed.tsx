function parseVideoUrl(url: string): { src: string; provider: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname === "youtu.be") {
      const id =
        u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : u.searchParams.get("v") ?? u.pathname.split("/").pop();
      if (!id) return null;
      return { src: `https://www.youtube.com/embed/${id}`, provider: "YouTube" };
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      return { src: `https://player.vimeo.com/video/${id}`, provider: "Vimeo" };
    }
  } catch {
    return null;
  }
  return null;
}

export default function VideoEmbed({ url }: { url?: string }) {
  if (!url) return null;
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <iframe
        src={parsed.src}
        title={`${parsed.provider} video player`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
