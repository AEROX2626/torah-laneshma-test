import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubmissions, updateSubmissionStatus } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";
  const kind = searchParams.get("kind") || "all";
  const search = searchParams.get("search") || "";
  const isExport = searchParams.get("export") === "csv";

  let items = await getSubmissions({ status, search });
  if (kind !== "all") {
    items = items.filter((i) => i.kind === kind);
  }

  // Handle CSV Export with formula injection protection
  if (isExport) {
    const sanitize = (val: string = "") => {
      let str = String(val).replace(/"/g, '""');
      // Protect against CSV Formula Injection (=, +, -, @)
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str}"`;
    };

    const headers = ["מזהה", "סוג פנייה", "שם מלא", "טלפון", "נושא / הודעה", "סטטוס", "הערות פנימיות", "תאריך יצירה"];
    const rows = items.map((i) => [
      sanitize(i.id),
      sanitize(i.kind === "chavruta" ? "חברותא" : "אמץ אברך"),
      sanitize(i.name),
      sanitize(i.phone),
      sanitize(i.topic_or_message || ""),
      sanitize(
        i.status === "new"
          ? "חדשה"
          : i.status === "in_progress"
          ? "בטיפול"
          : i.status === "done"
          ? "טופלה"
          : "סל מיחזור"
      ),
      sanitize(i.notes || ""),
      sanitize(new Date(i.created_at).toLocaleString("he-IL")),
    ]);

    // UTF-8 BOM for Excel Hebrew support
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "מזהה פנייה חסר" }, { status: 400 });
    }

    const updated = await updateSubmissionStatus(id, status, notes);
    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
