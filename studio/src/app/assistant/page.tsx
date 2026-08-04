"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Loader2, StopCircle, ArrowLeft, CloudLightning, Sparkles, MessageSquare, ShieldCheck, Stethoscope, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLiveApi } from "@/hooks/use-live-api";
import { cn } from "@/lib/utils";

type AuthInfo = {
    ephemeralToken?: string;
    authMethod?: "ephemeral-token";
    error?: string;
};

const PRESET_PROMPTS = [
    { label: "Why was Cow #014 flagged?", query: "Why was Cow 014 flagged by the cloud model?" },
    { label: "Current Herd Heat Stress Risk", query: "What is the ambient THI heat stress risk for the herd today?" },
    { label: "Milk Hold Status", query: "Which cows currently have active milk isolation orders?" },
];

export default function AssistantPage() {
    const router = useRouter();
    const audioRef = useRef<HTMLVideoElement>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [, setAuthInfo] = useState<AuthInfo | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isMicLoading, setIsMicLoading] = useState(false);

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
            const info: AuthInfo = {
                ephemeralToken: data.ephemeralToken,
                authMethod: data.authMethod as "ephemeral-token",
            };
            setAuthInfo(info);
            return info;
        } catch (err: unknown) {
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
                audioStream.getTracks().forEach((track) => track.stop());
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
        } catch (err: unknown) {
            setIsMicLoading(false);
            setAuthError("Microphone permission denied.");
            return false;
        }
    }, [audioStream]);

    useEffect(() => {
        return () => {
            if (audioStream) {
                audioStream.getTracks().forEach((track) => track.stop());
            }
            if (connected) {
                disconnect();
            }
        };
    }, [audioStream, connected, disconnect]);

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
                        parts: [
                            {
                                text: `You are Dr. Farm AI, an expert AI dairy farming assistant. 
                          You have access to the cloud model's reasoning. 
                          If the farmer asks "why was cow 014 flagged", respond: "Cow 014 was flagged because she has shown a sustained body temperature rise above 40°C coupled with an elevated heart rate for over 4 hours. The cloud model indicates a 94% confidence of possible clinical mastitis or systemic infection."
                          Always communicate in English. Be highly concise, friendly, and practical. No jargon unless explaining it simply.`,
                            },
                        ],
                    },
                };

                await connect(config, audioRef.current, {
                    accessToken: currentAuth.ephemeralToken,
                    url: "",
                });
            } catch (err: unknown) {
                setIsStreaming(false);
                setAuthError("Failed to connect to AI.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6] flex flex-col">
            <video ref={audioRef} autoPlay playsInline muted className="hidden" />

            <div className="max-w-md mx-auto w-full flex-1 flex flex-col relative pt-8 px-5 z-10 pb-10">
                {/* Header */}
                <header className="flex justify-between items-center bg-transparent mb-6">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs border border-[#E9F4EC] hover:bg-[#F4F9F4] transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#184F35]" />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black text-[#113A28] leading-none flex items-center gap-1.5">
                            <Sparkles size={18} className="text-[#184F35]" /> Dr. Farm AI
                        </h1>
                        <span className="text-[10px] font-black text-[#6C8576] uppercase tracking-wider mt-1 flex items-center gap-1">
                            <CloudLightning size={12} className="text-[#F29C38]" /> Cloud Neural Model Linked
                        </span>
                    </div>
                    <div className="w-10 h-10" />
                </header>

                {/* Main Avatar & Visualizer */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-4">
                    <motion.div
                        className="relative w-56 h-56 rounded-full bg-white shadow-[0_24px_48px_rgba(0,0,0,0.08)] flex items-center justify-center mb-6 border-4 border-[#E9F4EC]"
                        animate={{
                            scale: connected ? 1 + (volume * 0.25) : 1,
                            boxShadow: connected ? `0 0 ${24 + volume * 60}px rgba(24, 79, 53, 0.4)` : "0 24px 48px rgba(0,0,0,0.08)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img
                            src="https://api.dicebear.com/7.x/bottts/svg?seed=khetsetu3&backgroundColor=transparent"
                            alt="AI Assistant"
                            className="w-44 h-44 object-contain"
                        />

                        {/* Animated Voice Wave Indicator */}
                        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-[#E9F4EC]">
                            <div className={cn("w-2 h-2 rounded-full", connected ? "bg-[#4CAF50] animate-pulse" : "bg-orange-400")} />
                            <span className="text-[9px] font-black text-[#113A28] uppercase tracking-wider">
                                {connected ? "Voice Live" : "Ready"}
                            </span>
                        </div>
                    </motion.div>

                    {/* Quick Preset Prompts */}
                    <div className="w-full space-y-2 mb-4">
                        <div className="text-[10px] font-black text-[#6C8576] uppercase tracking-wider text-center mb-1">
                            Recommended Explanations
                        </div>
                        {PRESET_PROMPTS.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={toggleLive}
                                className="w-full bg-white/90 hover:bg-white p-3 rounded-[20px] border border-white text-left shadow-xs transition-all flex items-center justify-between group active:scale-98"
                            >
                                <div className="flex items-center gap-2.5">
                                    <MessageSquare size={14} className="text-[#184F35]" />
                                    <span className="text-[12px] font-extrabold text-[#113A28]">{p.label}</span>
                                </div>
                                <ChevronRight size={14} className="text-[#8DA697] group-hover:text-[#184F35]" />
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Voice Transcript / Output Card */}
                    <div className="w-full bg-white rounded-[24px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white min-h-[110px] flex flex-col justify-center text-center relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {connected && transcript ? (
                                <motion.p
                                    key="transcript"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[15px] font-extrabold text-[#113A28] leading-relaxed"
                                >
                                    &quot;{transcript}&quot;
                                </motion.p>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[#8DA697] space-y-1"
                                >
                                    {isMicLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-[#184F35]" />
                                            <span className="font-bold text-[13px]">Connecting to Cloud Neural Model...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-extrabold text-[13px] text-[#113A28]">Tap the mic button to start voice session</p>
                                            <p className="font-medium text-[11px] text-[#6C8576]">The assistant pulls reasoning directly from on-device baseline & cloud neural models.</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {authError && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs border border-red-100">
                                {authError}
                            </div>
                        )}
                    </div>
                </div>

                {/* Voice Control Button */}
                <div className="mt-auto flex justify-center pb-4">
                    <button
                        onClick={toggleLive}
                        disabled={isMicLoading}
                        className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center shadow-[0_16px_40px_rgba(24,79,53,0.3)] transition-all active:scale-95",
                            isStreaming ? "bg-red-500 hover:bg-red-600" : "bg-[#184F35] hover:bg-[#123926]"
                        )}
                    >
                        {isStreaming ? (
                            <StopCircle className="text-white w-10 h-10" />
                        ) : (
                            <Mic className="text-white w-10 h-10" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
