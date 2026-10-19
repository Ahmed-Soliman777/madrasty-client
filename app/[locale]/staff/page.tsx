import { PageHeader } from "@/components/staff/PageHeader";
import { Sidebar } from "@/components/staff/Sidebar";
import { TeacherQuickBoard } from "@/features/teacher-quick/TeacherQuickBoard";

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <Sidebar />
      <main className="mx-auto min-w-0 w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader />
        <TeacherQuickBoard />
      </main>
    </div>
  );
}
