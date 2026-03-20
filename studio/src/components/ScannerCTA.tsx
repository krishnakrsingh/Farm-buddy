import { Scan, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ScannerCTAProps {
    className?: string;
    href?: string;
}

export function ScannerCTA({ className, href = "/scan" }: ScannerCTAProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative flex items-center justify-between w-full bg-[#184F35] hover:bg-[#123926] transition-all duration-300 rounded-[32px] p-2 shadow-[0_12px_32px_rgba(24,79,53,0.15)]",
                className
            )}
        >
            <div className="flex items-center gap-4 bg-white/10 w-full rounded-[24px] px-5 py-[18px] border border-white/10">
                <div className="relative flex-shrink-0 bg-white/20 p-[14px] rounded-[18px] text-white">
                    <Scan size={24} strokeWidth={2.5} />
                </div>

                <div className="flex-1 text-left">
                    <h2 className="text-[17px] font-extrabold text-white tracking-wide leading-none">Instant Scanner</h2>
                    <p className="text-[#A4E0B6] text-[12px] font-bold mt-1.5 opacity-90 tracking-wide">AI Crop Disease Check</p>
                </div>

                <div className="bg-white/20 p-3 rounded-full text-white group-hover:translate-x-1 group-hover:bg-white/30 transition-all">
                    <ChevronRight size={20} strokeWidth={3} />
                </div>
            </div>
        </Link>
    );
}
