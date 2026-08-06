"use client";

import { useState, useEffect } from "react";
import { useLiveSensorData } from "./useLiveSensorData";

export type TierStatus = "normal" | "flagged" | "escalated";

export interface CowData {
    id: string;
    name: string;
    tagId: string;
    breed: string;
    milkYieldLitersPerDay: number;
    ageYears: number;
    lastCalving: string;
    shed: string;
    status: TierStatus;
    temp: number;
    baseTemp: number;
    hr: number;
    baseHr: number;
    spo2: number;
    activityLevel: number;
    posture: string;
    isLiveHardware: boolean;
    reason: string;
    confidence: number;
    category: string;
    durationMinutes: number;
    heldMilk: boolean;
    vetFlagged: boolean;
    farmerNotes: string;
    latOffset: number;
    lngOffset: number;
    featureWeights: { feature: string; weight: number }[];
    telemetryHistory: { time: string; temp: number; hr: number }[];
}

// ONLY OUR REAL HARDWARE COW #014 (LAKSHMI)
const INITIAL_COWS: CowData[] = [
    {
        id: "014",
        name: "Lakshmi",
        tagId: "TAG-8821-A",
        breed: "Gir Cattle (Purebred)",
        milkYieldLitersPerDay: 28.5,
        ageYears: 3.5,
        lastCalving: "2 months ago",
        shed: "Shed 1 (Milking Barn)",
        status: "normal",
        temp: 38.5,
        baseTemp: 38.5,
        hr: 74,
        baseHr: 62,
        spo2: 98.2,
        activityLevel: 0.1,
        posture: "standing",
        isLiveHardware: false,
        reason: "Real Hardware Telemetry Connected",
        confidence: 99,
        category: "Live Hardware Cattle Monitoring",
        durationMinutes: 0,
        heldMilk: false,
        vetFlagged: false,
        farmerNotes: "Live Smart Ear Tag connected. Real-time body temperature, heart rate, and movement tracked live from ESP32 sensor hardware.",
        latOffset: 0.00000,
        lngOffset: 0.00000,
        featureWeights: [
            { feature: "Live Core Body Temperature", weight: 50 },
            { feature: "Live Pulse & Heart Rate", weight: 30 },
            { feature: "3D Motion & Activity Index", weight: 20 },
        ],
        telemetryHistory: [
            { time: "04:00", temp: 38.5, hr: 62 },
            { time: "08:00", temp: 38.5, hr: 64 },
            { time: "12:00", temp: 38.6, hr: 68 },
            { time: "16:00", temp: 38.5, hr: 72 },
            { time: "20:00", temp: 38.5, hr: 74 },
            { time: "Now", temp: 38.5, hr: 74 },
        ],
    },
];

export function useHerdState() {
    const [cows, setCows] = useState<CowData[]>(INITIAL_COWS);
    const [lastSync, setLastSync] = useState<Date>(new Date());

    // Live Smart Tag sensor data for Cow #014 (Lakshmi)
    const {
        liveData,
        isHardwareOnline,
        lastSeen,
        hardwareHistory,
        isConnectedViaUSB,
        isWebSerialSupported,
        connectUSBSerial,
        disconnectUSBSerial,
    } = useLiveSensorData("014");

    // Overlay 100% REAL hardware data onto Cow #014 (Lakshmi)
    useEffect(() => {
        if (isHardwareOnline && liveData) {
            setLastSync(new Date());
            setCows((prevCows) =>
                prevCows.map((cow) => {
                    if (cow.id === "014") {
                        const tempRise = (liveData.temp - 38.5).toFixed(1);
                        const isFever = liveData.temp > 39.5;
                        const isWarning = liveData.temp > 38.9;
                        const status: TierStatus = isFever ? "escalated" : isWarning ? "flagged" : "normal";

                        return {
                            ...cow,
                            temp: liveData.temp,
                            hr: liveData.hr,
                            spo2: liveData.spo2 || 98.2,
                            activityLevel: liveData.activityLevel,
                            posture: liveData.posture,
                            isLiveHardware: true,
                            status,
                            reason: isFever 
                                ? `Fever Spike (+${tempRise}°C above normal baseline)` 
                                : isWarning 
                                    ? `Slight Temperature Rise (+${tempRise}°C)` 
                                    : "Normal Healthy Baseline",
                            farmerNotes: isFever
                                ? `Live sensor detected body temp spike to ${liveData.temp}°C (+${tempRise}°C above normal). Withhold milk from bulk tank.`
                                : isWarning
                                    ? `Live sensor detected mild body temp rise to ${liveData.temp}°C (+${tempRise}°C). Monitor closely.`
                                    : `All real-time vital signs normal. Core Body Temp: ${liveData.temp}°C • Heart Rate: ${liveData.hr} bpm • Posture: ${liveData.posture}.`,
                        };
                    }
                    return cow;
                })
            );
        } else {
            setCows((prevCows) =>
                prevCows.map((cow) => ({ ...cow, isLiveHardware: false }))
            );
        }
    }, [isHardwareOnline, liveData]);

    const holdMilk = (cowId: string) => {
        setCows((prev) =>
            prev.map((c) => (c.id === cowId ? { ...c, heldMilk: true } : c))
        );
    };

    const flagVet = (cowId: string) => {
        setCows((prev) =>
            prev.map((c) => (c.id === cowId ? { ...c, vetFlagged: true } : c))
        );
    };

    const holdMilkAllEscalated = () => {
        setCows((prev) =>
            prev.map((c) => (c.status === "escalated" ? { ...c, heldMilk: true } : c))
        );
    };

    const totalCows = 1;
    const onlineTags = isHardwareOnline ? 1 : 0;
    const escalatedCows = cows.filter((c) => c.status === "escalated");
    const flaggedCows = cows.filter((c) => c.status === "flagged");
    const unhandledEscalated = escalatedCows.filter((c) => !c.heldMilk);
    const isTankContaminatedRisk = unhandledEscalated.length > 0;

    return {
        cows,
        totalCows,
        onlineTags,
        escalatedCows,
        flaggedCows,
        unhandledEscalated,
        isTankContaminatedRisk,
        isHardwareOnline,
        hardwareLastSeen: lastSeen,
        hardwareHistory,
        isConnectedViaUSB,
        isWebSerialSupported,
        connectUSBSerial,
        disconnectUSBSerial,
        lastSync,
        simTick: 0,
        holdMilk,
        flagVet,
        holdMilkAllEscalated,
    };
}
