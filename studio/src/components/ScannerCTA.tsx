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
                "group relative flex items-center justify-between w-full bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 rounded-[1.5rem] shadow-[0_8px_30px_-4px_rgba(16,185,129,0.3)] p-1 overflow-hidden",
                className
            )}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

            <div className="flex items-center gap-4 bg-white/10 dark:bg-black/10 w-full rounded-[1.25rem] p-4 backdrop-blur-sm border border-white/20">
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md" />
                    <div className="relative bg-white text-emerald-600 p-3 rounded-2xl shadow-sm">
                        <Scan size={28} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex-1 text-left">
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight">Crop Problem?</h2>
                    <p className="text-emerald-50 text-sm font-medium mt-0.5 opacity-90">Instant AI Diagnosis</p>
                </div>

                <div className="bg-white/20 p-2 rounded-full text-white group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={20} strokeWidth={3} />
                </div>
            </div>
        </Link>
    );
}
