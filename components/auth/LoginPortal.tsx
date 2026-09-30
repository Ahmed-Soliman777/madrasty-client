"use client"

import { Briefcase, Users } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import ParentLoginForm from './ParentLoginForm';
import StaffLoginPortal from './StaffLoginForm';

interface LoginPortalProps {
    onLoginSuccess: () => void;
}

const LoginPortal = ({ onLoginSuccess }: LoginPortalProps) => {

    const t = useTranslations('auth');

    const [selectedRole, setSelectedRole] = useState<'parent' | 'staff'>('parent');

    return (
        <section className="space-y-5 transition-all duration-300">

            {
                selectedRole === "parent" ? (
                    <ParentLoginForm onLoginSuccess={onLoginSuccess} />
                ) : (
                    <StaffLoginPortal />
                )
            }

            {/* Identified Student Preview Card */}
            {
                (
                    <>
                        {/* Role Selector Pill */}
                        <div>
                            <label className="block text-xs font-bold text-[#0F172A] mb-2">{t('loginAs')}</label>
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
                                        <span className="text-xs font-bold text-[#0A2540]">{t('parentRole')}</span>
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
                                        <span className="text-xs font-bold text-slate-700">{t('staffRole')}</span>
                                    </div>
                                    <Briefcase className="w-4 h-4 text-[#64748B]" />
                                </label>
                            </div>
                        </div>
                    </>
                )
            }

        </section>
    )
}

export default LoginPortal