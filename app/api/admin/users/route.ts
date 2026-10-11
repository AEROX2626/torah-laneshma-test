import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAdminUsers, createAdminInvite } from "@/lib/db";
import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "app", "data", "admin_store.json");

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  const users = await getAdminUsers();

  let invites: any[] = [];
  try {
    if (fs.existsSync(STORE_PATH)) {
      const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      invites = (store.invites || []).filter(
        (inv: any) => !inv.used_at && new Date(inv.expires_at) > new Date()
      );
    }
  } catch {}

  return NextResponse.json({ users, invites, currentUser: user });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "פעולה זו מורשית למנהלי מערכת בלבד" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, role = "editor" } = body;

    if (action === "invite") {
      const invite = await createAdminInvite(role);
      const origin = req.headers.get("origin") || req.nextUrl.origin || "";
      const inviteUrl = `${origin}/admin/join?token=${invite.token}`;

      return NextResponse.json({
        success: true,
        invite,
        inviteUrl,
        message: "קישור ההזמנה נוצר בהצלחה",
      });
    }

    return NextResponse.json({ error: "פעולה לא חוקית" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
