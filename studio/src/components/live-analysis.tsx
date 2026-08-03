"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLiveApi, ConnectOptions } from "@/hooks/use-live-api";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, AlertCircle, RefreshCw, X, Video, VideoOff, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

type AuthInfo = {
    ephemeralToken?: string;
    authMethod?: "ephemeral-token";
    error?: string;
};

function buildConnectOptions(auth: AuthInfo): ConnectOptions {
    return {
        url: "",
        accessToken: auth.ephemeralToken,
    };
}

export default function LiveAnalysis() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [, setAuthInfo] = useState<AuthInfo | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(true);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const transcriptRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { t } = useLanguage();

    const { connect, disconnect, connected, volume, transcript, isAgentMuted, setIsAgentMuted } = useLiveApi();

    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcript]);

    const fetchToken = useCallback(async (): Promise<AuthInfo | null> => {
        try {
            setAuthError(null);
            const res = await fetch("/api/vertex-auth");
            const contentType = res.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                setAuthError("Auth service returned an unexpected response.");
                return null;
            }
            const data = await res.json();
            if (!res.ok || data.error) {
                setAuthError(data.error || `Auth request failed (${res.status})`);
                return null;
            }
            const info: AuthInfo = { ephemeralToken: data.ephemeralToken, authMethod: data.authMethod };
            setAuthInfo(info);
            return info;
        } catch (err: unknown) {
            console.error("Auth token fetch error:", err);
            setAuthError("Could not reach auth service.");
            return null;
        }
    }, []);

    useEffect(() => {
        fetchToken();
    }, [fetchToken]);

    const startCamera = useCallback(async (mode = facingMode) => {
        setCameraLoading(true);
        setCameraError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError("Camera access not supported on this browser.");
            setIsVideoEnabled(false);
            setCameraLoading(false);
            return;
        }

        try {
            setVideoStream((prevStream) => {
                if (prevStream) {
                    prevStream.getTracks().forEach((track) => track.stop());
                }
                return null;
            });

            let stream: MediaStream | null = null;
            try {
                // First attempt: High quality video + audio
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: mode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: true,
                });
            } catch {
                try {
                    // Second attempt: Basic video + audio
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });
                } catch {
                    // Third attempt: Audio only fallback if camera is blocked/unavailable
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: false,
                        audio: true,
                    });
                    setIsVideoEnabled(false);
                    setCameraError("Camera unavailable. Running in Audio-Only mode.");
                }
            }

            setVideoStream(stream);
            setCameraLoading(false);

            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream;
            }
        } catch (err: unknown) {
            console.error("Camera & Audio error:", err);
            setCameraLoading(false);
            setIsVideoEnabled(false);
            setCameraError("Camera/Microphone permission denied or device not found.");
        }
    }, [facingMode]);

    useEffect(() => {
        startCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (videoStream) {
                videoStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [videoStream]);

    const toggleCamera = () => {
        const newMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newMode);
        startCamera(newMode);
    };

    const toggleVideo = () => {
        if (videoStream) {
            const videoTracks = videoStream.getVideoTracks();
            if (videoTracks.length === 0) {
                // If no video track exists, try restarting camera
                startCamera();
                return;
            }
            const nextState = !isVideoEnabled;
            videoTracks.forEach((track) => {
                track.enabled = nextState;
            });
            setIsVideoEnabled(nextState);
        } else {
            startCamera();
        }
    };

    const toggleLive = async () => {
        if (isStreaming) {
            disconnect();
            setIsStreaming(false);
        } else {
            const currentAuth = await fetchToken();
            if (!currentAuth || !currentAuth.ephemeralToken) return;

            setIsStreaming(true);

            try {
                const connectOpts = buildConnectOptions(currentAuth);

                const langInstruction = `You are an expert plant doctor and farmer friend for Khetsetu. Please strictly follow these rules:
- Always respond ONLY in Hinglish (Hindi written in English letters)
- Keep tone friendly, simple, and farmer-friendly (no heavy jargon)
- Be concise but informative
- If unsure, say "possible issue" instead of guessing confidently
- Focus on what is visible in the video or audio description provided
- Only speak what is asked, nothing extra, no bluff or unnecessary words.`;

                const config: Parameters<typeof connect>[0] = {
                    model: "models/gemini-2.5-flash-native-audio-latest",
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
                        },
                    },
                    systemInstruction: {
                        parts: [{ text: langInstruction }],
                    },
                };
                await connect(config, videoRef.current, connectOpts);
            } catch (err: unknown) {
                console.error("Connection error:", err);
                setIsStreaming(false);
                setAuthError("Failed to connect to AI.");
            }
        }
    };

    const endCall = () => {
        if (isStreaming) {
            disconnect();
            setIsStreaming(false);
        }
        router.push("/");
    };

    const wasConnected = useRef(false);
    useEffect(() => {
        if (connected) wasConnected.current = true;
        else if (wasConnected.current && isStreaming) {
            setIsStreaming(false);
            wasConnected.current = false;
            setAuthError("Connection closed by server.");
        }
    }, [connected, isStreaming]);

    return (
        <div className="w-full h-full relative bg-gray-900 overflow-hidden rounded-none sm:rounded-3xl shadow-2xl">
            {/* Top Navigation & Status */}
            <div className="absolute top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center justify-between p-4">
                    <Link
                        href="/"
                        className="h-10 w-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/10"
                    >
                        <ArrowLeft className="text-white w-5 h-5" />
                    </Link>

                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                        <Volume2 className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium tracking-wide">{t("live")}</span>
                        {isStreaming && (
                            <span className="relative flex h-2 w-2 ml-1">
                                <span
                                    className={cn(
                                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                        connected ? "bg-green-400" : "bg-white/50"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "relative inline-flex rounded-full h-2 w-2",
                                        connected ? "bg-green-500" : "bg-white/50"
                                    )}
                                />
                            </span>
                        )}
                    </div>

                    <div className="w-10" />
                </div>
            </div>

            {/* Video Feed */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{ opacity: isVideoEnabled ? 1 : 0.2, transition: "opacity 0.3s ease" }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                />
            </div>
            {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col gap-2">
                    <VideoOff className="w-16 h-16 text-white/50" />
                    <p className="text-white/60 text-xs font-semibold">Camera Off (Audio Only)</p>
                </div>
            )}

            {/* Main Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-40 pb-8 pt-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center">
                {/* Volume Visualizer */}
                <div className="h-16 flex items-center justify-center mb-6">
                    {connected ? (
                        <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-gradient-to-t from-blue-400 to-indigo-300 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-75"
                                    style={{
                                        height: `${Math.max(
                                            12,
                                            Math.min(48, volume * 400 * (1 + Math.random() * 0.2))
                                        )}px`,
                                    }}
                                />
                            ))}
                        </div>
                    ) : isStreaming ? (
                        <Loader2 size={24} className="animate-spin text-white/70" />
                    ) : (
                        <div className="text-white/70 text-sm font-medium">{t("ready_to_connect")}</div>
                    )}
                </div>

                {/* Flip Camera Button */}
                <div className="w-full px-8 flex justify-end mb-6">
                    <button
                        onClick={toggleCamera}
                        disabled={!isVideoEnabled}
                        className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-all shadow-lg active:scale-95 disabled:opacity-40"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Bottom Action Controls */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-2 flex items-center gap-2 sm:gap-4 shadow-2xl">
                    <button
                        onClick={toggleVideo}
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-all shadow-md active:scale-95"
                        title={isVideoEnabled ? "Turn Off Video" : "Turn On Video"}
                    >
                        {isVideoEnabled ? (
                            <Video className="w-6 h-6 sm:w-7 sm:h-7" />
                        ) : (
                            <VideoOff className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
                        )}
                    </button>

                    <button
                        onClick={toggleLive}
                        disabled={!!authError || cameraLoading}
                        className={cn(
                            "h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center transition-all shadow-lg mx-1 active:scale-95",
                            isStreaming
                                ? "bg-red-500/80 hover:bg-red-600 text-white border border-white/20"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                        title={isStreaming ? "End AI Session" : "Start AI Session"}
                    >
                        {isStreaming ? (
                            <Square className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
                        ) : (
                            <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        )}
                    </button>

                    <button
                        onClick={() => setIsAgentMuted(!isAgentMuted)}
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/5 active:scale-95"
                        title={isAgentMuted ? "Unmute AI" : "Mute AI"}
                    >
                        {isAgentMuted ? (
                            <VolumeX className="w-7 h-7 sm:w-8 sm:h-8 opacity-70" />
                        ) : (
                            <Volume2 className="w-7 h-7 sm:w-8 sm:h-8" />
                        )}
                    </button>

                    <button
                        onClick={endCall}
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/5 active:scale-95"
                        title="Close Scan"
                    >
                        <X className="w-7 h-7 sm:w-8 sm:h-8" />
                    </button>
                </div>
            </div>

            {/* Camera / Hardware Error Notification */}
            {cameraError && (
                <div className="absolute top-20 left-4 right-4 z-50">
                    <div className="bg-amber-500/90 text-white p-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg border border-amber-400/30">
                        <AlertCircle size={20} className="shrink-0" />
                        <span className="text-sm font-medium flex-1">{cameraError}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-xs bg-black/20 hover:bg-black/40 text-white"
                            onClick={() => startCamera()}
                        >
                            <RefreshCw size={14} className="mr-1" /> Retry Camera
                        </Button>
                    </div>
                </div>
            )}

            {/* Auth Error Toast */}
            {authError && (
                <div className="absolute top-36 left-4 right-4 z-50">
                    <div className="bg-red-500/90 text-white p-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg border border-red-400/30">
                        <AlertCircle size={20} className="shrink-0" />
                        <span className="text-sm font-medium flex-1">{authError}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-600 text-white"
                            onClick={() => fetchToken()}
                        >
                            <RefreshCw size={14} />
                        </Button>
                    </div>
                </div>
            )}

            {/* Transcript Overlay */}
            {connected && transcript && (
                <div className="absolute top-20 left-4 right-4 z-40 max-w-lg mx-auto pointer-events-none">
                    <div
                        ref={transcriptRef}
                        className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg max-h-[30vh] overflow-y-auto pointer-events-auto"
                    >
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap text-center">
                            {transcript}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
