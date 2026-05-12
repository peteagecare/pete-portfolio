import { metadata as studioMetadata, viewport as studioViewport } from "next-sanity/studio";

export const metadata = studioMetadata;
export const viewport = studioViewport;
export const dynamic = "force-static";

/**
 * Studio uses its own layout — bypasses the site Header/Footer
 * so the embedded Sanity Studio fills the viewport.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ height: "100vh" }}>{children}</div>;
}
