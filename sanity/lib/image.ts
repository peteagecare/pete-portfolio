import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

type SanityImageSource = Parameters<
  ReturnType<typeof createImageUrlBuilder>["image"]
>[0];

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  metadata?: {
    dimensions?: { width: number; height: number; aspectRatio: number };
    lqip?: string;
  };
};
