"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Activity, Radio, AlertTriangle, CloudLightning, Cpu, ArrowRight, ThermometerSun } from "lucide-react";
import { AdvancedWeatherWidget } from "@/components/AdvancedWeatherWidget";
import { Header } from "@/components/Header";
import { AssistantCard } from "@/components/AssistantCard";
import { useLiveApi } from "@/hooks/use-live-api";
import { useHerdState } from "@/lib/useHerdState";
import Link from "next/link";

type AuthInfo = {
    ephemeralToken?: string;
    authMethod?: "ephemeral-token";
    error?: string;
};

export default function HomePage() {
    const audioRef = useRef<HTMLVideoElement>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [, setAuthInfo] = useState<AuthInfo | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isMicLoading, setIsMicLoading] = useState(false);

    const { totalCows, onlineTags, escalatedCows, flaggedCows, isTankContaminatedRisk } = useHerdState();
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
            const message = err instanceof Error ? err.message : "Could not reach auth service.";
            setAuthError(message);
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
            console.error("Mic error:", err);
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
                        parts: [
                            {
                                text: `You are an expert AI dairy farming assistant. 
                          You have access to the cloud model's reasoning. 
                          If asked about Cow 014, explain that she had a sustained body temperature rise >40°C over 4 hours with elevated heart rate, signaling possible mastitis. 
                          Always communicate in English. Be highly concise, friendly, and practical.`,
                            },
                        ],
                    },
                };

                await connect(config, audioRef.current, {
                    accessToken: currentAuth.ephemeralToken,
                    url: "",
                });
            } catch (err: unknown) {
                console.error("Connection error:", err);
                setIsStreaming(false);
                setAuthError("Failed to connect to AI.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <video ref={audioRef} autoPlay playsInline muted className="hidden" />

            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-6 z-10 pb-10">
                {/* Header */}
                <Header userName="Krishna" isTankRisk={isTankContaminatedRisk} />

                {/* 1. Dynamic Herd Snapshot Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="px-1 mb-2 flex justify-between items-end">
                        <h2 className="text-[17px] font-extrabold text-[#113A28]">
                            Herd Telemetry Snapshot
                        </h2>
                        <span className="text-[10px] font-black text-[#184F35] bg-white/80 px-2 py-0.5 rounded-full border border-[#E9F4EC] tracking-wider uppercase">
                            Live Telemetry
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {/* Total Cows */}
                        <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-[#F4F9F4] p-2 rounded-xl text-[#184F35]">
                                    <Activity size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-bold text-[#6C8576] uppercase tracking-wider">Total Cows</span>
                            </div>
                            <span className="text-2xl font-black text-[#113A28] leading-none">{totalCows.toLocaleString()}</span>
                        </div>

                        {/* Online Tags */}
                        <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                                    <Radio size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-bold text-[#6C8576] uppercase tracking-wider">Active Sensors</span>
                            </div>
                            <span className="text-2xl font-black text-[#113A28] leading-none">{onlineTags.toLocaleString()}</span>
                        </div>

                        {/* Flagged Local */}
                        <Link href="/alerts" className="bg-[#FFF8DF] rounded-[24px] p-4 shadow-[0_8px_24px_rgba(231,166,0,0.08)] border border-[#FFEBB3] flex flex-col justify-between hover:scale-[1.02] transition-transform">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white p-2 rounded-xl text-[#E7A600]">
                                        <AlertTriangle size={18} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black text-[#9A6E00] uppercase tracking-wider">Tier 2 Flagged</span>
                                </div>
                                <ArrowRight size={14} className="text-[#9A6E00]" />
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-[#9A6E00] leading-none">{flaggedCows.length}</span>
                                <span className="text-[11px] font-bold text-[#B38000] mb-0.5">Watching</span>
                            </div>
                        </Link>

                        {/* Escalated Cloud */}
                        <Link href="/alerts" className="bg-red-50 rounded-[24px] p-4 shadow-[0_8px_24px_rgba(239,68,68,0.1)] border border-red-100 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white p-2 rounded-xl text-red-600 shadow-xs">
                                        <CloudLightning size={18} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black text-red-800 uppercase tracking-wider">Tier 3 Cloud</span>
                                </div>
                                <ArrowRight size={14} className="text-red-700" />
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-red-700 leading-none">{escalatedCows.length}</span>
                                <span className="text-[11px] font-extrabold text-red-800 mb-0.5">Action Req.</span>
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* 2. AI Assistant Interactive Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="px-1 mb-2">
                        <h2 className="text-[17px] font-extrabold text-[#113A28]">
                            AI Veterinary Assistant
                        </h2>
                    </div>
                    <AssistantCard
                        connected={connected}
                        isStreaming={isStreaming}
                        volume={volume}
                        transcript={transcript}
                        isMicLoading={isMicLoading}
                        authError={authError}
                        onToggleLive={toggleLive}
                    />
                </motion.div>

                {/* 3. 3-Tier Edge-to-Cloud Architecture Visualizer */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-[28px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white"
                >
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Cpu size={18} className="text-[#184F35]" />
                            <h2 className="text-[14px] font-black uppercase tracking-wider text-[#113A28]">
                                3-Tier Detection Architecture
                            </h2>
                        </div>
                        <span className="text-[9px] font-black bg-[#F4F9F4] text-[#184F35] px-2 py-0.5 rounded-full border border-[#E9F4EC]">
                            ON-TAG EDGE AI
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        {/* Tier 1 */}
                        <div className="bg-[#F8FBF8] rounded-[18px] p-2.5 border border-[#E9F4EC] flex flex-col justify-between">
                            <div className="text-[9px] font-extrabold text-[#6C8576] uppercase tracking-wider">Tier 1: Normal</div>
                            <div className="my-1">
                                <span className="text-xl font-black text-[#184F35]">1,225</span>
                            </div>
                            <div className="text-[8px] font-bold text-[#8DA697]">On-Device Baseline</div>
                        </div>

                        {/* Tier 2 */}
                        <div className="bg-[#FFF8DF] rounded-[18px] p-2.5 border border-[#FFEBB3] flex flex-col justify-between">
                            <div className="text-[9px] font-extrabold text-[#9A6E00] uppercase tracking-wider">Tier 2: Flagged</div>
                            <div className="my-1">
                                <span className="text-xl font-black text-[#9A6E00]">{flaggedCows.length}</span>
                            </div>
                            <div className="text-[8px] font-bold text-[#B38000]">Local Anomaly</div>
                        </div>

                        {/* Tier 3 */}
                        <div className="bg-red-50 rounded-[18px] p-2.5 border border-red-100 flex flex-col justify-between">
                            <div className="text-[9px] font-extrabold text-red-800 uppercase tracking-wider">Tier 3: Escalated</div>
                            <div className="my-1">
                                <span className="text-xl font-black text-red-600 animate-pulse">{escalatedCows.length}</span>
                            </div>
                            <div className="text-[8px] font-bold text-red-700">Cloud Model</div>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Weather & THI Heat Stress Risk Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <div className="px-1 mb-2 flex justify-between items-center">
                        <h2 className="text-[17px] font-extrabold text-[#113A28] flex items-center gap-2">
                            <ThermometerSun size={18} className="text-[#F29C38]" /> Ambient Thermal Index
                        </h2>
                        <span className="text-[10px] font-black text-[#F29C38] bg-[#FFF4E5] px-2 py-0.5 rounded-full border border-[#FFEBB3]">
                            THI 78 (Moderate Heat Risk)
                        </span>
                    </div>
                    <AdvancedWeatherWidget />
                    <div className="bg-white/80 rounded-[20px] p-3 border border-white mt-2 shadow-xs flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-orange-50 text-[#F29C38] shrink-0 mt-0.5">
                            <ThermometerSun size={16} />
                        </div>
                        <p className="text-[11px] font-medium text-[#6C8576] leading-relaxed">
                            <span className="font-bold text-[#113A28]">Edge Compensation Active:</span> Ambient temperature rises alter individual cow baselines. Tags adjust thresholds locally to prevent false alarms during heat spikes.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
