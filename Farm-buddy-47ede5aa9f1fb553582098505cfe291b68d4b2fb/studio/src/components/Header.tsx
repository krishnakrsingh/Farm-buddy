"use client";

import { useState } from "react";
import { Radio, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

interface HeaderProps {
    userName?: string;
}

export function Header({ userName = "Krishna" }: HeaderProps) {
    const [isGatewayMenuOpen, setIsGatewayMenuOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <header className="flex justify-between items-center bg-transparent">
            <div className="flex items-center gap-3">
                <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden shadow-sm border-2 border-white">
                    <img
                        src="https://i.pravatar.cc/150?img=33"
                        className="w-full h-full object-cover"
                        alt="User Avatar"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-extrabold text-[#113A28] leading-none flex items-center gap-1">
                        {t("hey")} {userName}<span className="text-xl">👋</span>
                    </h1>
                    <div className="bg-white/90 text-[#184F35] text-[11px] font-black px-3 py-1 rounded-full shadow-xs w-max mt-1.5 border border-[#113A28]/10 tracking-wide uppercase">
                        Herd Manager
                    </div>
                </div>
            </div>

            {/* Sync / Connectivity Status Icon */}
            <div className="relative">
                <button
                    onClick={() => setIsGatewayMenuOpen((prev) => !prev)}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative transition-transform hover:scale-105 active:scale-95 border border-[#E9F4EC]"
                    aria-label="Toggle gateway connectivity status"
                    title="LoRaWAN Gateway Network Status"
                >
                    <Radio className="text-[#3FA65A] w-5 h-5 animate-pulse" />
                    <span className="absolute -top-1 -right-1 bg-[#3FA65A] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">
                        2/2
                    </span>
                </button>

                {/* Gateway Connectivity Dropdown */}
                <AnimatePresence>
                    {isGatewayMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-full mt-2 w-[240px] rounded-[24px] bg-white border border-[#E9F4EC] shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-50 p-3"
                        >
                            <div className="px-2 py-1.5 border-b border-[#E9F4EC] mb-2 flex justify-between items-center">
                                <p className="text-[11px] font-extrabold text-[#113A28] uppercase tracking-wider">
                                    LoRaWAN Gateways
                                </p>
                                <span className="text-[9px] font-bold text-[#3FA65A] bg-[#F4F9F4] px-2 py-0.5 rounded-full border border-[#E9F4EC]">
                                    ONLINE
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-[#F8FBF8] p-2.5 rounded-[16px] border border-[#E9F4EC] text-[11px]">
                                    <div className="flex justify-between items-center font-bold text-[#113A28]">
                                        <span>Gateway #1 (Shed A/B)</span>
                                        <CheckCircle2 size={12} className="text-[#3FA65A]" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-[#8DA697] mt-1">
                                        <span>498 cows connected</span>
                                        <span>RSSI -84 dBm</span>
                                    </div>
                                </div>

                                <div className="bg-[#F8FBF8] p-2.5 rounded-[16px] border border-[#E9F4EC] text-[11px]">
                                    <div className="flex justify-between items-center font-bold text-[#113A28]">
                                        <span>Gateway #2 (Shed C)</span>
                                        <CheckCircle2 size={12} className="text-[#3FA65A]" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-[#8DA697] mt-1">
                                        <span>489 cows connected</span>
                                        <span>RSSI -88 dBm</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-[#E9F4EC] text-[10px] font-bold text-[#6C8576] text-center">
                                Edge Sync Latency: <span className="text-[#184F35] font-black">12ms</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
