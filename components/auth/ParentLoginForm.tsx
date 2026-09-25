import { CheckCircle, IdCard, Info } from 'lucide-react'

interface ParetnLoginPortalProps {
    nationalId: string,
    setNationalId: (e: React.HTMLInputTypeAttribute) => void
}

const ParentLoginForm = ({
    nationalId,
    setNationalId
}: ParetnLoginPortalProps) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="nationalIdInput" className="block text-xs font-bold text-[#0F172A]">
                    الرقم القومي للطالب <span className="text-rose-500">*</span>
                </label>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <IdCard className="w-5 h-5 text-slate-400" />
                </div>

                <input
                    type="text"
                    id="nationalIdInput"
                    maxLength={14}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="أدخل 14 رقماً (شهادة الميلاد / البطاقة)"
                    required
                    className="w-full pr-11 pl-24 h-12 text-sm font-semibold tracking-wider font-mono text-[#0F172A] bg-slate-50/70 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C6] focus:border-[#0077C6] transition-all"
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>مطابق</span>
                    </span>
                </div>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-[#0077C6]" />
                <span>مكون من 14 رقماً مدوناً في أعلى شهادة الميلاد المميكنة</span>
            </p>
        </div>
    )
}

export default ParentLoginForm