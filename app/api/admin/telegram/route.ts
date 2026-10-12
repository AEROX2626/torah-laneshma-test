import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings, getSiteVisitsSummary } from "@/lib/db";
import { sendTelegramMessage, formatDailyAnalyticsReport } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  const summary = await getSiteVisitsSummary(24);

  return NextResponse.json({
    config: {
      bot_token: settings.telegram_bot_token || "",
      chat_id: settings.telegram_chat_id || "",
      daily_report_enabled: settings.telegram_daily_report_enabled !== false,
      instant_leads_enabled: settings.telegram_instant_leads_enabled !== false,
      is_configured: Boolean(settings.telegram_bot_token && settings.telegram_chat_id),
    },
    summary,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "אינך מחובר למערכת" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // 1. SAVE CONFIG
    if (action === "save_config") {
      const { bot_token, chat_id, daily_report_enabled, instant_leads_enabled } = body;
      await updateSiteSettings({
        telegram_bot_token: bot_token !== undefined ? String(bot_token).trim() : "",
        telegram_chat_id: chat_id !== undefined ? String(chat_id).trim() : "",
        telegram_daily_report_enabled: Boolean(daily_report_enabled),
        telegram_instant_leads_enabled: Boolean(instant_leads_enabled),
      });
      return NextResponse.json({ success: true, message: "הגדרות טלגרם נשמרו בהצלחה!" });
    }

    // 2. SEND TEST MESSAGE
    if (action === "test") {
      const token = body.bot_token?.trim();
      const chatId = body.chat_id?.trim();
      const testMsg = `🎉 <b>בדיקת חיבור מוצלחת!</b>\n\nהבוט של אתר <b>תורה לנשמה</b> חובר בהצלחה לטלגרם שלך.\nמעכשיו תקבל כאן דוחות כניסה יומיים והתראות על פניות חדשות! ✨`;

      const result = await sendTelegramMessage(testMsg, token, chatId);
      if (!result.success) {
        return NextResponse.json({ error: result.error || "שגיאה בשליחת הודעת בדיקה" }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "הודעת בדיקה נשלחה בהצלחה לטלגרם שלך!" });
    }

    // 3. SEND DAILY REPORT NOW
    if (action === "send_report") {
      const settings = await getSiteSettings();
      const token = body.bot_token?.trim() || settings.telegram_bot_token;
      const chatId = body.chat_id?.trim() || settings.telegram_chat_id;

      if (!token || !chatId) {
        return NextResponse.json({ error: "יש להגדיר Token ו-Chat ID תחילה" }, { status: 400 });
      }

      const summary = await getSiteVisitsSummary(24);
      const msg = formatDailyAnalyticsReport(summary);
      const result = await sendTelegramMessage(msg, token, chatId);

      if (!result.success) {
        return NextResponse.json({ error: result.error || "שגיאה בשליחת הדוח" }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "דוח יומי נשלח כעת ישירות לטלגרם!" });
    }

    return NextResponse.json({ error: "פעולה לא חוקית" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "שגיאת שרת" }, { status: 500 });
  }
}
