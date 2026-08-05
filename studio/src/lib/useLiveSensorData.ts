"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { database, ref, onValue, isFirebaseConfigured } from "./firebase";

export interface LiveSensorReading {
    cowId: string;
    tagId: string;
    shed: string;
    temp: number;
    hr: number;
    spo2: number;
    activityLevel: number;
    posture: string;
    accelX: number;
    accelY: number;
    accelZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    timestamp: number;
    deviceId: string;
    rssi: number;
    uptimeSeconds: number;
    sendCount: number;
    sensors: {
        max30102: boolean;
        ds18b20: boolean;
        mpu6500: boolean;
    };
}

export interface LiveSensorState {
    liveData: LiveSensorReading | null;
    isHardwareOnline: boolean;
    lastSeen: Date | null;
    connectionLatency: number;
    hardwareHistory: LiveSensorReading[];
    isFirebaseConnected: boolean;
}

const OFFLINE_THRESHOLD_MS = 10000; // 10 seconds without update = offline
const MAX_HISTORY = 60; // Keep last 60 readings (~2 minutes at 2s interval)

export function useLiveSensorData(cowId: string = "014"): LiveSensorState {
    const [liveData, setLiveData] = useState<LiveSensorReading | null>(null);
    const [lastSeen, setLastSeen] = useState<Date | null>(null);
    const [isHardwareOnline, setIsHardwareOnline] = useState(false);
    const [connectionLatency, setConnectionLatency] = useState(0);
    const [hardwareHistory, setHardwareHistory] = useState<LiveSensorReading[]>([]);
    const lastUpdateRef = useRef<number>(0);
    const offlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Check for offline timeout
    const resetOfflineTimer = useCallback(() => {
        if (offlineTimerRef.current) {
            clearTimeout(offlineTimerRef.current);
        }
        setIsHardwareOnline(true);
        offlineTimerRef.current = setTimeout(() => {
            setIsHardwareOnline(false);
        }, OFFLINE_THRESHOLD_MS);
    }, []);

    useEffect(() => {
        if (!isFirebaseConfigured || !database) {
            return;
        }

        const sensorRef = ref(database, `sensors/${cowId}`);
        
        const unsubscribe = onValue(sensorRef, (snapshot) => {
            const data = snapshot.val() as LiveSensorReading | null;
            
            if (data) {
                const now = Date.now();
                const latency = lastUpdateRef.current > 0 ? now - lastUpdateRef.current : 0;
                lastUpdateRef.current = now;

                setLiveData(data);
                setLastSeen(new Date());
                setConnectionLatency(latency);
                resetOfflineTimer();

                // Append to history (with timestamp override for chart X axis)
                setHardwareHistory((prev) => {
                    const updated = [...prev, { ...data, timestamp: now }];
                    return updated.slice(-MAX_HISTORY);
                });
            }
        }, (error) => {
            console.error("[Firebase] Sensor subscription error:", error);
            setIsHardwareOnline(false);
        });

        return () => {
            unsubscribe();
            if (offlineTimerRef.current) {
                clearTimeout(offlineTimerRef.current);
            }
        };
    }, [cowId, resetOfflineTimer]);

    return {
        liveData,
        isHardwareOnline,
        lastSeen,
        connectionLatency,
        hardwareHistory,
        isFirebaseConnected: isFirebaseConfigured,
    };
}
