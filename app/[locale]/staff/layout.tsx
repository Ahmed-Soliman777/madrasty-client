import { IBM_Plex_Sans_Arabic } from "next/font/google";

const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex" });

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${plex.variable} staff-theme flex-1 bg-bg text-ink font-[family-name:var(--font-plex),Tahoma,sans-serif]`}>
      {children}
    </div>
  );
}
