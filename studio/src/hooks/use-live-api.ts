"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { AudioRecorder } from "@/lib/audio-recorder";
import { AudioStreamer } from "@/lib/audio-streamer";

export type LiveConfig = {
    model: string;
    generationConfig?: {
        responseModalities?: string[];
        speechConfig?: {
            voiceConfig?: {
                prebuiltVoiceConfig?: {
                    voiceName?: string;
                };
            };
        };
    };
    systemInstruction?: {
        parts: { text: string }[];
    };
};

export type ConnectOptions = {
    url: string;
    apiKey?: string;
    accessToken?: string;
};

interface LiveMessagePart {
    inlineData?: {
        data: string;
        mimeType: string;
    };
    text?: string;
}

interface LiveServerContent {
    modelTurn?: {
        parts?: LiveMessagePart[];
    };
}

interface LiveMessage {
    setupComplete?: boolean;
    serverContent?: LiveServerContent;
}

interface LiveSession {
    close: () => void;
    sendRealtimeInput: (input: {
        audio?: { data: string; mimeType: string };
        media?: { data: string; mimeType: string };
    }) => void;
}

export function useLiveApi() {
    const [connected, setConnected] = useState(false);
    const [volume, setVolume] = useState(0);
    const [transcript, setTranscript] = useState<string>("");
    const [isAgentMuted, setIsAgentMuted] = useState(false);
    const isAgentMutedRef = useRef(isAgentMuted);

    useEffect(() => {
        isAgentMutedRef.current = isAgentMuted;
        if (audioStreamerRef.current) {
            audioStreamerRef.current.setMuted(isAgentMuted);
        }
    }, [isAgentMuted]);

    const sessionRef = useRef<LiveSession | null>(null);
    const audioRecorderRef = useRef<AudioRecorder | null>(null);
    const audioStreamerRef = useRef<AudioStreamer | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const cleanupAudio = useCallback(() => {
        if (audioRecorderRef.current) {
            audioRecorderRef.current.stop();
            audioRecorderRef.current = null;
        }
        if (audioStreamerRef.current) {
            audioStreamerRef.current.stop();
            audioStreamerRef.current = null;
        }
        if (videoIntervalRef.current) {
            clearInterval(videoIntervalRef.current);
            videoIntervalRef.current = null;
        }
    }, []);

    const disconnect = useCallback(() => {
        if (sessionRef.current) {
            try {
                sessionRef.current.close();
            } catch {
                // ignore close errors
            }
            sessionRef.current = null;
        }
        cleanupAudio();
        setConnected(false);
        setVolume(0);
        setTranscript("");
    }, [cleanupAudio]);

    const connect = useCallback(
        async (
            config: LiveConfig,
            videoElement: HTMLVideoElement | null,
            auth: ConnectOptions,
            options?: { isVideoEnabled?: boolean }
        ) => {
            if (sessionRef.current) {
                try {
                    sessionRef.current.close();
                } catch {
                    // ignore
                }
                sessionRef.current = null;
            }
            cleanupAudio();

            const apiKey = auth.accessToken || auth.apiKey;
            if (!apiKey) {
                throw new Error("No API key or ephemeral token provided.");
            }

            const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: { apiVersion: "v1alpha" },
            });

            const streamer = new AudioStreamer();
            audioStreamerRef.current = streamer;
            await streamer.resume();

            const sdkConfig: Record<string, unknown> = {};

            if (config.generationConfig?.responseModalities) {
                sdkConfig.responseModalities = config.generationConfig.responseModalities;
            }

            if (config.generationConfig?.speechConfig) {
                sdkConfig.speechConfig = config.generationConfig.speechConfig;
            }

            if (config.systemInstruction) {
                sdkConfig.systemInstruction = config.systemInstruction;
            }

            const session = await ai.live.connect({
                model: config.model,
                config: sdkConfig,
                callbacks: {
                    onopen: () => {},
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onmessage: (msg: any) => {
                        if (msg.setupComplete) {
                            return;
                        }

                        const serverContent = msg.serverContent;
                        if (serverContent?.modelTurn?.parts) {
                            for (const part of serverContent.modelTurn.parts) {
                                if (
                                    part.inlineData?.data &&
                                    part.inlineData?.mimeType?.includes("audio")
                                ) {
                                    try {
                                        const base64 = part.inlineData.data;
                                        const binaryString = atob(base64);
                                        const len = binaryString.length;
                                        const bytes = new Uint8Array(len);
                                        for (let i = 0; i < len; i++) {
                                            bytes[i] = binaryString.charCodeAt(i);
                                        }
                                        const pcm16 = new Int16Array(bytes.buffer);
                                        if (!isAgentMutedRef.current) {
                                            audioStreamerRef.current?.addPCM16(pcm16);
                                        }
                                    } catch (e) {
                                        console.error("[useLiveApi] Error decoding audio:", e);
                                    }
                                }
                                if (part.text) {
                                    const textPart: string = part.text;
                                    setTranscript((prev) => {
                                        const newText = prev ? `${prev} ${textPart}` : textPart;
                                        return newText.length > 2000 ? newText.slice(-2000) : newText;
                                    });
                                }
                            }
                        }
                    },
                    onerror: (e: Event) => {
                        console.error("[useLiveApi] WebSocket error:", e);
                        sessionRef.current = null;
                        setConnected(false);
                    },
                    onclose: () => {
                        sessionRef.current = null;
                        setConnected(false);
                        cleanupAudio();
                    },
                },
            });

            sessionRef.current = session as unknown as LiveSession;
            setConnected(true);

            if (videoElement) {
                videoRef.current = videoElement;
                const stream = videoElement.srcObject as MediaStream;

                if (stream && stream.getAudioTracks().length > 0) {
                    audioRecorderRef.current = new AudioRecorder((pcmData) => {
                        if (!sessionRef.current) return;
                        const bytes = new Uint8Array(
                            pcmData.buffer,
                            pcmData.byteOffset,
                            pcmData.byteLength
                        );
                        let binary = "";
                        for (let i = 0; i < bytes.length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const base64Audio = btoa(binary);

                        try {
                            sessionRef.current?.sendRealtimeInput({
                                audio: {
                                    data: base64Audio,
                                    mimeType: "audio/pcm;rate=16000",
                                },
                            });
                        } catch (e) {
                            console.error("[useLiveApi] Audio send error:", e);
                        }

                        let sum = 0;
                        for (let i = 0; i < pcmData.length; i++) {
                            sum += pcmData[i] * pcmData[i];
                        }
                        const rms = Math.sqrt(sum / pcmData.length);
                        setVolume(Math.min(1, rms / 10000));
                    });

                    await audioRecorderRef.current.start(stream);
                }

                const sendFrame = () => {
                    const video = videoRef.current;
                    if (!video || !sessionRef.current) return;
                    if (options?.isVideoEnabled === false) return;
                    if (video.videoWidth === 0 || video.videoHeight === 0) return;

                    const canvas = document.createElement("canvas");
                    const scale = 0.5;
                    canvas.width = video.videoWidth * scale;
                    canvas.height = video.videoHeight * scale;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob(
                            async (blob) => {
                                if (!blob || !sessionRef.current) return;
                                try {
                                    const arrayBuffer = await blob.arrayBuffer();
                                    const uint8 = new Uint8Array(arrayBuffer);
                                    let binary = "";
                                    for (let i = 0; i < uint8.length; i++) {
                                        binary += String.fromCharCode(uint8[i]);
                                    }
                                    const base64 = btoa(binary);
                                    sessionRef.current?.sendRealtimeInput({
                                        media: {
                                            data: base64,
                                            mimeType: "image/jpeg",
                                        },
                                    });
                                } catch (e) {
                                    console.error("[useLiveApi] Video send error:", e);
                                }
                            },
                            "image/jpeg",
                            0.7
                        );
                    }
                };

                videoIntervalRef.current = setInterval(sendFrame, 1000);
            }
        },
        [cleanupAudio]
    );

    useEffect(() => {
        return () => {
            if (sessionRef.current) {
                try {
                    sessionRef.current.close();
                } catch {
                    // ignore
                }
            }
            cleanupAudio();
        };
    }, [cleanupAudio]);

    return { connect, disconnect, connected, volume, transcript, isAgentMuted, setIsAgentMuted };
}
