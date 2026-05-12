import { draftMode } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DraftModeBar from "@/components/DraftModeBar";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraft } = await draftMode();
  return (
    <div className="min-h-screen flex flex-col">
      {isDraft ? <DraftModeBar /> : null}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
