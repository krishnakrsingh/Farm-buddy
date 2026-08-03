"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { AdvancedWeatherWidget } from "@/components/AdvancedWeatherWidget";
import { Header } from "@/components/Header";
import { HerdSnapshotCard } from "@/components/HerdSnapshotCard";
import { AssistantCard } from "@/components/AssistantCard";
import { CowDetailModal } from "@/components/CowDetailModal";
import { useLiveApi } from "@/hooks/use-live-api";
import { useLanguage } from "@/lib/LanguageContext";
import { useHerdData } from "@/hooks/useHerdData";

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

    const { language, t } = useLanguage();
    const { connect, disconnect, connected, volume, transcript } = useLiveApi();

    const {
        stats,
        selectedCow,
        setSelectedCowId,
        holdMilk,
        triggerDemoEscalation,
    } = useHerdData();

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
                                text: `You are PashuAI, an expert AI herd health advisor for a 1000-cow dairy operation using ESP32-C3 neck tags (DS18B20 temp + MAX30102 PPG) feeding a 6-algorithm edge pipeline. 
                          You must ONLY speak in ${language.name}. 
                          Be highly concise, actionable, and friendly. 
                          Explain pipeline breaches like Z-score anomalies, CUSUM flags, and milk segregation protocols.`,
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

    const wasConnected = useRef(false);
    useEffect(() => {
        if (connected) wasConnected.current = true;
        else if (wasConnected.current && isStreaming) {
            setIsStreaming(false);
            wasConnected.current = false;
        }
    }, [connected, isStreaming]);

    return (
        <div className="min-h-screen bg-[#E7F0DE] text-[#1A2E22] pb-36 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <video ref={audioRef} autoPlay playsInline muted className="hidden" />

            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-6 z-10 pb-10">
                {/* Header with Herd Manager status & Gateway Modal */}
                <Header userName="Krishna" />

                {/* Weather Updates Section with THI Heat Stress Risk */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="px-1 mb-2">
                        <h2 className="text-[17px] font-extrabold text-[#113A28]">
                            {t("weather_updates")}
                        </h2>
                    </div>
                    <AdvancedWeatherWidget />
                </motion.div>

                {/* New Herd Snapshot Card (1000 Cows, 987 Online, Flagged, Cloud Escalated) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <HerdSnapshotCard
                        stats={stats}
                        onTriggerDemo={triggerDemoEscalation}
                    />
                </motion.div>

                {/* PashuAI Interactive AI Assistant Card */}
                <AssistantCard
                    connected={connected}
                    isStreaming={isStreaming}
                    volume={volume}
                    transcript={transcript}
                    isMicLoading={isMicLoading}
                    authError={authError}
                    onToggleLive={toggleLive}
                />
            </div>

            {/* Cow Detail Modal */}
            {selectedCow && (
                <CowDetailModal
                    cow={selectedCow}
                    onClose={() => setSelectedCowId(null)}
                    onHoldMilk={holdMilk}
                />
            )}
        </div>
    );
}
