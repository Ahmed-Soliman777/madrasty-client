import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/staff/PageHeader";
import { Sidebar } from "@/components/staff/Sidebar";
import { SchoolAdminBoard } from "@/features/teacher-quick/SchoolAdminBoard";
import { TeacherQuickBoard } from "@/features/teacher-quick/TeacherQuickBoard";

const BACKEND_URL = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");

async function getStaffRole(): Promise<string | null> {
  try {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return null;
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json() as { user?: { type?: string; role?: string } };
    return payload.user?.type === "staff" ? payload.user.role ?? null : null;
  } catch {
    return null;
  }
}

export default async function StaffPage() {
  const role = await getStaffRole();
  if (role !== "TEACHER" && role !== "SCHOOL_ADMIN") redirect("/");

  const isAdmin = role === "SCHOOL_ADMIN";
  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <Sidebar />
      <main className="mx-auto min-w-0 w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader role={isAdmin ? "admin" : "teacher"} />
        {isAdmin ? <SchoolAdminBoard /> : <TeacherQuickBoard />}
      </main>
    </div>
  );
}
