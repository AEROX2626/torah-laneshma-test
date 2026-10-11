import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/db";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b556ba1-7101-43c0-b8d2-890c4226ec11";

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
      const json = await req.json();
      name = String(json.name || "").trim();
      phone = String(json.phone || "").trim();
      kind = json.kind || "chavruta";
      topicOrMessage = String(json.topic || json.message || "").trim();
    }

    if (!name || !phone) {
      return NextResponse.json({ error: "נא למלא שם ומספר טלפון" }, { status: 400 });
    }

    // 1. Save directly into Database
    const submission = await createSubmission({
      kind,
      name,
      phone,
      topic_or_message: topicOrMessage,
    });

    // 2. Concurrently forward to Web3Forms for immediate email notification
    try {
      const payload = new FormData();
      payload.append("access_key", WEB3FORMS_KEY);
      payload.append("Name", name);
      payload.append("Phone", phone);
      if (topicOrMessage) {
        payload.append(kind === "chavruta" ? "Study_Topic" : "Message", topicOrMessage);
      }
      payload.append(
        "subject",
        kind === "chavruta"
          ? "פנייה חדשה מאתר תורה לנשמה - חברותא"
          : "פנייה חדשה מאתר תורה לנשמה - אמץ אברך"
      );
      payload.append("from_name", "אתר תורה לנשמה");

      // Fire and forget or quick fetch
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      }).catch(console.error);
    } catch (err) {
      console.error("Web3Forms forward error (saved to DB anyway):", err);
    }

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
