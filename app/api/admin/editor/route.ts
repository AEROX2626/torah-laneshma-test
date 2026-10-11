import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSiteDoc, saveSiteDoc } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("docId") || "page_home";

  const doc = await getSiteDoc(docId);
  if (!doc) {
    return NextResponse.json({ error: "מסמך לא נמצא" }, { status: 404 });
  }

  return NextResponse.json({ doc });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { docId, doc, action } = body; // action: "draft" | "publish"

    if (!docId || !doc) {
      return NextResponse.json({ error: "נתונים חסרים" }, { status: 400 });
    }

    const updatedDoc = {
      ...doc,
      revision: action === "publish" ? (doc.revision || 1) + 1 : doc.revision || 1,
      updated_at: new Date().toISOString(),
    };

    const saved = await saveSiteDoc(docId, updatedDoc);

    return NextResponse.json({
      success: true,
      doc: saved,
      message: action === "publish" ? "העמוד פורסם בהצלחה באתר!" : "הטיוטה נשמרה",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
