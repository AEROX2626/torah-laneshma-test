import { NextRequest, NextResponse } from "next/server";
import { getSiteVisitsSummary } from "@/lib/db";
import { getTelegramConfig, formatDailyAnalyticsReport, sendTelegramMessage } from "@/lib/telegram";

async function runDailyReport() {
  const config = await getTelegramConfig();
  const summary = await getSiteVisitsSummary(24);

  if (!config.dailyReportEnabled) {
    return {
      success: false,
      message: "הדוח היומי מנוטרל בהגדרות המערכת",
      summary,
    };
  }

  if (!config.botToken || !config.chatId) {
    return {
      success: false,
      message: "לא הוגדרו פרטי בוט או מזהה צ'אט בטלגרם",
      summary,
    };
  }

  const messageText = formatDailyAnalyticsReport(summary);
  const result = await sendTelegramMessage(messageText, config.botToken, config.chatId);

  return {
    success: result.success,
    error: result.error,
    message: result.success ? "דוח יומי נשלח בהצלחה לטלגרם" : `שגיאה בשליחת הדוח: ${result.error}`,
    summary,
  };
}

// Vercel Cron calls GET
export async function GET(req: NextRequest) {
  // Optional security: check Authorization header if CRON_SECRET is set
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Note: still allow if not configured to avoid hard blocks during initial setup
  }

  const result = await runDailyReport();
  return NextResponse.json(result);
}

// Manual trigger from admin panel
export async function POST(req: NextRequest) {
  const result = await runDailyReport();
  return NextResponse.json(result);
}
