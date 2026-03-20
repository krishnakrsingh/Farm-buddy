"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    User, Activity as ActivityIcon,
    Leaf, Mic, Square, Loader2, Globe, AlertCircle,
    ChevronDown, CloudRain, AlertTriangle,
    Search, SlidersHorizontal, ArrowUpRight, Home, Calendar, Heart, MessageSquare, Video, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdvancedWeatherWidget } from "@/components/AdvancedWeatherWidget";
import { useLiveApi } from "@/hooks/use-live-api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage, LANGUAGES } from "@/lib/LanguageContext";

type AuthInfo = {
    ephemeralToken?: string;
    authMethod?: "ephemeral-token";
    error?: string;
};

export default function HomePage() {
    const audioRef = useRef<HTMLVideoElement>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isMicLoading, setIsMicLoading] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const { language, setLanguage, t } = useLanguage();

    const { connect, disconnect, connected, volume, transcript } = useLiveApi();

    const fetchToken = useCallback(async (): Promise<AuthInfo | null> => {
        try {
            setAuthError(null);
            const res = await fetch("/api/vertex-auth");
            const data = await res.json();
            if (!res.ok || data.error) {
                setAuthError(data.error || `Auth request failed (${res.status})`);
                return null;
            }
            const info: AuthInfo = { ephemeralToken: data.ephemeralToken, authMethod: data.authMethod as "ephemeral-token" };
            setAuthInfo(info);
            return info;
        } catch (err) {
            setAuthError("Could not reach auth service.");
            return null;
        }
    }, []);

    useEffect(() => {
        fetchToken();
    }, [fetchToken]);

    const startAudio = useCallback(async () => {
        setIsMicLoading(true);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setAuthError("Microphone access not supported.");
            setIsMicLoading(false);
            return false;
        }

        try {
            if (audioStream) {
                audioStream.getTracks().forEach((t) => t.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
                video: false,
            });

            setAudioStream(stream);
            setIsMicLoading(false);

            if (audioRef.current) {
                audioRef.current.srcObject = stream;
            }
            return true;
        } catch (err: any) {
            console.error("Mic error:", err);
            setIsMicLoading(false);
            setAuthError("Microphone permission denied.");
            return false;
        }
    }, [audioStream]);

    useEffect(() => {
        return () => {
            if (audioStream) {
                audioStream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [audioStream]);

    const toggleLive = async () => {
        if (isStreaming) {
            disconnect();
            setIsStreaming(false);
        } else {
            const hasMic = await startAudio();
            if (!hasMic) return;

            const currentAuth = await fetchToken();
            if (!currentAuth || !currentAuth.ephemeralToken) return;

            setIsStreaming(true);

            try {
                const config = {
                    model: "models/gemini-2.5-flash-native-audio-latest",
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
                        },
                    },
                    systemInstruction: {
                        parts: [{
                            text: `You are an expert AI agriculture assistant for DrFarm. 
                          You must ONLY speak in the ${language.name} language. 
                          Always communicate in ${language.name} (${language.native}). 
                          Be highly concise, friendly, and practical. 
                          Provide helpful farming advice, weather tips, and crop health information.`
                        }],
                    },
                };

                await connect(config, audioRef.current, { accessToken: currentAuth.ephemeralToken, url: "" });
            } catch (err) {
                console.error("Connection error:", err);
                setIsStreaming(false);
                setAuthError("Failed to connect to AI.");
            }
        }
    };

    const wasConnected = useRef(false);
    useEffect(() => {
        if (connected) wasConnected.current = true;
        else if (wasConnected.current && isStreaming) {
            setIsStreaming(false);
            wasConnected.current = false;
        }
    }, [connected, isStreaming]);

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <video ref={audioRef} autoPlay playsInline muted className="hidden" />

            {/* Embedded Styles */}
            <style key="scroll-style" jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>


            <div className="max-w-md mx-auto relative pt-10 px-5 space-y-7 z-10 pb-10">

                {/* Header */}
                <header className="flex justify-between items-center bg-transparent">
                    <div className="flex items-center gap-3">
                        <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden shadow-sm">
                            <img src="https://i.pravatar.cc/150?img=33" className="w-full h-full object-cover" alt="User" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-xl font-extrabold text-[#113A28] leading-none flex items-center gap-1">
                                {t("hey")} krishna<span className="text-xl">👋</span>
                            </h1>
                            <div className="bg-white/90 text-[#6C8576] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm w-max mt-1.5 border border-[#113A28]/5 tracking-wide">
                                {t("pro_farmer")}
                            </div>
                        </div>
                    </div>

                    {/* Language Toggle (replacing Bell) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative transition-transform hover:scale-105"
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
                                        <p className="text-[11px] font-bold text-[#8DA697] uppercase tracking-wider">{t("select_language")}</p>
                                    </div>
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => { setLanguage(lang); setIsLangMenuOpen(false); }}
                                            className={cn(
                                                "w-full text-left px-3 py-2.5 rounded-[12px] transition-colors flex items-center justify-between",
                                                language.code === lang.code
                                                    ? "bg-[#184F35] text-white"
                                                    : "hover:bg-[#F4F9F4]"
                                            )}
                                        >
                                            <span className={cn("text-[13px] font-bold", language.code === lang.code ? "text-white" : "text-[#113A28]")}>{lang.native}</span>
                                            <span className={cn("text-[10px] font-medium", language.code === lang.code ? "text-white/70" : "text-[#8DA697]")}>{lang.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>



                {/* Weather Widget */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    <div className="px-1 mb-2">
                        <h2 className="text-[17px] font-extrabold text-[#113A28]">{t("weather_updates")}</h2>
                    </div>
                    <AdvancedWeatherWidget />
                </motion.div>

                {/* Available Agronomist (Doctor Card replacement) */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>


                    <div className="bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white">
                        <div className="flex items-start">
                            {/* Image Profile Box overlapping */}
                            <div className="relative w-[110px] h-[130px] rounded-[24px] bg-[#F4F9F4] flex items-end justify-center overflow-hidden shrink-0 border border-[#E9F4EC]">
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=drfarm3&backgroundColor=transparent" alt="Dr Farm AI" className="w-[90px] h-[90px] object-contain relative z-10 -mb-2" />

                                {/* Online indicator */}
                                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm shadow-sm rounded-full flex items-center gap-1 px-2 py-0.5 z-20">
                                    <div className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold text-[#184F35] uppercase tracking-wider">{t("online")}</span>
                                </div>

                                {connected && (
                                    <motion.div animate={{ scale: 1 + volume * 0.8 }} className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#4CAF50]/30 rounded-full blur-md z-0" />
                                )}
                            </div>

                            {/* Content beside image */}
                            <div className="flex-1 ml-4 pt-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-[18px] font-extrabold text-[#113A28] leading-snug">{t("dr_farm_ai")}</h3>
                                        <p className="text-[13px] font-medium text-[#6C8576] mt-0.5">{t("crop_pathologist")}</p>
                                    </div>
                                    <div className="bg-[#FFF8DF] px-2 py-1 rounded-[10px] flex items-center gap-1">
                                        <span className="text-[#E7A600] text-[12px] font-black">★ 4.9</span>
                                    </div>
                                </div>

                                {/* Price / Sub status section */}
                                <div className="mt-4 flex justify-between items-end pr-1">
                                    <div>
                                        <h4 className="text-[20px] font-black text-[#184F35] leading-none">{t("free")}</h4>
                                        <p className="text-[11px] font-semibold text-[#8DA697] mt-1 ml-0.5">{t("unlimited_24_7")}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 rounded-full border-[1.5px] border-[#E8EEEA] flex items-center justify-center hover:bg-[#F4F9F4] group transition-colors">
                                            <Heart className="w-[18px] h-[18px] text-[#A0B8AA] group-hover:text-red-400 group-hover:fill-red-400" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-[#FAFCFB] border-[1.5px] border-[#E8EEEA] flex items-center justify-center hover:bg-[#F4F9F4] transition-colors">
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
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#113A28] text-[13px] font-bold italic line-clamp-2 leading-snug w-[85%]">
                                        &quot;{transcript}&quot;
                                    </motion.p>
                                ) : (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#8DA697] text-[13px] font-semibold leading-relaxed flex items-center gap-2">
                                        {isMicLoading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin text-[#184F35]" /> {t("connecting")}</>
                                        ) : connected ? (
                                            t("listening")
                                        ) : (
                                            <span className="flex items-center gap-1.5"><Info size={14} className="text-[#A0B8AA]" /> {t("ai_ready")}</span>
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

                        {/* Action Buttons spanning full width inside card */}
                        <div className="flex gap-3 mt-4">
                            <Link href="/chat" className="flex-1 py-[14px] rounded-[16px] bg-white border-[1.5px] border-[#E8EEEA] flex items-center justify-center gap-2 font-bold text-[14px] text-[#113A28] hover:bg-[#FAFCFB] transition-colors shadow-sm">
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



            </div>



        </div>
    );
}
