import AuthenticationComponent from '@/components/auth/AuthenticationComponent';
import {
  CheckCircle,
  Landmark,
  Award,
  Sparkles,
  Star,
  BellRing,
} from 'lucide-react';

export default function Home() {

  const academicYear = new Date().getFullYear()

  return (
    <section className="h-full min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#F5A623] selection:text-[#0A2540] font-sans" dir="rtl">
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ========================================== */}
        {/* RIGHT COLUMN: AUTHENTICATION FORM (RTL Start) */}
        {/* ========================================== */}
        <AuthenticationComponent />


        {/* ========================================== */}
        {/* LEFT COLUMN: BRANDING & ILLUSTRATION (Desktop) */}
        {/* ========================================== */}
        <div className="hidden lg:flex justify-between lg:w-[46%] xl:w-[50%] bg-linear-to-br from-[#0A2540] via-[#081f36] to-[#051524] text-white relative overflow-hidden flex-col p-12">

          {/* Background Patterns */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
                  <circle cx="24" cy="24" r="1" fill="#F5A623" />
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0077C6" strokeWidth="0.5" strokeDasharray="2 4" />
                </pattern>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0077C6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F5A623" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              <circle cx="85%" cy="15%" r="180" fill="none" stroke="url(#waveGrad)" strokeWidth="1.5" />
              <circle cx="85%" cy="15%" r="240" fill="none" stroke="url(#waveGrad)" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="15%" cy="85%" r="220" fill="none" stroke="url(#waveGrad)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#0077C6]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-[#F5A623]/10 blur-3xl pointer-events-none"></div>

          {/* Top Section */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shadow-lg">
                <Landmark className="w-6 h-6 text-[#F5A623]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">مدارس النيل المصرية الدولية</h3>
                <p className="text-xs text-sky-200/80 font-medium">Nile Egyptian International Schools (NEIS)</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>شهادة النيل الدولية المعترف بها</span>
            </div>
          </div>

          {/* Middle Section */}
          <div className="relative z-10">

            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              مرحباً بكم في منصة <span className="text-transparent bg-clip-text bg-linear-to-l from-amber-300 via-amber-200 to-white">مَـدْرَسَـتِـي</span>
            </h2>

            <p className="text-sm xl:text-base text-slate-300/90 leading-relaxed mb-8">
              البوابة الرسمية الموحدة لأولياء الأمور والمعلمين والطلاب. تابع الحضور والغياب، التميز السلوكي، الواجبات اليومية، والتواصل الأكاديمي المباشر لحظة بلحظة.
            </p>

            {/* Floating Visual Presentation Box */}
            <div className="relative mx-auto lg:mx-0">
              <div className="relative rounded-2xl bg-linear-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-md p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0077C6]/30 border border-[#0077C6] flex items-center justify-center text-white">
                      <Sparkles className="w-5 h-5 text-[#F5A623]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">مؤشرات الأداء التفاعلي لليوم</h4>
                      <p className="text-[10px] text-sky-200">تحديث فوري من القاعات الدراسية</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">98.5% حضور</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="block text-[10px] text-slate-300">نقاط التميز</span>
                    <span className="text-base font-extrabold text-amber-300 font-mono">+15</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="block text-[10px] text-slate-300">الواجبات</span>
                    <span className="text-base font-extrabold text-white font-mono">2 / 3</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="block text-[10px] text-slate-300">الحافلة</span>
                    <span className="text-base font-extrabold text-sky-300 font-mono">7:45 ص</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">البيانات محمية بأعلى معايير الأمن السيبراني لوزارة التربية والتعليم</span>
                </div>
              </div>

              {/* Floating Star Badge */}
              <div className="absolute -top-3 -right-3 bg-linear-to-r from-[#F5A623] to-amber-500 text-[#0A2540] px-3 py-1.5 rounded-xl shadow-lg font-bold text-xs flex items-center gap-1.5 ring-2 ring-[#0A2540]">
                <Star className="w-3.5 h-3.5 fill-[#0A2540]" />
                <span>Nile Star {academicYear + 1}</span>
              </div>

              {/* Floating WhatsApp Sync Badge */}
              <div className="absolute -bottom-3 -left-3 bg-[#0c2f52] border border-[#0077C6]/40 text-sky-200 px-3 py-1.5 rounded-xl shadow-xl font-bold text-xs flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>إشعارات فورية عبر WhatsApp</span>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>وحدة شهادة النيل الدولية © {academicYear}</span>
          </div>

        </div>

      </div>
    </section>
  );
}