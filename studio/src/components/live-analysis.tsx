"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLiveApi, ConnectOptions } from "@/hooks/use-live-api";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, AlertCircle, RefreshCw, X, Video, VideoOff, Volume2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(true);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const router = useRouter();

    const { connect, disconnect, connected, volume, transcript } = useLiveApi();

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
        } catch (err) {
            setAuthError("Could not reach auth service.");
            return null;
        }
    }, []);

    useEffect(() => {
        fetchToken();
    }, [fetchToken]);

    const startCamera = useCallback(async (mode = facingMode) => {
        setCameraLoading(true);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setAuthError("Camera access not supported.");
            setCameraLoading(false);
            return;
        }

        try {
            if (videoStream) {
                videoStream.getTracks().forEach((t) => t.stop());
            }

            let stream: MediaStream | null = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: mode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: true,
                });
            } catch (e1) {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
            }

            setVideoStream(stream);
            setCameraLoading(false);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err: any) {
            console.error("Camera error:", err);
            setCameraLoading(false);
            setAuthError("Camera permission denied or not found.");
        }
    }, [facingMode, videoStream]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            startCamera();
        }
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Cleanup video stream on unmount
    useEffect(() => {
        return () => {
            if (videoStream) {
                videoStream.getTracks().forEach((t) => t.stop());
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
            videoTracks.forEach(track => {
                track.enabled = !isVideoEnabled;
            });
            setIsVideoEnabled(!isVideoEnabled);
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
                const config: Parameters<typeof connect>[0] = {
                    model: "models/gemini-2.5-flash-native-audio-latest",
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
                        },
                    },
                    systemInstruction: {
                        parts: [{ text: "आप एक विशेषज्ञ पौधा डॉक्टर हैं। वीडियो स्ट्रीम का विश्लेषण करके पौधों और उनकी स्वास्थ्य समस्याओं की पहचान करें। आपको हमेशा और केवल हिंदी में ही बोलना है। सभी बातचीत हिंदी में होनी चाहिए। भारतीय उच्चारण और भारतीय अंग्रेजी शब्दों का उपयोग करें। संक्षिप्त, मित्रतापूर्ण और सहायक रहें। You are an expert plant doctor. Analyze the video stream to identify plants and their health issues. You must ALWAYS speak ONLY in Hindi language with Indian accent. All conversations must be in Hindi. Use Indian pronunciation and Indian English words when needed. Be concise, friendly, and helpful." }],
                    },
                };
                await connect(config, videoRef.current, connectOpts);
            } catch (err) {
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
        router.push('/');
    };

    // Auto-stop if connection drops
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
                    {/* Back Button */}
                    <Link href="/" className="h-10 w-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/10">
                        <ArrowLeft className="text-white w-5 h-5" />
                    </Link>

                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                        <Volume2 className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium tracking-wide">Live</span>
                        {isStreaming && (
                            <span className="relative flex h-2 w-2 ml-1">
                                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", connected ? "bg-green-400" : "bg-white/50")}></span>
                                <span className={cn("relative inline-flex rounded-full h-2 w-2", connected ? "bg-green-500" : "bg-white/50")}></span>
                            </span>
                        )}
                    </div>

                    <div className="w-10" /> {/* Spacer */}
                </div>
            </div>

            {/* Video Feed */}
            <div className="absolute inset-0 w-full h-full" style={{ opacity: isVideoEnabled ? 1 : 0.2, transition: 'opacity 0.3s ease' }}>
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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <VideoOff className="w-16 h-16 text-white/50" />
                </div>
            )}

            {/* Main Controls - Following Inspiration Image */}
            <div className="absolute bottom-0 left-0 right-0 z-40 pb-8 pt-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center">

                {/* Volume Visualizer */}
                <div className="h-16 flex items-center justify-center mb-6">
                    {connected ? (
                        <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-gradient-to-t from-blue-400 to-indigo-300 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-75"
                                    style={{ height: `${Math.max(12, Math.min(48, volume * 400 * (1 + (Math.random() * 0.2))))}px` }}
                                />
                            ))}
                        </div>
                    ) : isStreaming ? (
                        <Loader2 size={24} className="animate-spin text-white/70" />
                    ) : (
                        <div className="text-white/70 text-sm font-medium">Ready to connect</div>
                    )}
                </div>

                {/* Flip Camera Button - positioned near bottom controls like in image */}
                <div className="w-full px-8 flex justify-end mb-6">
                    <button
                        onClick={toggleCamera}
                        className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/50 transition-all shadow-lg active:scale-95"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Bottom Action Pill */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-2 flex items-center gap-2 sm:gap-4 shadow-2xl">

                    {/* Camera Toggle Button */}
                    <button
                        onClick={toggleVideo}
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-all shadow-md"
                    >
                        {isVideoEnabled ? <Video className="w-6 h-6 sm:w-7 sm:h-7" /> : <VideoOff className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />}
                    </button>

                    {/* Mic Toggle to Start AI */}
                    <button
                        onClick={toggleLive}
                        disabled={!!authError || cameraLoading}
                        className={cn("h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center transition-all shadow-lg mx-1",
                            isStreaming
                                ? "bg-red-500/80 hover:bg-red-600 text-white border border-white/20"
                                : "bg-blue-600 hover:bg-blue-700 text-white")}
                    >
                        {isStreaming ? (
                            <Square className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
                        ) : (
                            <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        )}
                    </button>

                    {/* End Call / Close Button */}
                    <button
                        onClick={endCall}
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
                    >
                        <X className="w-7 h-7 sm:w-8 sm:h-8" />
                    </button>

                </div>
            </div>

            {/* Auth Error Toast */}
            {authError && (
                <div className="absolute top-20 left-4 right-4 z-50">
                    <div className="bg-red-500/90 text-white p-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg border border-red-400/30">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium flex-1">{authError}</span>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-600" onClick={() => window.location.reload()}>
                            <RefreshCw size={14} />
                        </Button>
                    </div>
                </div>
            )}

            {/* Optional Transcript Overlay */}
            {connected && transcript && (
                <div className="absolute top-20 left-4 right-4 z-40 max-w-lg mx-auto pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap text-center">
                            {transcript}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

