import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allJournalPostsQuery } from "@/sanity/queries";
import type { JournalPostSummary } from "@/sanity/types";
import SanityImage from "@/components/SanityImage";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes, essays and behind-the-scenes from Pete Jenkins — photographer, filmmaker and web developer.",
};

export default async function JournalPage() {
  const posts =
    (await sanityFetch<JournalPostSummary[] | null>({
      query: allJournalPostsQuery,
      tags: ["journalPost"],
    })) ?? [];

  return (
    <>
      <section className="pt-40 pb-16 md:pt-48 md:pb-24 mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
          Journal
        </span>
        <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.9] max-w-[14ch]">
          Notes
          <br />
          <span className="font-serif italic font-normal normal-case">
            from
          </span>{" "}
          the road.
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-32">
        {posts.length === 0 ? (
          <p className="text-center text-[var(--color-mute)] py-24 font-serif italic text-xl">
            New entries coming soon.
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-20">
            {posts.map((p) => (
              <li key={p._id}>
                <Link
                  href={`/journal/${p.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-soft)]">
                    <SanityImage
                      image={p.coverImage}
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover img-hover"
                    />
                  </div>
                  <div className="mt-6">
                    {p.publishedAt ? (
                      <time
                        dateTime={p.publishedAt}
                        className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-3"
                      >
                        {new Date(p.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    ) : null}
                    <h2 className="font-display text-2xl md:text-3xl mb-3">
                      {p.title}
                    </h2>
                    {p.excerpt ? (
                      <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-[42ch]">
                        {p.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
