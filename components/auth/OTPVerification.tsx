"use client"

import { Check, LockOpen, MessageCircle, MessageSquareCheck, Timer } from 'lucide-react';
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

interface OTPVerificationProps {
    timerSeconds: number;
    handleGoToStep: (step: number) => void;
}

const OTPVerification = ({
    timerSeconds
}: OTPVerificationProps) => {

    const t = useTranslations('auth');

    // OTP state
    const [otp, setOtp] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false)

    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:5000/api/auth/guardian/otp`, {
                method: "POST",
                body: JSON.stringify({
                    LoginOTP: otp
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json()

            // console.log(data)

            if (!res.ok) {
                alert(data.message);
                setLoading(false)
                return
            }

            alert(data.message);

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
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

                <div className="grid grid-cols-1 gap-2 sm:gap-3" dir="ltr">
                    <input
                        maxLength={6}
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`w-full h-13 text-center text-xl font-bold font-mono rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0077C6]`}
                    />

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
                <span>{loading ? t('confirmLoginButtonLoading') :  t('confirmLoginButton') }</span>
                <Check className="w-4 h-4 mr-1" />
            </button>

            {/* Resend code */}
            <div className="text-center pt-1">

            </div>

        </form>
    )
}

export default OTPVerification