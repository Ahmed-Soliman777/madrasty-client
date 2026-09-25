"use client"

import { Check, LockOpen, MessageCircle, MessageSquareCheck, Timer } from 'lucide-react';
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

interface OTPVerificationProps {
    otpInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    timerSeconds: number;
    handleGoToStep: (step: number) => void;
}

const OTPVerification = ({
    otpInputRefs,
    timerSeconds
}: OTPVerificationProps) => {

    const t = useTranslations('auth');

    // OTP state (6 digit array)
    const [otpValues, setOtpValues] = useState<string[]>(['4', '8', '2', '9', '', '']);

    // Handle OTP digit changes and auto-advance
    const handleOtpChange = (index: number, value: string) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otpValues];
            newOtp[index] = value;
            setOtpValues(newOtp);

            if (value && index < 5) {
                otpInputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otpValues[index] && index > 0) {
                otpInputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otpValues];
                newOtp[index] = '';
                setOtpValues(newOtp);
            }
        }
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(t('verificationSuccess'));
    };

    return (
        <form onSubmit={handleStep2Submit} className="space-y-6 transition-all duration-300">

            {/* WhatsApp Notice Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3 text-start">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <MessageSquareCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-emerald-900 leading-tight">
                        {t('otpSentTitle')}
                    </p>
                    <p className="text-emerald-700 mt-1 leading-relaxed">
                        {t('otpSentDescription')} <span className="font-bold">WhatsApp</span> {t('and')} <span className="font-bold">SMS</span> {t('toRegisteredNumber')} (<span className="font-mono font-bold" dir="ltr">+20 10 •••• 4592</span>).
                    </p>
                </div>
            </div>

            {/* 6-digit OTP Inputs */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[#0F172A]">
                        {t('otpLabel')} <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-[#64748B]">{t('otpExpires')}</span>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3" dir="ltr">
                    {otpValues.map((val, idx) => (
                        <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={val}
                            ref={(el) => { otpInputRefs.current[idx] = el; }}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className={`w-full h-13 text-center text-xl font-bold font-mono rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0077C6] ${val ? 'text-[#0A2540] bg-slate-50 border border-[#E2E8F0]' : 'text-[#0A2540] bg-white border-2 border-[#0077C6] animate-pulse'
                                }`}
                        />
                    ))}
                </div>

                {/* Resend Timer */}
                <div className="flex items-center justify-between text-xs mt-3 text-[#64748B] font-semibold">
                    <div className="flex items-center gap-1.5 ">
                        <Timer className="w-3.5 h-3.5 text-[#F5A623]" />
                        <span>{t('resendCountdown')}</span>
                        <span id="resendTimer" className="font-mono font-bold text-[#0A2540] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                        </span>
                    </div>

                    <button type="button" onClick={() => alert(t('voiceCallRequested'))} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{t('didNotReceive')}</span>
                    </button>
                </div>
            </div>

            {/* Confirm Login Button */}
            <button
                type="submit"
                className="w-full h-12 px-6 rounded-xl bg-[#F5A623] hover:bg-[#E09415] active:scale-[0.99] text-[#0A2540] text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_10px_25px_-5px_rgba(245,166,35,0.4)] transition-all group"
            >
                <LockOpen className="w-4 h-4 text-[#0A2540]" />
                <span>{t('confirmLogin')}</span>
                <Check className="w-4 h-4 ms-1" />
            </button>

            {/* Resend code */}
            <div className="text-center pt-1">

            </div>

        </form>
    )
}

export default OTPVerification