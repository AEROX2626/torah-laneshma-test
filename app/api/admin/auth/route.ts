import { NextRequest, NextResponse } from "next/server";
import { getAdminUserByEmail, createAdminUser, getAdminInviteByToken, consumeAdminInvite } from "@/lib/db";
import { verifyPassword, hashPassword, createSessionToken, verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({ authenticated: true, user });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // LOGIN
    if (action === "login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: "נא למלא אימייל וסיסמה" }, { status: 400 });
      }

      const user = await getAdminUserByEmail(email);
      if (!user || !verifyPassword(password, user.password_hash)) {
        return NextResponse.json({ error: "פרטי התחברות שגויים" }, { status: 401 });
      }

      const safeUser = { id: user.id, email: user.email, role: user.role };
      const sessionToken = createSessionToken(safeUser);

      const res = NextResponse.json({ success: true, user: safeUser });
      res.cookies.set({
        name: COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    // LOGOUT
    if (action === "logout") {
      const res = NextResponse.json({ success: true });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }

    // JOIN VIA INVITE
    if (action === "join") {
      const { token, email, password } = body;
      if (!token || !email || !password) {
        return NextResponse.json({ error: "נא למלא את כל השדות" }, { status: 400 });
      }

      const invite = await getAdminInviteByToken(token);
      if (!invite) {
        return NextResponse.json({ error: "קישור ההזמנה אינו תקף או שפג תוקפו" }, { status: 400 });
      }

      const existing = await getAdminUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: "משתמש עם כתובת אימייל זו כבר קיים במערכת" }, { status: 400 });
      }

      const passwordHash = hashPassword(password);
      const newUser = await createAdminUser(email, passwordHash, invite.role);
      await consumeAdminInvite(token);

      const safeUser = { id: newUser.id, email: newUser.email, role: newUser.role };
      const sessionToken = createSessionToken(safeUser);

      const res = NextResponse.json({ success: true, user: safeUser });
      res.cookies.set({
        name: COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    return NextResponse.json({ error: "פעולה לא חוקית" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת פנימית" }, { status: 500 });
  }
}
