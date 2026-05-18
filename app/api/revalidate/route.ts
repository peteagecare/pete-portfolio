import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook handler — revalidates Next.js cache tags when content changes.
 * Configure the webhook in Sanity at:
 *   manage.sanity.io → API → Webhooks → Add
 *   URL: https://<your-domain>/api/revalidate
 *   Trigger: Create / Update / Delete
 *   Filter: _type == "project" || _type == "service" || _type == "siteSettings"
 *   Projection: { "_type": _type }
 *   Secret: matches SANITY_REVALIDATE_SECRET in this app's env
 */
export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json({ error: "Missing _type" }, { status: 400 });
    }

    revalidateTag("sanity", "max");
    revalidateTag(body._type, "max");

    console.log(
      JSON.stringify({
        level: "info",
        msg: "revalidated",
        type: body._type,
        ms: Date.now() - start,
      })
    );

    return NextResponse.json({ ok: true, type: body._type });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "revalidate_failed",
        error: err instanceof Error ? err.message : String(err),
        ms: Date.now() - start,
      })
    );
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
