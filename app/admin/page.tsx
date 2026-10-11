import { getSubmissions, getFaqs, getAdminUsers } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [submissions, faqs, users] = await Promise.all([
    getSubmissions(),
    getFaqs(),
    getAdminUsers(),
  ]);

  const newSubmissions = submissions.filter((s) => s.status === "new");
  const inProgress = submissions.filter((s) => s.status === "in_progress");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & KPI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-neutral-950">לוח בקרה ראשי</h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium">סקירה כללית של הפניות והתכנים באתר תורה לנשמה</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/submissions"
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            <i className="fas fa-inbox text-xs"></i>
            <span>צפה בכל הפניות</span>
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-user-plus text-xs"></i>
            <span>הזמן עורך</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">פניות חדשות</span>
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold">
              <i className="fas fa-bell"></i>
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-neutral-950 mb-1">{newSubmissions.length}</div>
          <span className="text-[11px] font-bold text-primary-600">ממתינות למענה ראשוני</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">בטיפול שוטף</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-neutral-950 mb-1">{inProgress.length}</div>
          <span className="text-[11px] font-bold text-amber-600">שיחות בתהליך שיבוץ</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">שאלות ותשובות (FAQ)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
              <i className="fas fa-circle-question"></i>
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-neutral-950 mb-1">{faqs.length}</div>
          <span className="text-[11px] font-bold text-emerald-600">פעילות ומוצגות באתר</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500">עורכים ומנהלים</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center text-sm font-bold">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-neutral-950 mb-1">{users.length}</div>
          <span className="text-[11px] font-bold text-neutral-500">מורשים במערכת</span>
        </div>
      </div>

      {/* Recent Submissions Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-lg text-neutral-950">פניות אחרונות מהאתר</h2>
            <p className="text-xs text-neutral-500 font-medium">לידים שהתקבלו מטופס החברותא ומעמוד אמץ אברך</p>
          </div>
          <Link href="/admin/submissions" className="text-xs font-bold text-neutral-600 hover:text-neutral-900">
            לכל הפניות <i className="fas fa-arrow-left text-[10px] mr-1"></i>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-400 font-bold uppercase text-[10px]">
                <th className="px-6 py-3.5">שם הפונה</th>
                <th className="px-6 py-3.5">סוג פנייה</th>
                <th className="px-6 py-3.5">טלפון</th>
                <th className="px-6 py-3.5">נושא / הערה</th>
                <th className="px-6 py-3.5">סטטוס</th>
                <th className="px-6 py-3.5">תאריך</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {submissions.slice(0, 5).map((sub) => (
                <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-neutral-900">{sub.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-neutral-100 text-neutral-700">
                      {sub.kind === "chavruta" ? "חברותא" : "אמץ אברך"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-neutral-600" dir="ltr">
                    {sub.phone}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-neutral-600">{sub.topic_or_message || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        sub.status === "new"
                          ? "bg-primary-50 text-primary-700 border border-primary-200"
                          : sub.status === "in_progress"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : sub.status === "done"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>
                        {sub.status === "new"
                          ? "חדשה"
                          : sub.status === "in_progress"
                          ? "בטיפול"
                          : sub.status === "done"
                          ? "טופלה"
                          : "סל מיחזור"}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(sub.created_at).toLocaleDateString("he-IL", {
                      day: "numeric",
                      month: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
