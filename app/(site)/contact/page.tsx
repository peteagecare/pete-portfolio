import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch — Pete Jenkins, photographer, filmmaker and web developer, Nottingham UK.",
};

const ADDRESS_QUERY = "2+Truman+Street,+Kimberley,+Nottingham,+NG16+2HA";
const MAP_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=-1.2747%2C52.9968%2C-1.2547%2C53.0068&layer=mapnik&marker=53.0018%2C-1.2647`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${ADDRESS_QUERY}`;

export default function ContactPage() {
  return (
    <section className="pt-32 md:pt-36 pb-24 md:pb-32 mx-auto max-w-[1600px] px-6 md:px-10">
      <h1 className="block text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-8">
        Contact
      </h1>
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          <ul className="md:col-span-5 grid gap-4 content-start">
            <li>
              <a
                href="tel:+447568945934"
                className="group flex items-start gap-4 rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6 md:p-7 hover:border-[var(--color-ink)] transition-colors"
              >
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1B2447] text-amber-300 flex-shrink-0"
                >
                  <Phone className="w-5 h-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                    Phone
                  </span>
                  <span className="block font-display text-xl md:text-2xl text-[var(--color-ink)] group-hover:text-[var(--color-mute)] transition-colors">
                    07568 945934
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="mailto:petejenkinss@hotmail.com"
                className="group flex items-start gap-4 rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6 md:p-7 hover:border-[var(--color-ink)] transition-colors"
              >
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1B2447] text-amber-300 flex-shrink-0"
                >
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                    Email
                  </span>
                  <span className="block font-display text-xl md:text-2xl text-[var(--color-ink)] group-hover:text-[var(--color-mute)] transition-colors break-all">
                    petejenkinss@hotmail.com
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6 md:p-7 hover:border-[var(--color-ink)] transition-colors"
              >
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1B2447] text-amber-300 flex-shrink-0"
                >
                  <MapPin className="w-5 h-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-mute)] mb-1">
                    Studio
                  </span>
                  <span className="block font-display text-xl md:text-2xl text-[var(--color-ink)] group-hover:text-[var(--color-mute)] transition-colors leading-tight">
                    2 Truman Street
                    <br />
                    Kimberley, Nottingham
                    <br />
                    NG16 2HA
                  </span>
                </span>
              </a>
            </li>
          </ul>

          <div className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:min-h-[480px] rounded-3xl overflow-hidden border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
            <iframe
              title="Map showing 2 Truman Street, Kimberley, Nottingham"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full border-0"
            />
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] px-4 py-2 text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-ink)] shadow-md hover:border-[var(--color-ink)] transition-colors"
            >
              Open in maps ↗
            </a>
          </div>
        </div>
    </section>
  );
}
