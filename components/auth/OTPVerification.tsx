"use client"

import { Check, LockOpen, MessageSquareCheck, RotateCcw, Timer } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

const OTPVerification = ({
    nationalId,
    phone,
    maskedPhone,
    timerSeconds,
    onOtpResent,
}: OTPVerificationProps) => {

    const t = useTranslations('auth');
    const router = useRouter();

    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState<boolean>(false)
    const [resending, setResending] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    const verifyCode = async (code: string) => {
        if (loading || code.length !== 6) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/auth/guardian/verify-otp`, {
                method: "POST",
                body: JSON.stringify({
                    phone,
                    LoginOTP: code,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json() as VerifyOtpResponse;

            if (!res.ok) {
                setError(t('verifyOtpError'))
                return
            }

            if (!data.accessToken) {
                setError(t('verifyOtpError'))
                return
            }
            localStorage.setItem('accessToken', data.accessToken)
            router.replace('/home')
        } catch {
            setError(t('networkError'))
        } finally {
            setLoading(false)
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        void verifyCode(otp.join(''));
    };

    const updateOtp = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const nextOtp = [...otp];
        nextOtp[index] = digit;
        setOtp(nextOtp);
        setError('');

        if (digit && index < nextOtp.length - 1) inputRefs.current[index + 1]?.focus();
        if (nextOtp.every(Boolean)) void verifyCode(nextOtp.join(''));
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!digits) return;

        const nextOtp = Array.from({ length: 6 }, (_, index) => digits[index] ?? '');
        setOtp(nextOtp);
        setError('');
        inputRefs.current[Math.min(digits.length, 5)]?.focus();
        if (digits.length === 6) void verifyCode(digits);
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            const nextOtp = [...otp];
            nextOtp[index - 1] = '';
            setOtp(nextOtp);
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const resendOtp = async () => {
        setResending(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/auth/guardian/request-otp`, {
                method: 'POST',
                body: JSON.stringify({ NationalId: nationalId }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json() as RequestOtpResponse;
            if (!res.ok) {
                setError(t('requestOtpError'));
                return;
            }

            setOtp(Array(6).fill(''));
            onOtpResent({ phone: data.phone, maskedPhone: data.maskedPhone });
            inputRefs.current[0]?.focus();
        } catch {
            setError(t('networkError'));
        } finally {
            setResending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 transition-all duration-300">

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
                        {t('otpSentDescription')} <span className="font-bold">WhatsApp</span> {t('toRegisteredNumber')} (<span className="font-mono font-bold" dir="ltr">{maskedPhone}</span>).
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
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(element) => { inputRefs.current[index] = element; }}
                            autoFocus={index === 0}
                            type="text"
                            inputMode="numeric"
                            autoComplete={index === 0 ? 'one-time-code' : 'off'}
                            aria-label={`${t('otpDigit')} ${index + 1}`}
                            maxLength={1}
                            value={digit}
                            onChange={(event) => updateOtp(index, event.target.value)}
                            onPaste={handlePaste}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            className="h-12 min-w-0 w-full text-center text-xl font-bold font-mono rounded-lg border border-slate-300 bg-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0077C6]"
                        />
                    ))}
                </div>
                {error && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{error}</p>}

                {/* Resend Timer */}
                <div className="flex items-center justify-between text-xs mt-3 text-[#64748B] font-semibold">
                    <div className="flex items-center gap-1.5 ">
                        <Timer className="w-3.5 h-3.5 text-[#F5A623]" />
                        <span>{t('resendCountdown')}</span>
                        <span id="resendTimer" className="font-mono font-bold text-[#0A2540] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                        </span>
                    </div>

                    <button type="button" onClick={() => void resendOtp()} disabled={timerSeconds > 0 || resending} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-slate-400">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{resending ? t('confirmLoginButtonLoading') : t('resendOtp')}</span>
                    </button>
                </div>
            </div>

            {/* Confirm Login Button */}
            <button
                type="submit"
                disabled={loading || otp.some((digit) => !digit)}
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