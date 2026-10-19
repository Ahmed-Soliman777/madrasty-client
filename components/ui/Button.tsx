import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "border border-brand bg-brand font-semibold text-white hover:border-navy hover:bg-navy",
  ghost: "border border-line bg-surface font-medium text-ink hover:bg-soft",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg px-3.5 py-2 text-sm transition-colors focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
