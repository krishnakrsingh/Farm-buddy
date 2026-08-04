"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Sparkles, Loader2, Info, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white rounded-[24px] p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-[14px] bg-[#F4F9F4] flex items-center justify-center shrink-0 border border-[#E9F4EC]">
                            <img
                                src="https://api.dicebear.com/7.x/bottts/svg?seed=khetsetu3&backgroundColor=transparent"
                                alt="Dr. Farm AI"
                                className="w-9 h-9 object-contain"
                            />
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${connected ? "bg-[#4CAF50] animate-pulse" : "bg-orange-400"}`} />
                        </div>

                        <div>
                            <h3 className="text-[15px] font-black text-[#113A28] leading-tight flex items-center gap-1.5">
                                Dr. Farm AI <Sparkles size={14} className="text-[#184F35]" />
                            </h3>
                            <p className="text-[11px] font-extrabold text-[#6C8576]">
                                Dairy Health Specialist
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/assistant"
                        className="text-[11px] font-black text-[#184F35] bg-[#F4F9F4] hover:bg-[#E9F4EC] px-3 py-1.5 rounded-full border border-[#E9F4EC] flex items-center gap-1 transition-colors"
                    >
                        Full Screen <ArrowRight size={12} />
                    </Link>
                </div>

                {/* Status / Transcript Box */}
                <div className="bg-[#F8FBF8] rounded-[16px] p-2.5 border border-[#E9F4EC] relative min-h-[2.5rem] flex items-center">
                    <AnimatePresence mode="wait">
                        {connected && transcript ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-[#113A28] text-[12px] font-black italic line-clamp-1"
                            >
                                &quot;{transcript}&quot;
                            </motion.p>
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-[#8DA697] text-[11px] font-bold flex items-center gap-1.5"
                            >
                                {isMicLoading ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#184F35]" />
                                        Connecting to Cloud AI...
                                    </>
                                ) : connected ? (
                                    "Listening for your question..."
                                ) : (
                                    <>
                                        <Info size={13} className="text-[#A0B8AA]" /> Ask about cow health, temp anomalies, or milk holds.
                                    </>
                                )}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {authError && (
                        <div className="absolute inset-0 bg-red-50 text-red-600 px-3 py-1 rounded-[16px] text-[10px] font-bold flex items-center gap-1 border border-red-100">
                            <AlertCircle size={12} /> {authError}
                        </div>
                    )}
                </div>

                {/* Quick Voice Button */}
                <button
                    onClick={onToggleLive}
                    className="w-full py-2.5 rounded-[16px] bg-[#184F35] hover:bg-[#123926] text-white flex items-center justify-center gap-2 font-black text-[13px] transition-all shadow-xs active:scale-98"
                >
                    <Mic className="w-4 h-4" />
                    {connected ? "Stop Voice AI" : "Tap to Speak"}
                </button>
            </div>
        </motion.div>
    );
}
