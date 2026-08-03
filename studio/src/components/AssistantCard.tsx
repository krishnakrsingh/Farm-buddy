"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    ArrowUpRight,
    MessageSquare,
    Video,
    Loader2,
    Info,
    AlertCircle,
    Bot,
    X,
    Sparkles,
    CheckCircle2
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
    const [showShapModal, setShowShapModal] = useState(false);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

    const MOCK_SHAP_RESPONSES = [
        {
            q: "Why was Cow 014 flagged today?",
            a: "Cow 014 breached cumulative sum (CUSUM) threshold at 04:15 AM with a sustained core temperature elevation of +1.9°C above her 7-day baseline (40.4°C vs 38.5°C normal). Heart rate rose to 96 BPM. SHAP feature analysis attributes 64% of risk weight to thermal baseline breach, 24% to elevated heart rate, and 12% to ambient THI heat stress."
        },
        {
            q: "What action should I take for COW-014?",
            a: "Immediate milk segregation recommended! Flag for veterinary check before morning milking. Isolate in cooling pen and verify core temperature via rectal thermometer."
        },
        {
            q: "How many cows are currently escalated to cloud?",
            a: "Currently 3 cows (COW-014, COW-108, COW-219) have breached both edge Z-score & CUSUM filters and were evaluated by the Cloud Super Model with >88% confidence."
        }
    ];

    const handleOpenShapModal = () => {
        if (!connected) {
            onToggleLive();
        }
        setShowShapModal(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <div className="bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white">
                    <div className="flex items-start">
                        {/* Bot Avatar Box */}
                        <button
                            onClick={handleOpenShapModal}
                            className="relative w-[110px] h-[130px] rounded-[24px] bg-[#F4F9F4] flex items-end justify-center overflow-hidden shrink-0 border border-[#E9F4EC] hover:opacity-90 transition-opacity active:scale-95 text-left"
                            title={isStreaming ? "Click to view SHAP diagnostic insight" : "Click to start PashuAI"}
                        >
                            <img
                                src="https://api.dicebear.com/7.x/bottts/svg?seed=pashuAI&backgroundColor=transparent"
                                alt="PashuAI"
                                className="w-[90px] h-[90px] object-contain relative z-10 -mb-2"
                            />

                            {/* Online indicator */}
                            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm shadow-sm rounded-full flex items-center gap-1 px-2 py-0.5 z-20">
                                <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-[#3FA65A] animate-pulse" : "bg-orange-400"}`} />
                                <span className="text-[9px] font-bold text-[#184F35] uppercase tracking-wider">
                                    {connected ? t("online") : t("live")}
                                </span>
                            </div>

                            {connected && (
                                <motion.div
                                    animate={{ scale: 1 + volume * 0.8 }}
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#3FA65A]/30 rounded-full blur-md z-0"
                                />
                            )}
                        </button>

                        {/* Content beside avatar */}
                        <div className="flex-1 ml-4 pt-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[18px] font-extrabold text-[#113A28] leading-snug">
                                        PashuAI
                                    </h3>
                                    <p className="text-[13px] font-medium text-[#6C8576] mt-0.5">
                                        Herd Health Advisor
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
                                        onClick={() => setShowShapModal(true)}
                                        className="w-10 h-10 rounded-full border-[1.5px] border-[#E8EEEA] flex items-center justify-center hover:bg-[#F4F9F4] group transition-colors"
                                        aria-label="Bookmark"
                                        title="View SHAP explanations"
                                    >
                                        <Sparkles className="w-[18px] h-[18px] text-[#184F35]" />
                                    </button>
                                    <button
                                        onClick={() => setShowShapModal(true)}
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
                    <div 
                        onClick={() => setShowShapModal(true)}
                        className="mt-4 bg-[#F8FBF8] rounded-[20px] p-3.5 min-h-[3.5rem] border border-[#E9F4EC] relative mb-1 cursor-pointer hover:bg-[#F0F7F1] transition-colors"
                    >
                        <AnimatePresence mode="wait">
                            {connected && transcript ? (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[#113A28] text-[13px] font-bold italic line-clamp-2 leading-snug w-[90%]"
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
                                            <Info size={14} className="text-[#A0B8AA]" /> Tap to ask SHAP model reasoning
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
                        <button
                            onClick={handleOpenShapModal}
                            className="flex-1 py-[14px] rounded-[16px] bg-white border-[1.5px] border-[#E8EEEA] flex items-center justify-center gap-2 font-bold text-[14px] text-[#113A28] hover:bg-[#FAFCFB] transition-colors shadow-sm active:scale-95"
                        >
                            <MessageSquare className="w-4 h-4 text-[#8DA697]" /> Voice AI
                        </button>

                        <Link
                            href="/scan"
                            className="flex-1 py-[14px] rounded-[16px] flex items-center justify-center gap-2 font-bold text-[14px] transition-all shadow-md bg-[#184F35] border border-[#184F35] text-white hover:bg-[#123926] active:scale-95"
                        >
                            <Video className="w-[18px] h-[18px]" />
                            Video Call
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* SHAP Explanation Interactive Modal for Presentation */}
            <AnimatePresence>
                {showShapModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[32px] w-full max-w-md p-5 shadow-2xl border border-[#E9F4EC] relative"
                        >
                            <button
                                onClick={() => setShowShapModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F9F4] flex items-center justify-center text-[#6C8576] hover:text-[#113A28]"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#F4F9F4] flex items-center justify-center text-[#184F35]">
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-extrabold text-[#113A28]">PashuAI SHAP Advisor</h3>
                                    <p className="text-[11px] font-bold text-[#8DA697]">Cloud Super Model Reasoning Layer</p>
                                </div>
                            </div>

                            {/* Preset Questions */}
                            <div className="space-y-2 mb-4">
                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C8576]">Select Question:</p>
                                {MOCK_SHAP_RESPONSES.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedQuestionIndex(idx)}
                                        className={`w-full text-left p-2.5 rounded-[14px] text-[12px] font-bold transition-all border ${
                                            selectedQuestionIndex === idx
                                                ? "bg-[#184F35] text-white border-[#184F35]"
                                                : "bg-[#F8FBF8] text-[#113A28] border-[#E9F4EC] hover:bg-[#F0F7F1]"
                                        }`}
                                    >
                                        ❓ {item.q}
                                    </button>
                                ))}
                            </div>

                            {/* Answer Box */}
                            <div className="bg-[#F4F9F4] rounded-[20px] p-4 border border-[#E9F4EC]">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Sparkles size={14} className="text-[#184F35]" />
                                    <span className="text-[11px] font-black uppercase text-[#184F35] tracking-wider">
                                        SHAP Explanation Output
                                    </span>
                                </div>
                                <p className="text-[12px] font-medium text-[#113A28] leading-relaxed">
                                    {MOCK_SHAP_RESPONSES[selectedQuestionIndex].a}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowShapModal(false)}
                                className="w-full mt-4 py-3 rounded-[16px] bg-[#184F35] text-white font-bold text-[14px] flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={16} /> Close Assistant
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
