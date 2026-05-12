export default function DraftModeBar() {
  return (
    <div className="sticky top-0 z-[60] bg-[var(--color-ink)] text-[var(--color-bg)] text-xs tracking-[0.18em] uppercase">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-2 flex items-center justify-between">
        <span>Draft mode — viewing unpublished content</span>
        <a
          href="/api/draft-mode/disable"
          className="underline underline-offset-4"
        >
          Exit draft
        </a>
      </div>
    </div>
  );
}
