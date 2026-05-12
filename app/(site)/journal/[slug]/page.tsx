import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import {
  journalPostBySlugQuery,
  journalSlugsQuery,
} from "@/sanity/queries";
import type { JournalPost } from "@/sanity/types";
import SanityImage from "@/components/SanityImage";
import PortableText from "@/components/PortableText";

type Params = { slug: string };

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(journalSlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<JournalPost | null>({
    query: journalPostBySlugQuery,
    params: { slug },
    tags: ["journalPost"],
  });
  if (!post) return { title: "Journal — Not found" };
  return {
    title: post.title,
    description: post.excerpt ?? `Journal entry by Pete Jenkins.`,
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<JournalPost | null>({
    query: journalPostBySlugQuery,
    params: { slug },
    tags: ["journalPost"],
  });

  if (!post) notFound();

  return (
    <article>
      <header className="pt-40 pb-12 md:pt-48 md:pb-16 mx-auto max-w-[80ch] px-6 md:px-10 text-center">
        {post.publishedAt ? (
          <time
            dateTime={post.publishedAt}
            className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6"
          >
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        ) : null}
        <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] mb-6">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="font-serif italic text-xl md:text-2xl text-[var(--color-ink-soft)] max-w-[50ch] mx-auto">
            {post.excerpt}
          </p>
        ) : null}
      </header>

      {post.coverImage ? (
        <div className="relative aspect-[16/9] mx-auto max-w-[1400px] px-0 md:px-10 mb-16 overflow-hidden">
          <div className="relative w-full h-full overflow-hidden">
            <SanityImage
              image={post.coverImage}
              sizes="(min-width: 768px) 90vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-[68ch] px-6 md:px-10 pb-24 md:pb-32">
        <PortableText value={post.body} />
      </section>

      <div className="border-t border-[var(--color-line)] mx-auto max-w-[1600px] px-6 md:px-10 py-12">
        <Link
          href="/journal"
          className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1"
        >
          ← All journal
        </Link>
      </div>
    </article>
  );
}
