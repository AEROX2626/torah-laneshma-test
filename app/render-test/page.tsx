import { getSiteDoc } from "@/lib/db";
import SiteDocRenderer from "@/app/components/SiteDocRenderer";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default async function RenderTestPage() {
  const doc = await getSiteDoc("page_home");

  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900 flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="bg-primary-50 border-b border-primary-200/60 py-3 text-center text-xs font-bold text-primary-800">
          <i className="fas fa-cubes ml-2"></i>
          בדיקת מנוע עץ האלמנטים (SiteDoc Tree Engine Verification) · נטען מתוך עץ האלמנטים
        </div>

        {doc ? (
          <SiteDocRenderer doc={doc} />
        ) : (
          <div className="p-12 text-center text-neutral-500 font-bold">לא נמצא מסמך עץ</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
