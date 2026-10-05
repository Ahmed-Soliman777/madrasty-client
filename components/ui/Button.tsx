import type { ButtonHTMLAttributes } from "react";
const v = { primary: "bg-brand text-white font-semibold hover:opacity-90", ghost: "border border-line hover:bg-soft" };
export function Button({ variant = "primary", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof v }) {
  return <button className={`rounded-xl px-4 py-2 transition ${v[variant]} ${className}`} {...p} />;
}
