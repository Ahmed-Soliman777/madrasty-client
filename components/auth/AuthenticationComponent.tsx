"use client"

import { useEffect, useRef, useState } from 'react'
import OTPVerification from './OTPVerification'
import LoginPortal from './LoginPortal'
import { GlobeIcon, GraduationCap } from 'lucide-react'

const AuthenticationComponent = () => {

    // const academicYear = new Date().getFullYear()

    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer state for resend OTP
    const [timerSeconds, setTimerSeconds] = useState<number>(45);

    // Handle countdown timer when step 2 is active
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (currentStep === 2 && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds((prev) => {
                    if (prev <= 1) {
                        if (interval) clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [currentStep, timerSeconds]);

    // Handle step transition
    const handleGoToStep = (step: 1 | 2) => {
        setCurrentStep(step);
        if (step === 2) {
            setTimerSeconds(45);
            // Focus on the first unfilled OTP box after render
            setTimeout(() => {
                if (otpInputRefs.current[4]) {
                    otpInputRefs.current[4]?.focus();
                }
            }, 100);
        }
    };

    return (
        <div className="w-full lg:w-[54%] xl:w-[50%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white min-h-screen z-10 shadow-lg lg:shadow-none">

            {/* Top Bar: Mobile Logo & Language Toggle */}
            <div className="flex items-center justify-between mb-8 lg:mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#0A2540] to-[#0077C6] flex items-center justify-center text-white shadow-sm ring-2 ring-[#E6F2FF]">
                            <GraduationCap className="w-5 h-5 text-[#F5A623]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-black text-[#0A2540] tracking-tight">مَـدْرَسَـتِـي</span>
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E6F2FF] text-[#0077C6] rounded-md border border-blue-200">NEIS</span>
                            </div>
                            <p className="text-[11px] text-[#64748B] leading-none mt-0.5">مدارس النيل المصرية الدولية</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>العام {academicYear} / {academicYear + 1}</span>
                    </div> */}

                    <button
                        type="button"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#0077C6]/40 bg-white text-xs font-bold text-[#0F172A] hover:text-[#0077C6] transition-all shadow-sm"
                    >
                        <GlobeIcon className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>English</span>
                    </button>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="w-full mx-auto my-auto py-2">

                {/* Badge & Step Header */}
                <div className="text-right mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
                        تسجيل الدخول
                    </h1>
                    <p className="text-sm text-[#64748B] mt-2">
                        {currentStep === 1
                            ? 'أدخل الرقم القومي للطالب للمتابعة والوصول الفوري لتقارير الأداء والحضور'
                            : 'أدخل رمز التحقق المكون من 6 أرقام لتأكيد الهوية والدخول'}
                    </p>
                </div>

                {/* Multi-Step Switcher Indicator */}
                <div className="flex items-center gap-2 p-1.5 mb-7 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => handleGoToStep(1)}
                        className={`cursor-pointer flex-1 py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 font-bold ${currentStep === 1
                            ? 'bg-white text-[#0A2540] shadow-sm'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                            }`}
                    >
                        <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-mono ${currentStep === 1 ? 'bg-[#0A2540] text-white' : 'bg-slate-300 text-slate-600'
                            }`}>1</span>
                        <span>الرقم القومي</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleGoToStep(2)}
                        className={`cursor-pointer flex-1 py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 font-bold ${currentStep === 2
                            ? 'bg-white text-[#0A2540] shadow-sm'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                            }`}
                    >
                        <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-mono ${currentStep === 2 ? 'bg-[#F5A623] text-[#0A2540] font-bold' : 'bg-slate-300 text-slate-600'
                            }`}>2</span>
                        <span>رمز التحقق OTP</span>
                    </button>
                </div>

                {/* ============================================== */}
                {/* STEP 1: NATIONAL ID ENTRY */}
                {/* ============================================== */}
                {currentStep === 1 && (
                    <LoginPortal
                        handleGoToStep={() => handleGoToStep(1)}
                    />
                )}

                {/* ============================================== */}
                {/* STEP 2: OTP VERIFICATION */}
                {/* ============================================== */}
                {currentStep === 2 && (
                    <OTPVerification
                        otpInputRefs={otpInputRefs}
                        timerSeconds={timerSeconds}
                        handleGoToStep={() => handleGoToStep(2)}
                    />
                )}

            </div>

            {/* Footer & Support Notice */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
                <div className="text-[11px] text-slate-400 font-mono">
                    بوابة النيل v3.4 • NEIS Secure Portal
                </div>
            </div>

        </div>
    )
}

export default AuthenticationComponent