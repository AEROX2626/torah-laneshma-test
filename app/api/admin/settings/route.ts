import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "app", "data", "admin_store.json");

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  let settings = {
    site_name: "תורה לנשמה",
    whatsapp_number: "050-3938114",
    contact_email: "contact@torah-laneshma.co.il",
    analytics_id: "G-PQ4ZMY1H4V",
    hide_from_google: false,
  };

  try {
    if (fs.existsSync(STORE_PATH)) {
      const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (store.settings) {
        settings = { ...settings, ...store.settings };
      }
    }
  } catch {}

  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "פעולה זו מורשית למנהלים בלבד" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { settings } = body;

    if (fs.existsSync(STORE_PATH)) {
      const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      store.settings = { ...store.settings, ...settings };
      fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    }

    return NextResponse.json({ success: true, message: "ההגדרות נשמרו בהצלחה" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
