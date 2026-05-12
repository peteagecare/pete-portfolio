import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type") ?? "project";

  if (!process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Preview secret not configured", { status: 500 });
  }
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  // Verify the doc exists in the dataset before enabling draft mode.
  const exists = await client.fetch<string | null>(
    `*[_type == $type && slug.current == $slug][0]._id`,
    { type, slug }
  );
  if (!exists) {
    return new Response("Document not found", { status: 404 });
  }

  const draft = await draftMode();
  draft.enable();

  const path =
    type === "journalPost" ? `/journal/${slug}` : `/portfolio/${slug}`;
  redirect(path);
}
