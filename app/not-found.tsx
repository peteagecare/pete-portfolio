import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 gap-6">
      <span className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)]">
        404
      </span>
      <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95]">
        Lost the page,
        <br />
        <span className="font-serif italic font-normal normal-case">
          not the plot.
        </span>
      </h1>
      <Link
        href="/"
        className="mt-4 inline-block text-[0.7rem] tracking-[0.22em] uppercase border-b border-[var(--color-ink)] pb-1"
      >
        Back to the homepage
      </Link>
    </section>
  );
}
