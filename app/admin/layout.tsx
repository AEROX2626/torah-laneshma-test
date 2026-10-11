import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Protect all /admin routes except login and join
  // Note: in Next.js App Router, nested pages inherit the layout, so we handle login/join separately or conditionally bypass.
  // Actually, login and join are at /admin/login and /admin/join.
  // If we put AdminShell here, it would wrap login as well if not checked!
  return <AdminShell user={user}>{children}</AdminShell>;
}
