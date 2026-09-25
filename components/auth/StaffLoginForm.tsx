"use client"

import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const StaffLoginForm = () => {

    const t = useTranslations('auth');

    const [staffEmail, setStaffEmail] = useState<string | undefined>(undefined)
    const [staffPassword, setStaffPassword] = useState<string | undefined>(undefined)

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="staffEmailInput" className="block text-xs font-bold text-[#0F172A]">
                    {t('emailLabel')} <span className="text-rose-500">*</span>
                </label>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 end-0 pe-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Mail className="w-5 h-5 text-slate-400" />
                </div>

                <input
                    type="email"
                    id="staffEmailInput"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    required
                    className="w-full pe-11 ps-24 h-12 text-sm font-semibold tracking-wider font-mono text-[#0F172A] bg-slate-50/70 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C6] focus:border-[#0077C6] transition-all"
                />

            </div>

            <div className="flex items-center justify-between mb-2">
                <label htmlFor="staffPasswordInput" className="block text-xs font-bold text-[#0F172A]">
                    {t('passwordLabel')} <span className="text-rose-500">*</span>
                </label>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 end-0 pe-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Lock className="w-5 h-5 text-slate-400" />
                </div>

                <input
                    type="password"
                    id="staffPasswordInput"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    required
                    className="w-full pe-11 ps-24 h-12 text-sm font-semibold tracking-wider font-mono text-[#0F172A] bg-slate-50/70 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C6] focus:border-[#0077C6] transition-all"
                />

            </div>

        </div>
    )
}

export default StaffLoginForm