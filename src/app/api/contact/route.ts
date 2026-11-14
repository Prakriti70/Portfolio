import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";

/**
 * Contact form backend. Validates on the server, blocks obvious bots, and sends mail via Resend.
 * If Resend isn't configured it answers 503 "not_configured" so the UI can offer a mailto: fallback
 * instead of pretending the message was sent.
 */

// Very small in-memory rate limit: 5 messages per hour per IP.
// (On serverless hosts each instance has its own memory, so treat this as a speed bump, not a wall.)
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "rate_limited", message: "Too many messages. Please try again later." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "That request wasn't valid." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", message: "Please check the form.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { name, email, message, startedAt } = parsed.data;

  // Bots fill in the hidden field (rejected by the schema above) or submit instantly.
  if (typeof startedAt === "number" && Date.now() - startedAt < 2500) {
    return NextResponse.json({ error: "too_fast", message: "That was quick! Please try again." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`, // plain text only: nothing to inject
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return NextResponse.json({ error: "send_failed", message: "The message couldn't be sent." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "send_failed", message: "The message couldn't be sent." }, { status: 502 });
  }
}
