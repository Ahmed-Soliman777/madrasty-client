"use client"

import { ArrowLeft, Lock, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const StaffLoginForm = () => {

    const t = useTranslations('auth');

    const [loading, setLoading] = useState<boolean>(false)

    const [staffEmail, setStaffEmail] = useState<string | undefined>(undefined)
    const [staffPassword, setStaffPassword] = useState<string | undefined>(undefined)

    // Form Submission handlers
    const handlePortalSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`http://localhost:5000/api/auth/staff/login`, {
                method: "POST",
                body: JSON.stringify({
                    email: staffEmail,
                    password: staffPassword
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json()

            if (!res.ok) {
                setLoading(false)
                alert(data.message)
                return
            }

            alert(data.message)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

    };

    return (
        <form onSubmit={handlePortalSubmit}>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="staffEmailInput" className="block text-xs font-bold text-[#0F172A]">
                    {t('emailLabel')} <span className="text-rose-500">*</span>
                </label>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 inset-e-0 pe-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Mail className="w-5 h-5 text-slate-400" />
                </div>

                <input
                    type="email"
                    id="staffEmailInput"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    required
                    className="w-full pe-11 ps-4 h-12 text-sm font-semibold tracking-wider font-mono text-[#0F172A] bg-slate-50/70 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C6] focus:border-[#0077C6] transition-all"
                />

            </div>

            <div className="flex items-center justify-between mb-2 mt-4">
                <label htmlFor="staffPasswordInput" className="block text-xs font-bold text-[#0F172A]">
                    {t('passwordLabel')} <span className="text-rose-500">*</span>
                </label>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 inset-e-0 pe-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Lock className="w-5 h-5 text-slate-400" />
                </div>

                <input
                    type="password"
                    id="staffPasswordInput"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    required
                    className="w-full pe-11 ps-4 h-12 text-sm font-semibold tracking-wider font-mono text-[#0F172A] bg-slate-50/70 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C6] focus:border-[#0077C6] transition-all"
                />

            </div>

            <button
                type="submit"
                className="w-full h-12 mt-8 px-6 rounded-xl bg-[#0A2540] hover:bg-[#061729] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_10px_25px_-5px_rgba(10,37,64,0.35)] transition-all group"
            >
                <span>{loading ? "loading" : t('loginTitle')}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </button>
        </form>
    )
}

export default StaffLoginForm