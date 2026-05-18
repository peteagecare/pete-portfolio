import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { equipmentByCategoryQuery } from "@/sanity/queries";
import type {
  Equipment,
  EquipmentByCategory,
  EquipmentCategory,
} from "@/sanity/types";
import SanityImage from "@/components/SanityImage";

export const metadata: Metadata = {
  title: "Equipment",
  description:
    "The cameras, lenses and support kit I work with. Sony A7 V, A6700, Sigma Art glass, DJI RS 3.",
  openGraph: {
    description:
      "The cameras, lenses and support kit I work with. Sony A7 V, A6700, Sigma Art glass, DJI RS 3.",
  },
};

const CATEGORY_TITLES: Record<EquipmentCategory, string> = {
  camera: "Cameras",
  lens: "Lenses",
  support: "Support",
  audio: "Audio",
  lighting: "Lighting",
  accessory: "Accessories",
};

const CATEGORY_ORDER: EquipmentCategory[] = [
  "camera",
  "lens",
  "support",
  "audio",
  "lighting",
  "accessory",
];

export default async function EquipmentPage() {
  const eq = await sanityFetch<EquipmentByCategory | null>({
    query: equipmentByCategoryQuery,
    tags: ["equipment"],
  });

  const groups = eq ?? {
    camera: [],
    lens: [],
    support: [],
    audio: [],
    lighting: [],
    accessory: [],
  };

  const total = CATEGORY_ORDER.reduce((n, k) => n + groups[k].length, 0);

  return (
    <>
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
          Equipment
        </span>
        <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] max-w-[18ch] mb-6">
          What I shoot{" "}
          <span className="font-serif italic font-normal normal-case">on,</span>
          <br />
          and what I shoot{" "}
          <span className="font-serif italic font-normal normal-case">
            with.
          </span>
        </h1>
        <p className="max-w-[68ch] text-[var(--color-ink-soft)] leading-relaxed text-base md:text-[1.0625rem]">
          Photography started as a necessity. Age Care Bathrooms needed
          product shots and I was the one taking them. I bought my own A6700
          a few weeks later and never put it down. Added the A7 V as my main
          body and built the rest of the kit around it.
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-32">
        {total === 0 ? (
          <p className="text-center text-[var(--color-mute)] font-serif italic text-xl py-24">
            Add equipment in the Studio to populate this page.
          </p>
        ) : (
          <div className="space-y-24 md:space-y-32">
            {CATEGORY_ORDER.map((cat) => {
              const items = groups[cat];
              if (items.length === 0) return null;
              return (
                <CategorySection
                  key={cat}
                  title={CATEGORY_TITLES[cat]}
                  items={items}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function CategorySection({
  title,
  items,
}: {
  title: string;
  items: Equipment[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 md:mb-10 border-b border-[var(--color-line)] pb-4">
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
        <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
        {items.map((item) => (
          <EquipmentItem key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function EquipmentItem({ item }: { item: Equipment }) {
  return (
    <li className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-5 md:gap-6 items-start">
      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-soft)]">
        {item.image ? (
          <SanityImage
            image={item.image}
            sizes="(min-width: 768px) 120px, 80px"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-serif italic text-2xl text-[var(--color-mute)]"
          >
            {item.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="font-display text-lg md:text-xl text-[var(--color-ink)] leading-tight">
            {item.name}
          </h3>
          {item.quantity && item.quantity > 1 ? (
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] bg-[var(--color-bg-soft)] px-2 py-0.5">
              ×{item.quantity}
            </span>
          ) : null}
        </div>
        {item.brand ? (
          <p className="mt-1 text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
            {item.brand}
          </p>
        ) : null}
        {item.description ? (
          <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed text-[0.95rem]">
            {item.description}
          </p>
        ) : null}
      </div>
    </li>
  );
}
