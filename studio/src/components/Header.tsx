"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, LANGUAGES } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
    userName?: string;
}

export function Header({ userName = "krishna" }: HeaderProps) {
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className="flex justify-between items-center bg-transparent">
            <div className="flex items-center gap-3">
                <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden shadow-sm">
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
                    <div className="bg-white/90 text-[#6C8576] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm w-max mt-1.5 border border-[#113A28]/5 tracking-wide">
                        {t("pro_farmer")}
                    </div>
                </div>
            </div>

            {/* Language Selector */}
            <div className="relative">
                <button
                    onClick={() => setIsLangMenuOpen((prev) => !prev)}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative transition-transform hover:scale-105 active:scale-95"
                    aria-label="Toggle language menu"
                >
                    <Globe className="text-[#6C8576] w-5 h-5" />
                </button>

                {/* Language Dropdown */}
                <AnimatePresence>
                    {isLangMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-full mt-2 w-[200px] max-h-[350px] overflow-y-auto rounded-[20px] bg-white border border-[#E9F4EC] shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-50 p-2 no-scrollbar"
                        >
                            <div className="px-3 py-2 border-b border-[#E9F4EC] mb-1">
                                <p className="text-[11px] font-bold text-[#8DA697] uppercase tracking-wider">
                                    {t("select_language")}
                                </p>
                            </div>
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang);
                                        setIsLangMenuOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2.5 rounded-[12px] transition-colors flex items-center justify-between",
                                        language.code === lang.code
                                            ? "bg-[#184F35] text-white"
                                            : "hover:bg-[#F4F9F4]"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-[13px] font-bold",
                                            language.code === lang.code ? "text-white" : "text-[#113A28]"
                                        )}
                                    >
                                        {lang.native}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-[10px] font-medium",
                                            language.code === lang.code ? "text-white/70" : "text-[#8DA697]"
                                        )}
                                    >
                                        {lang.name}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
