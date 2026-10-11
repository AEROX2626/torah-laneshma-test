import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getFaqs, saveFaq, deleteFaq, restoreFaq } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const includeTrash = searchParams.get("trash") === "true";

  const items = await getFaqs({ includeTrash });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Reorder action
    if (body.action === "reorder") {
      const { items } = body; // Array of { id, display_order }
      if (Array.isArray(items)) {
        for (const it of items) {
          const current = (await getFaqs()).find((f) => f.id === it.id);
          if (current) {
            await saveFaq({ ...current, display_order: it.display_order });
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    // Save or update FAQ
    const { id, question, answer, category, display_order, is_published } = body;
    if (!question || !answer) {
      return NextResponse.json({ error: "נא למלא שאלה ותשובה" }, { status: 400 });
    }

    const saved = await saveFaq({
      id,
      question,
      answer,
      category: category || "כללי",
      display_order: Number(display_order) || 0,
      is_published: is_published ?? true,
    });

    return NextResponse.json({ success: true, item: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action") || "trash"; // "trash" | "permanent" | "restore"

    if (!id) {
      return NextResponse.json({ error: "מזהה שאלה חסר" }, { status: 400 });
    }

    if (action === "restore") {
      await restoreFaq(id);
      return NextResponse.json({ success: true, message: "השאלה שוחזרה בהצלחה" });
    }

    const isPermanent = action === "permanent";
    await deleteFaq(id, isPermanent);
    return NextResponse.json({
      success: true,
      message: isPermanent ? "השאלה נמחקה לצמיתות" : "השאלה הועברה לסל המיחזור",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
