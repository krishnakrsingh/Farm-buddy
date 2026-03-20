"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { AudioRecorder } from "@/lib/audio-recorder";
import { AudioStreamer } from "@/lib/audio-streamer";

/**
 * Configuration for the live session.
 * These fields map directly to the SDK's LiveConnectConfig.
 */
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

export function useLiveApi() {
    const [connected, setConnected] = useState(false);
    const [volume, setVolume] = useState(0);
    const [transcript, setTranscript] = useState<string>("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionRef = useRef<any>(null);
    const audioRecorderRef = useRef<AudioRecorder | null>(null);
    const audioStreamerRef = useRef<AudioStreamer | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup helper
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
                // ignore
            }
            sessionRef.current = null;
        }
        cleanupAudio();
        setConnected(false);
        setVolume(0);
        setTranscript("");
    }, [cleanupAudio]);

    /**
     * Connect to the Gemini Live API using the official @google/genai SDK.
     * The SDK handles WebSocket URL construction, auth, setup message format,
     * and the correct endpoint (BidiGenerateContentConstrained for ephemeral tokens).
     */
    const connect = useCallback(
        async (
            config: LiveConfig,
            videoElement: HTMLVideoElement | null,
            auth: ConnectOptions
        ) => {
            // Disconnect any existing session first
            if (sessionRef.current) {
                try { sessionRef.current.close(); } catch { /* ignore */ }
                sessionRef.current = null;
            }
            cleanupAudio();

            // Determine the API key (either regular API key or ephemeral token)
            const apiKey = auth.accessToken || auth.apiKey;
            if (!apiKey) {
                throw new Error("No API key or ephemeral token provided.");
            }

            // Create a fresh SDK client with the ephemeral token
            // Ephemeral tokens require v1alpha
            const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: { apiVersion: "v1alpha" },
            });

            // Initialize Audio Streamer (for playback of AI responses)
            const streamer = new AudioStreamer();
            audioStreamerRef.current = streamer;
            await streamer.resume();

            // Build the SDK's LiveConnectConfig
            // The SDK expects a flat config (not nested under generationConfig)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sdkConfig: any = {};

            // responseModalities goes at the top level of config
            if (config.generationConfig?.responseModalities) {
                sdkConfig.responseModalities = config.generationConfig.responseModalities;
            }

            // speechConfig goes at the top level of config
            if (config.generationConfig?.speechConfig) {
                sdkConfig.speechConfig = config.generationConfig.speechConfig;
            }

            // systemInstruction goes at the top level of config
            if (config.systemInstruction) {
                sdkConfig.systemInstruction = config.systemInstruction;
            }

            // Use the official SDK's live.connect() — this handles everything:
            // - Correct WebSocket URL (BidiGenerateContentConstrained for ephemeral tokens)
            // - Correct auth parameter (access_token= for ephemeral tokens)
            // - Correct setup message format
            // - v1alpha API version
            const session = await ai.live.connect({
                model: config.model,
                config: sdkConfig,
                callbacks: {
                    onopen: () => {
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onmessage: (msg: any) => {
                        // Handle setup complete
                        if (msg.setupComplete) {
                            return;
                        }

                        // Handle audio responses from AI
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const serverContent = msg.serverContent as any;
                        if (serverContent?.modelTurn?.parts) {
                            for (const part of serverContent.modelTurn.parts) {
                                if (part.inlineData?.data && part.inlineData?.mimeType?.includes("audio")) {
                                    // Decode base64 audio and play it
                                    try {
                                        const base64 = part.inlineData.data;
                                        const binaryString = atob(base64);
                                        const len = binaryString.length;
                                        const bytes = new Uint8Array(len);
                                        for (let i = 0; i < len; i++) {
                                            bytes[i] = binaryString.charCodeAt(i);
                                        }
                                        const pcm16 = new Int16Array(bytes.buffer);
                                        audioStreamerRef.current?.addPCM16(pcm16);
                                    } catch (e) {
                                        console.error("[useLiveApi] Error decoding audio:", e);
                                    }
                                }
                                if (part.text) {
                                    setTranscript((prev) => {
                                        // Append new text, keeping a reasonable history
                                        const newText = prev ? prev + " " + part.text : part.text;
                                        // Limit to last ~2000 characters to prevent memory issues
                                        return newText.length > 2000 ? newText.slice(-2000) : newText;
                                    });
                                }
                            }
                        }
                    },
                    onerror: (e: Event) => {
                        console.error("[useLiveApi] WebSocket error:", e);
                    },
                    onclose: (_e: CloseEvent) => {
                        setConnected(false);
                        cleanupAudio();
                    },
                },
            });

            sessionRef.current = session;
            setConnected(true);

            // Now set up audio/video input streaming
            if (videoElement) {
                videoRef.current = videoElement;
                const stream = videoElement.srcObject as MediaStream;

                if (stream) {
                    // Initialize Audio Recorder — captures mic and sends to Gemini
                    audioRecorderRef.current = new AudioRecorder((pcmData) => {
                        // Convert Int16Array PCM data to base64 string.
                        // The SDK expects { data: base64, mimeType: string }, NOT a browser Blob.
                        const bytes = new Uint8Array(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength);
                        let binary = '';
                        for (let i = 0; i < bytes.length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const base64Audio = btoa(binary);

                        // Use SDK's sendRealtimeInput method
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

                        // Volume meter
                        let sum = 0;
                        for (let i = 0; i < pcmData.length; i++) {
                            sum += pcmData[i] * pcmData[i];
                        }
                        const rms = Math.sqrt(sum / pcmData.length);
                        setVolume(Math.min(1, rms / 10000));
                    });

                    await audioRecorderRef.current.start(stream);
                }

                // Video Frame Loop — send frames at ~1 FPS
                const sendFrame = () => {
                    const video = videoRef.current;
                    if (!video || !sessionRef.current) return;
                    if (video.videoWidth === 0 || video.videoHeight === 0) return;

                    const canvas = document.createElement("canvas");
                    const scale = 0.5;
                    canvas.width = video.videoWidth * scale;
                    canvas.height = video.videoHeight * scale;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob(async (blob) => {
                            if (!blob) return;
                            try {
                                // Convert browser Blob to base64 for the SDK
                                const arrayBuffer = await blob.arrayBuffer();
                                const uint8 = new Uint8Array(arrayBuffer);
                                let binary = '';
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
                        }, "image/jpeg", 0.7);
                    }
                };

                videoIntervalRef.current = setInterval(sendFrame, 1000);
            }
        },
        [cleanupAudio]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sessionRef.current) {
                try { sessionRef.current.close(); } catch { /* ignore */ }
            }
            cleanupAudio();
        };
    }, [cleanupAudio]);

    return { connect, disconnect, connected, volume, transcript };
}
