import { ArrowLeft, IdCard, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react';

interface ParentLoginFormProps {
    onLoginSuccess: () => void;
}

const ParentLoginForm = ({ onLoginSuccess }: ParentLoginFormProps) => {
    const t = useTranslations('auth');

    const [loading, setLoading] = useState<boolean>(false)

    const [nationalId, setNationalId] = useState<string>('');

    const handlePortalSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`http://localhost:5000/api/auth/guardian/login`, {
                method: "POST",
                body: JSON.stringify({
                    NationalId: nationalId
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
            onLoginSuccess();
            // handleGoToStep(2);
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
                <label htmlFor="nationalIdInput" className="block text-xs font-bold text-[#0F172A]">
                    {t('nationalIdLabel')} <span className="text-rose-500">*</span>
                </label>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 inset-e-0 pe-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <IdCard className="w-5 h-5 text-slate-400" />
                </div>

                <input
                    type="text"
                    id="nationalIdInput"
                    maxLength={14}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder={t('nationalIdPlaceholder')}
                    required
                    className="w-full pe-11 ps-4 h-12 text-sm font-semibold tracking-wider font-mono text-[#0F172A] bg-slate-50/70 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C6] focus:border-[#0077C6] transition-all"
                />
            </div>
            <p className="text-[11px] text-[#64748B] mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-[#0077C6]" />
                <span>{t('nationalIdHelp')}</span>
            </p>

            <button
                type="submit"
                className="w-full mt-8 h-12 px-6 rounded-xl bg-[#0A2540] hover:bg-[#061729] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_10px_25px_-5px_rgba(10,37,64,0.35)] transition-all group"
            >
                <span>{loading ? "loading" : t('sendOtp')}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </button>
        </form>
    )
}

export default ParentLoginForm