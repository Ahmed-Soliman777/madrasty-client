"use client"

import { ArrowLeft, Briefcase   , CheckCircle, IdCard, Info, Users } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

interface NationalIDEntryProps {
    handleGoToStep: (step: number) => void;
}

const NationalIDEntry = ({
    handleGoToStep
}: NationalIDEntryProps) => {

    const idNational: string = "30205059253694" 

    const [nationalId, setNationalId] = useState<string>('');

    const [selectedRole, setSelectedRole] = useState<'parent' | 'staff'>('parent');

    // Form Submission handlers
    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGoToStep(2);
    };

    return (
        <form onSubmit={handleStep1Submit} className="space-y-5 transition-all duration-300">
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

            {/* Identified Student Preview Card */}
            {
                nationalId === idNational ? (
                    <div className="p-3.5 rounded-xl bg-linear-to-r from-[#E6F2FF]/60 to-slate-50 border border-blue-100/80 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full ring-2 ring-[#0077C6]/30 overflow-hidden bg-white shrink-0 shadow-sm">
                            <Image
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                                alt="صورة الطالب"
                                className="w-full h-full object-cover"
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[#0A2540] truncate">أحمد سليمان خليل</h4>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">نشط</span>
                            </div>
                            <p className="text-[11px] text-[#64748B] truncate mt-0.5">الصف الرابع الابتدائي - فرع الشيخ زايد (G4-A)</p>
                        </div>
                        <div className="text-left shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono">NEIS-88210</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Role Selector Pill */}
                        <div>
                            <label className="block text-xs font-bold text-[#0F172A] mb-2">الدخول بصفتك:</label>
                            <div className="grid grid-cols-2 gap-2.5">
                                <label
                                    onClick={() => setSelectedRole('parent')}
                                    className={`relative flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === 'parent' ? 'border-[#0077C6] bg-[#E6F2FF]/30' : 'border-[#E2E8F0] bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="login_role"
                                            checked={selectedRole === 'parent'}
                                            onChange={() => setSelectedRole('parent')}
                                            className="w-4 h-4 text-[#0077C6] focus:ring-[#0077C6] border-slate-300"
                                        />
                                        <span className="text-xs font-bold text-[#0A2540]">ولي الأمر</span>
                                    </div>
                                    <Users className="w-4 h-4 text-[#0077C6]" />
                                </label>

                                <label
                                    onClick={() => setSelectedRole('staff')}
                                    className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'staff' ? 'border-[#0077C6] bg-[#E6F2FF]/30' : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="login_role"
                                            checked={selectedRole === 'staff'}
                                            onChange={() => setSelectedRole('staff')}
                                            className="w-4 h-4 text-[#0077C6] focus:ring-[#0077C6] border-slate-300"
                                        />
                                        <span className="text-xs font-bold text-slate-700">المعلم / الكادر</span>
                                    </div>
                                    <Briefcase className="w-4 h-4 text-[#64748B]" />
                                </label>
                            </div>
                        </div>
                    </>
                )
            }


            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#64748B] hover:text-[#0F172A]">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#0A2540] focus:ring-[#0A2540]" />
                    <span>تذكر بيانات هذا الجهاز</span>
                </label>
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="font-bold text-[#0077C6] hover:underline">
                    شروط الخصوصية
                </a>
            </div>

            {/* Primary Action Button */}
            <button
                type="submit"
                className="w-full h-12 px-6 rounded-xl bg-[#0A2540] hover:bg-[#061729] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_10px_25px_-5px_rgba(10,37,64,0.35)] transition-all group"
            >
                <span>إرسال رمز التحقق (OTP)</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
        </form>
    )
}

export default NationalIDEntry