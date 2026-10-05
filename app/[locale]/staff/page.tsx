import { PageHeader } from "@/components/staff/PageHeader";
import { Sidebar } from "@/components/staff/Sidebar";
import { TeacherQuickBoard } from "@/features/teacher-quick/TeacherQuickBoard";

const page = () => (
  <div className="grid min-h-screen lg:grid-cols-[230px_1fr]">
    <Sidebar />
    <main className="mx-auto w-full max-w-6xl p-4 pb-10 lg:p-6">
      <PageHeader />
      <TeacherQuickBoard />
    </main>
  </div>
);

export default page;
