import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email required"),
  opportunity: z.enum(["full-time", "freelance", "collab", "other"]),
  message: z.string().min(10, "A bit more detail, please").max(4000),
});

export async function POST(req: Request) {
  const start = Date.now();
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  // ─── TODO: wire up Resend ───────────────────────────────────────────────
  // To replace the console.log below with real email delivery:
  //
  // 1. npm install resend
  // 2. Add RESEND_API_KEY and CONTACT_TO_EMAIL to .env.local
  // 3. Replace the console.log block with:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "Portfolio <noreply@mail.petejenkins.uk>",
  //     to: process.env.CONTACT_TO_EMAIL!,
  //     replyTo: parsed.data.email,
  //     subject: `New ${parsed.data.opportunity} enquiry from ${parsed.data.name}`,
  //     text: parsed.data.message,
  //   });
  //
  // The sending domain mail.petejenkins.uk needs SPF/DKIM verified in
  // Resend before it'll deliver — same drill as your other Resend project.
  // ────────────────────────────────────────────────────────────────────────

  console.log(
    JSON.stringify({
      level: "info",
      msg: "contact_submission",
      route: "/api/contact",
      data: parsed.data,
      ms: Date.now() - start,
    })
  );

  return NextResponse.json({ ok: true });
}
