"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { AdvancedWeatherWidget } from "@/components/AdvancedWeatherWidget";
import { Header } from "@/components/Header";
import { AssistantCard } from "@/components/AssistantCard";
import { useLiveApi } from "@/hooks/use-live-api";
import { useLanguage } from "@/lib/LanguageContext";

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
                                text: `You are an expert AI agriculture assistant for Khetsetu. 
                          You must ONLY speak in the ${language.name} language. 
                          Always communicate in ${language.name} (${language.native}). 
                          Be highly concise, friendly, and practical. 
                          Provide helpful farming advice, weather tips, and crop health information.`,
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
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <video ref={audioRef} autoPlay playsInline muted className="hidden" />

            <div className="max-w-md mx-auto relative pt-10 px-5 space-y-7 z-10 pb-10">
                {/* Header with Language Selector */}
                <Header userName="krishna" />

                {/* Weather Widget Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="px-1 mb-2">
                        <h2 className="text-[17px] font-extrabold text-[#113A28]">
                            {t("weather_updates")}
                        </h2>
                    </div>
                    <AdvancedWeatherWidget />
                </motion.div>

                {/* Dr. Farm AI Interactive Voice Assistant Card */}
                <AssistantCard
                    connected={connected}
                    volume={volume}
                    transcript={transcript}
                    isMicLoading={isMicLoading}
                    authError={authError}
                />
            </div>
        </div>
    );
}
