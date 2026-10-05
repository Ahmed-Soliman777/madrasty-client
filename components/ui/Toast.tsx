"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
const Ctx = createContext<(m: string) => void>(() => {});
export const useToast = () => useContext(Ctx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState(""); const t = useRef<ReturnType<typeof setTimeout>>();
  const show = useCallback((m: string) => { setMsg(m); clearTimeout(t.current); t.current = setTimeout(() => setMsg(""), 1800); }, []);
  return (<Ctx.Provider value={show}>{children}
    <div role="status" aria-live="polite" className={`pointer-events-none fixed inset-x-0 bottom-5 mx-auto w-max max-w-[90%] rounded-xl bg-ink px-5 py-2.5 text-bg transition-opacity ${msg ? "opacity-100" : "opacity-0"}`}>{msg}</div>
  </Ctx.Provider>);
}
