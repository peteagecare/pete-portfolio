import { NextResponse } from "next/server";
import { getFlickrPhotoDetails } from "@/lib/flickr";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid photo id" }, { status: 400 });
  }
  const details = await getFlickrPhotoDetails(id);
  if (!details) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(details, {
    headers: {
      // Browser cache for 1h, revalidate in background up to 24h
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
