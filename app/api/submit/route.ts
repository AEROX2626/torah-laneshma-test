import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/db";
import { sendNewLeadTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    let name = "";
    let phone = "";
    let kind: "chavruta" | "adopt" = "chavruta";
    let topicOrMessage = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = String(formData.get("name") || formData.get("Name") || "").trim();
      phone = String(formData.get("phone") || formData.get("Phone") || "").trim();
      kind = (formData.get("kind") as any) || "chavruta";
      topicOrMessage = String(
        formData.get("Study_Topic") ||
          formData.get("topic") ||
          formData.get("customTopic") ||
          formData.get("message") ||
          formData.get("Message") ||
          ""
      ).trim();
    } else {
      const json = await req.json().catch(() => ({}));
      name = String(json.name || json.Name || "").trim();
      phone = String(json.phone || json.Phone || "").trim();
      kind = json.kind || "chavruta";
      topicOrMessage = String(
        json.topic || json.Study_Topic || json.customTopic || json.message || json.Message || ""
      ).trim();
    }

    if (!name || !phone) {
      return NextResponse.json({ error: "נא למלא שם ומספר טלפון" }, { status: 400 });
    }

    // 1. Save directly into Supabase leads table (+ local fallback)
    const submission = await createSubmission({
      kind,
      name,
      phone,
      topic_or_message: topicOrMessage,
    });

    // 2. Concurrently send instant Telegram notification if configured (non-blocking)
    sendNewLeadTelegramNotification({
      name,
      phone,
      kind,
      topic_or_message: topicOrMessage,
    }).catch((err) => console.error("Telegram lead notification error:", err));

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err: any) {
    console.error("Submission API error:", err);
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
