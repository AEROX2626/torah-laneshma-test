import { getSiteSettings, SiteVisitsSummary } from "./db";

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  dailyReportEnabled: boolean;
  instantLeadsEnabled: boolean;
}

export async function getTelegramConfig(): Promise<TelegramConfig> {
  const settings = await getSiteSettings();
  return {
    botToken: settings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || "",
    chatId: settings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || "",
    dailyReportEnabled: settings.telegram_daily_report_enabled !== false,
    instantLeadsEnabled: settings.telegram_instant_leads_enabled !== false,
  };
}

export async function sendTelegramMessage(
  text: string,
  botTokenOverride?: string,
  chatIdOverride?: string
): Promise<{ success: boolean; error?: string }> {
  let token = botTokenOverride;
  let chat = chatIdOverride;

  if (!token || !chat) {
    const config = await getTelegramConfig();
    token = token || config.botToken;
    chat = chat || config.chatId;
  }

  if (!token || !chat) {
    return { success: false, error: "חסר Token של בוט הטלגרם או מזהה צ'אט (Chat ID)" };
  }

  try {
    const url = `https://api.telegram.org/bot${token.trim()}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat.trim(),
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { success: false, error: data.description || "שגיאה מהשרת של טלגרם" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "שגיאת תקשורת עם טלגרם" };
  }
}

export function formatDailyAnalyticsReport(summary: SiteVisitsSummary): string {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jerusalem",
  });

  const totalDev = (summary.devices.mobile || 0) + (summary.devices.desktop || 0) + (summary.devices.tablet || 0);
  const mobilePct = totalDev > 0 ? Math.round(((summary.devices.mobile || 0) / totalDev) * 100) : 0;
  const desktopPct = totalDev > 0 ? 100 - mobilePct : 0;

  // Pages list
  let pagesText = "<i>אין נתוני צפייה בעמודים עדיין</i>";
  if (summary.top_pages.length > 0) {
    pagesText = summary.top_pages
      .slice(0, 5)
      .map((p, idx) => {
        const pageName = p.path === "/" ? "דף הבית" : p.path;
        return `${idx + 1}. <b>${pageName}</b> — ${p.count} צפיות`;
      })
      .join("\n");
  }

  // Sources list
  let sourcesText = "<i>ישיר / לא ידוע</i>";
  if (summary.top_sources.length > 0) {
    sourcesText = summary.top_sources
      .slice(0, 5)
      .map((s) => `• <b>${s.source}</b>: ${s.count} כניסות`)
      .join("\n");
  }

  // Leads section
  let leadsText = "אין פניות חדשות ב-24 השעות האחרונות.";
  if (summary.new_leads_count > 0) {
    leadsText = `🔥 <b>${summary.new_leads_count} פניות חדשות התקבלו!</b>\n` +
      summary.new_leads
        .slice(0, 5)
        .map((l, i) => {
          const kindName = l.kind === "chavruta" ? "חברותא" : "אמץ אברך";
          return `${i + 1}. <b>${l.name}</b> (${l.phone}) · <i>${kindName}</i>`;
        })
        .join("\n");
  }

  return `📊 <b>תורה לנשמה · דוח כניסות יומי</b>
📅 ${dateFormatted}

👥 <b>תנועת גולשים (24 שעות):</b>
• <b>סה״כ כניסות:</b> ${summary.total_visits}
• <b>מבקרים ייחודיים:</b> ${summary.unique_visitors}
• <b>מכשירים:</b> 📱 ${mobilePct}% נייד | 💻 ${desktopPct}% מחשב

📄 <b>עמודים מובילים:</b>
${pagesText}

🔗 <b>ערוצי הגעה מובילים:</b>
${sourcesText}

📥 <b>לידים ופניות:</b>
${leadsText}

━━━━━━━━━━━━━━━━━━━━
👉 <a href="https://torah-laneshma-test.vercel.app/admin">כניסה למערכת הניהול</a>`;
}

export function formatNewLeadMessage(lead: {
  name: string;
  phone: string;
  kind: string;
  topic_or_message?: string;
}): string {
  const kindTitle = lead.kind === "chavruta" ? "חברותא טלפונית" : "אמץ אברך";
  const now = new Date().toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit" });

  return `🔔 <b>ליד חדש באתר תורה לנשמה!</b> (${now})

👤 <b>שם:</b> ${lead.name}
📞 <b>טלפון:</b> <code>${lead.phone}</code>
🎯 <b>סוג פנייה:</b> ${kindTitle}
${lead.topic_or_message ? `💬 <b>הערה / נושא:</b> ${lead.topic_or_message}\n` : ""}
━━━━━━━━━━━━━━━━━━━━
👉 <a href="https://torah-laneshma-test.vercel.app/admin/submissions">פתח בלוח הפניות</a>`;
}

export async function sendNewLeadTelegramNotification(lead: {
  name: string;
  phone: string;
  kind: string;
  topic_or_message?: string;
}): Promise<void> {
  const config = await getTelegramConfig();
  if (!config.instantLeadsEnabled || !config.botToken || !config.chatId) {
    return;
  }

  const message = formatNewLeadMessage(lead);
  await sendTelegramMessage(message, config.botToken, config.chatId);
}
