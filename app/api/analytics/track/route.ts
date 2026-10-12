import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { recordSiteVisit } from "@/lib/db";

const BOT_PATTERNS = [
  /bot/i,
  /spider/i,
  /crawl/i,
  /slurp/i,
  /mediapartners/i,
  /ahrefs/i,
  /semrush/i,
  /yandex/i,
  /bingpreview/i,
];

function detectSource(referrer: string, utmSource?: string): string {
  if (utmSource) return utmSource.toLowerCase();
  if (!referrer) return "direct";

  const ref = referrer.toLowerCase();
  if (ref.includes("whatsapp") || ref.includes("wa.me")) return "WhatsApp";
  if (ref.includes("google")) return "Google";
  if (ref.includes("facebook") || ref.includes("fb.me") || ref.includes("instagram")) return "Facebook/Instagram";
  if (ref.includes("t.me") || ref.includes("telegram")) return "Telegram";
  if (ref.includes("linkedin")) return "LinkedIn";
  if (ref.includes("tiktok")) return "TikTok";
  if (ref.includes("twitter") || ref.includes("x.com")) return "Twitter/X";

  try {
    const url = new URL(referrer);
    return url.hostname.replace("www.", "");
  } catch {
    return "other";
  }
}

function detectDevice(userAgent: string): "mobile" | "desktop" | "tablet" {
  const ua = userAgent.toLowerCase();
  if (ua.includes("ipad") || ua.includes("tablet")) return "tablet";
  if (ua.includes("mobi") || ua.includes("iphone") || ua.includes("android")) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";

    // Ignore search engine and analytics crawlers
    if (BOT_PATTERNS.some((p) => p.test(userAgent))) {
      return NextResponse.json({ ignored: true });
    }

    const body = await req.json().catch(() => ({}));
    const path = String(body.path || "/");

    // Don't track admin pages or internal API routes
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ignored: true });
    }

    const referrer = String(body.referrer || req.headers.get("referer") || "");
    const utmSource = body.utm_source ? String(body.utm_source) : undefined;
    const source = detectSource(referrer, utmSource);
    const device = detectDevice(userAgent);

    // Geolocation from Vercel edge headers
    const country = req.headers.get("x-vercel-ip-country") || undefined;
    const city = req.headers.get("x-vercel-ip-city") || undefined;

    // Anonymous daily IP hash for unique visitor metrics
    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const dateStr = new Date().toISOString().slice(0, 10);
    const ip_hash = crypto
      .createHash("sha256")
      .update(`${rawIp}-${dateStr}`)
      .digest("hex")
      .slice(0, 16);

    await recordSiteVisit({
      path,
      referrer: referrer.slice(0, 200),
      source,
      device,
      ip_hash,
      country,
      city,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
