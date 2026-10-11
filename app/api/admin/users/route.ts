import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hashPassword, UserRole } from "@/lib/auth";
import { getAdminUsers, getAdminUserByEmail, createAdminUser, createAdminInvite, deleteAdminUser } from "@/lib/db";
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
    const { action } = body;

    // 1. Generate Invite Link
    if (action === "invite") {
      const role: UserRole = body.role || "editor";
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

    // 2. Direct User Creation
    if (action === "create") {
      const { email, password, role = "editor" } = body;
      if (!email || !password) {
        return NextResponse.json({ error: "נא למלא אימייל וסיסמה" }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ error: "על הסיסמה להכיל לפחות 6 תווים" }, { status: 400 });
      }

      const existing = await getAdminUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: "משתמש עם כתובת אימייל זו כבר קיים במערכת" }, { status: 400 });
      }

      const passwordHash = hashPassword(password);
      const newUser = await createAdminUser(email, passwordHash, role as UserRole);

      return NextResponse.json({
        success: true,
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
        message: "המשתמש נוצר בהצלחה",
      });
    }

    // 3. Delete User
    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "מזהה משתמש חסר" }, { status: 400 });
      }
      if (id === user.id) {
        return NextResponse.json({ error: "לא ניתן למחוק את חשבון המנהל שבו אתה מחובר" }, { status: 400 });
      }

      await deleteAdminUser(id);
      return NextResponse.json({ success: true, message: "המשתמש נמחק בהצלחה" });
    }

    return NextResponse.json({ error: "פעולה לא חוקית" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
