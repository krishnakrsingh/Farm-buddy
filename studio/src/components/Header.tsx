"use client";

import { Wifi } from "lucide-react";

interface HeaderProps {
    userName?: string;
    isTankRisk?: boolean;
}

export function Header({ userName = "Krishna" }: HeaderProps) {
    return (
        <header className="flex justify-between items-center bg-transparent">
            <div className="flex items-center gap-3">
                <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden shadow-md border-2 border-white">
                    <img
                        src="/farmer_profile.png"
                        className="w-full h-full object-cover"
                        alt={`Farm Manager ${userName}`}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1.5">
                        <h1 className="text-xl font-black text-[#113A28] leading-none">
                            Hey {userName}
                        </h1>
                        <span className="text-lg">👋</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-white/90 text-[#184F35] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs border border-[#113A28]/10 tracking-wider uppercase">
                            Head Farm Manager
                        </span>
                    </div>
                </div>
            </div>

            {/* Cloud Sync Status Badge */}
            <div className="bg-[#184F35] text-white backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-[#184F35] flex items-center gap-2">
                <Wifi size={12} className="text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-extrabold tracking-wide">
                    Edge Sync • 12ms
                </span>
            </div>
        </header>
    );
}
