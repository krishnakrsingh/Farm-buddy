"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    ArrowUpRight,
    MessageSquare,
    Video,
    Loader2,
    Info,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface AssistantCardProps {
    connected: boolean;
    isStreaming: boolean;
    volume: number;
    transcript?: string;
    isMicLoading: boolean;
    authError: string | null;
    onToggleLive: () => void;
}

export function AssistantCard({
    connected,
    isStreaming,
    volume,
    transcript,
    isMicLoading,
    authError,
    onToggleLive,
}: AssistantCardProps) {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            <div className="bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white">
                <div className="flex items-start">
                    {/* Bot Avatar Box */}
                    <button
                        onClick={onToggleLive}
                        className="relative w-[110px] h-[130px] rounded-[24px] bg-[#F4F9F4] flex items-end justify-center overflow-hidden shrink-0 border border-[#E9F4EC] hover:opacity-90 transition-opacity active:scale-95 text-left"
                        title={isStreaming ? "Click to disconnect" : "Click to start live voice AI"}
                    >
                        <img
                            src="https://api.dicebear.com/7.x/bottts/svg?seed=khetsetu3&backgroundColor=transparent"
                            alt="Khetsetu AI"
                            className="w-[90px] h-[90px] object-contain relative z-10 -mb-2"
                        />

                        {/* Online indicator */}
                        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm shadow-sm rounded-full flex items-center gap-1 px-2 py-0.5 z-20">
                            <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-[#4CAF50] animate-pulse" : "bg-orange-400"}`} />
                            <span className="text-[9px] font-bold text-[#184F35] uppercase tracking-wider">
                                {connected ? t("online") : t("live")}
                            </span>
                        </div>

                        {connected && (
                            <motion.div
                                animate={{ scale: 1 + volume * 0.8 }}
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#4CAF50]/30 rounded-full blur-md z-0"
                            />
                        )}
                    </button>

                    {/* Content beside avatar */}
                    <div className="flex-1 ml-4 pt-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-[18px] font-extrabold text-[#113A28] leading-snug">
                                    {t("dr_farm_ai")}
                                </h3>
                                <p className="text-[13px] font-medium text-[#6C8576] mt-0.5">
                                    {t("crop_pathologist")}
                                </p>
                            </div>
                            <div className="bg-[#FFF8DF] px-2 py-1 rounded-[10px] flex items-center gap-1">
                                <span className="text-[#E7A600] text-[12px] font-black">★ 4.9</span>
                            </div>
                        </div>

                        {/* Price / Availability */}
                        <div className="mt-4 flex justify-between items-end pr-1">
                            <div>
                                <h4 className="text-[20px] font-black text-[#184F35] leading-none">
                                    {t("free")}
                                </h4>
                                <p className="text-[11px] font-semibold text-[#8DA697] mt-1 ml-0.5">
                                    {t("unlimited_24_7")}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="w-10 h-10 rounded-full border-[1.5px] border-[#E8EEEA] flex items-center justify-center hover:bg-[#F4F9F4] group transition-colors"
                                    aria-label="Bookmark"
                                >
                                    <Heart className="w-[18px] h-[18px] text-[#A0B8AA] group-hover:text-red-400 group-hover:fill-red-400" />
                                </button>
                                <button
                                    className="w-10 h-10 rounded-full bg-[#FAFCFB] border-[1.5px] border-[#E8EEEA] flex items-center justify-center hover:bg-[#F4F9F4] transition-colors"
                                    aria-label="View Details"
                                >
                                    <ArrowUpRight className="w-[18px] h-[18px] text-[#113A28]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Assistant Status / Transcription */}
                <div className="mt-4 bg-[#F8FBF8] rounded-[20px] p-4 min-h-[3.5rem] border border-[#E9F4EC] relative mb-1">
                    <AnimatePresence mode="wait">
                        {connected && transcript ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-[#113A28] text-[13px] font-bold italic line-clamp-2 leading-snug w-[85%]"
                            >
                                &quot;{transcript}&quot;
                            </motion.p>
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-[#8DA697] text-[13px] font-semibold leading-relaxed flex items-center gap-2"
                            >
                                {isMicLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-[#184F35]" />{" "}
                                        {t("connecting")}
                                    </>
                                ) : connected ? (
                                    t("listening")
                                ) : (
                                    <span className="flex items-center gap-1.5">
                                        <Info size={14} className="text-[#A0B8AA]" /> {t("ai_ready")}
                                    </span>
                                )}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {authError && (
                        <div className="absolute -bottom-8 left-0 right-0 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-red-100 z-10">
                            <AlertCircle size={12} /> {authError}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <Link
                        href="/chat"
                        className="flex-1 py-[14px] rounded-[16px] bg-white border-[1.5px] border-[#E8EEEA] flex items-center justify-center gap-2 font-bold text-[14px] text-[#113A28] hover:bg-[#FAFCFB] transition-colors shadow-sm"
                    >
                        <MessageSquare className="w-4 h-4 text-[#8DA697]" /> {t("message")}
                    </Link>

                    <Link
                        href="/scan"
                        className="flex-1 py-[14px] rounded-[16px] flex items-center justify-center gap-2 font-bold text-[14px] transition-all shadow-md bg-[#184F35] border border-[#184F35] text-white hover:bg-[#123926]"
                    >
                        <Video className="w-[18px] h-[18px]" />
                        {t("video_call")}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
