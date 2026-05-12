import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch — Pete Jenkins, photographer, filmmaker and web developer, Nottingham UK.",
};

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings | null>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });

  const email = settings?.contactEmail ?? "hello@petejenkins.uk";

  return (
    <section className="pt-40 pb-24 md:pt-48 md:pb-32 mx-auto max-w-[1600px] px-6 md:px-10">
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <header className="md:col-span-5">
          <span className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-6">
            Contact
          </span>
          <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] mb-8">
            Let&apos;s
            <br />
            <span className="font-serif italic font-normal normal-case">
              talk.
            </span>
          </h1>
          <p className="text-[var(--color-ink-soft)] leading-relaxed text-lg max-w-[40ch] mb-10">
            Commissions, editorial work, creative roles, or just an
            introduction.
          </p>

          <div className="space-y-5 text-sm">
            <div>
              <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
                Email
              </span>
              <a
                href={`mailto:${email}`}
                className="text-[var(--color-ink)] underline underline-offset-4"
              >
                {email}
              </a>
            </div>
            <div>
              <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-2">
                Based
              </span>
              <span className="text-[var(--color-ink)]">
                Nottingham, working UK-wide
              </span>
            </div>
          </div>
        </header>

        <div className="md:col-span-7 md:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
