import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Archivo_Black } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://petejenkins.uk"
  ),
  title: {
    default: "Pete Jenkins — Photographer, Filmmaker, Web Developer",
    template: "%s — Pete Jenkins",
  },
  description:
    "Pete Jenkins is a Nottingham-based creative working across photography, video and the web.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Pete Jenkins",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${archivoBlack.variable}`}
    >
      <body className="bg-[var(--color-bg)] text-[var(--color-ink)]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
      <GoogleAnalytics gaId="G-TW7JMYYGYQ" />
      <Script id="ms-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wt0m8lhqfb");`}
      </Script>
    </html>
  );
}
