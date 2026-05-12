import { type NextRequest, NextResponse } from "next/server";

/**
 * Instagram long-lived token refresh.
 *
 * Long-lived tokens last 60 days. Calling this endpoint with a still-valid
 * token (must have been used at least once in the last 24 hours) issues a
 * new 60-day token. A Vercel cron hits this weekly so the token effectively
 * never expires while the cron is healthy.
 *
 * BUT — Vercel env vars can't be updated from inside the runtime. So this
 * route currently just *fetches* the new token and logs it. To make it
 * fully automatic, the new token needs to be persisted somewhere the next
 * request can read it — Vercel Edge Config or KV are the right tools.
 *
 * For now: this endpoint is informational. When you see it in your logs,
 * grab the new token from the response and update INSTAGRAM_ACCESS_TOKEN
 * in Vercel manually. (Or wire up Edge Config later — see TODO below.)
 */

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`. Manual calls
  // can pass ?secret=... in the URL.
  const querySecret = new URL(req.url).searchParams.get("secret");
  const isAuthorised =
    (cronSecret && auth === `Bearer ${cronSecret}`) ||
    (cronSecret && querySecret === cronSecret);

  if (!isAuthorised) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "INSTAGRAM_ACCESS_TOKEN not set" },
      { status: 500 }
    );
  }

  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: { message?: string };
    };

    if (!res.ok || !data.access_token) {
      console.error(
        JSON.stringify({
          level: "error",
          msg: "instagram_refresh_failed",
          status: res.status,
          error: data.error?.message ?? "no token returned",
        })
      );
      return NextResponse.json(
        { error: data.error?.message ?? "Refresh failed" },
        { status: 502 }
      );
    }

    // TODO: persist data.access_token to Vercel Edge Config or KV so the
    // app can read the latest token without manual env-var updates.
    // For now, log it so it's grabbable from runtime logs.
    console.log(
      JSON.stringify({
        level: "info",
        msg: "instagram_token_refreshed",
        expires_in_days: Math.round((data.expires_in ?? 0) / 86400),
        token_prefix: data.access_token.slice(0, 12) + "...",
      })
    );

    return NextResponse.json({
      ok: true,
      expires_in_days: Math.round((data.expires_in ?? 0) / 86400),
      // Only returned in the response body — don't log full tokens to public logs.
      access_token: data.access_token,
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "instagram_refresh_error",
        error: err instanceof Error ? err.message : String(err),
      })
    );
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
