import type { ButtonHTMLAttributes } from "react";
export function Chip({ tone = "pos", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "pos" | "neg" }) {
  const t = tone === "pos" ? "hover:bg-ok-bg hover:text-ok" : "hover:bg-bad-bg hover:text-bad";
  return <button className={`rounded-full border border-line px-3 py-0.5 text-[13px] ${t} ${className}`} {...p} />;
}
