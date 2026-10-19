import type { ButtonHTMLAttributes } from "react";

export function Chip({
  tone = "pos",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "pos" | "neg" }) {
  const toneClass =
    tone === "pos"
      ? "hover:border-ok hover:bg-ok-bg hover:text-ok"
      : "hover:border-bad hover:bg-bad-bg hover:text-bad";

  return (
    <button
      type={type}
      className={`min-h-8 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink transition-colors focus-visible:outline-offset-1 ${toneClass} ${className}`}
      {...props}
    />
  );
}
