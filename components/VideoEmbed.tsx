import clsx from "clsx";
import { parseVideoUrl } from "@/lib/video";

export default function VideoEmbed({
  url,
  orientation = "horizontal",
  className,
  autoplay = false,
}: {
  url?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  autoplay?: boolean;
}) {
  if (!url) return null;
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;
  const src = autoplay
    ? `${parsed.src}${parsed.src.includes("?") ? "&" : "?"}autoplay=1`
    : parsed.src;
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-black w-full",
        orientation === "vertical" ? "aspect-[9/16]" : "aspect-video",
        className,
      )}
    >
      <iframe
        src={src}
        title={`${parsed.provider} video player`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
