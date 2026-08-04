"use client";

import { useState, useEffect } from "react";

export type TierStatus = "normal" | "flagged" | "escalated";

export interface CowData {
    id: string;
    tagId: string;
    shed: string;
    status: TierStatus;
    temp: number;
    baseTemp: number;
    hr: number;
    baseHr: number;
    reason: string;
    confidence: number;
    category: string;
    durationMinutes: number;
    heldMilk: boolean;
    vetFlagged: boolean;
    latOffset: number;
    lngOffset: number;
    featureWeights: { feature: string; weight: number }[];
    telemetryHistory: { time: string; temp: number; hr: number }[];
}

const INITIAL_COWS: CowData[] = [
    {
        id: "014",
        tagId: "TAG-8821-A",
        shed: "Shed 1 (Milking Barn)",
        status: "escalated",
        temp: 40.3,
        baseTemp: 38.5,
        hr: 88,
        baseHr: 62,
        reason: "Sustained temp rise + elevated HR (>4h)",
        confidence: 94,
        category: "Clinical Mastitis / Early Systemic Infection",
        durationMinutes: 48,
        heldMilk: false,
        vetFlagged: false,
        latOffset: -0.00002,
        lngOffset: 0.00001,
        featureWeights: [
            { feature: "Temp Deviation vs Baseline (+1.8°C)", weight: 62 },
            { feature: "Heart Rate Anomaly Trend (+26 bpm)", weight: 28 },
            { feature: "Rumination Activity Drop (-40%)", weight: 10 },
        ],
        telemetryHistory: [
            { time: "04:00", temp: 38.5, hr: 61 },
            { time: "08:00", temp: 38.6, hr: 63 },
            { time: "12:00", temp: 39.1, hr: 70 },
            { time: "16:00", temp: 39.7, hr: 78 },
            { time: "20:00", temp: 40.1, hr: 85 },
            { time: "Now", temp: 40.3, hr: 88 },
        ],
    },
    {
        id: "289",
        tagId: "TAG-4412-B",
        shed: "Shed 3 (Dry Cows)",
        status: "escalated",
        temp: 40.1,
        baseTemp: 38.4,
        hr: 84,
        baseHr: 60,
        reason: "Abnormal movement pattern + heat stress delta",
        confidence: 89,
        category: "Severe Heat Stress / Dehydration Anomaly",
        durationMinutes: 80,
        heldMilk: false,
        vetFlagged: false,
        latOffset: 0.00004,
        lngOffset: 0.00002,
        featureWeights: [
            { feature: "Thermal Index Spike (+1.7°C)", weight: 55 },
            { feature: "Resting Time Deficit (-3.5 hrs)", weight: 35 },
            { feature: "Respiration Estimate (+30%)", weight: 10 },
        ],
        telemetryHistory: [
            { time: "04:00", temp: 38.4, hr: 60 },
            { time: "08:00", temp: 38.5, hr: 62 },
            { time: "12:00", temp: 39.0, hr: 69 },
            { time: "16:00", temp: 39.6, hr: 76 },
            { time: "20:00", temp: 39.9, hr: 81 },
            { time: "Now", temp: 40.1, hr: 84 },
        ],
    },
    {
        id: "812",
        tagId: "TAG-9903-[#]",
        shed: "Shed 2 (Maternity)",
        status: "escalated",
        temp: 39.9,
        baseTemp: 38.6,
        hr: 82,
        baseHr: 64,
        reason: "Pre-calving fever pattern detected",
        confidence: 87,
        category: "Acute Metritis Suspected",
        durationMinutes: 32,
        heldMilk: false,
        vetFlagged: false,
        latOffset: -0.00003,
        lngOffset: -0.00003,
        featureWeights: [
            { feature: "Circadian Temp Threshold Breach", weight: 58 },
            { feature: "HR Baseline Elevation (+18 bpm)", weight: 30 },
            { feature: "Feed Bunk Attendance Drop", weight: 12 },
        ],
        telemetryHistory: [
            { time: "04:00", temp: 38.6, hr: 64 },
            { time: "08:00", temp: 38.7, hr: 65 },
            { time: "12:00", temp: 39.0, hr: 71 },
            { time: "16:00", temp: 39.4, hr: 75 },
            { time: "20:00", temp: 39.7, hr: 79 },
            { time: "Now", temp: 39.9, hr: 82 },
        ],
    },
    {
        id: "015",
        tagId: "TAG-8822-A",
        shed: "Shed 1 (Milking Barn)",
        status: "flagged",
        temp: 39.3,
        baseTemp: 38.5,
        hr: 72,
        baseHr: 62,
        reason: "Edge sensor: minor temp spike (+0.8°C)",
        confidence: 76,
        category: "On-Device Baseline Watchlist",
        durationMinutes: 14,
        heldMilk: false,
        vetFlagged: false,
        latOffset: -0.00001,
        lngOffset: -0.00001,
        featureWeights: [
            { feature: "Edge CUSUM Threshold Trigger", weight: 80 },
            { feature: "Slight Movement Reduction", weight: 20 },
        ],
        telemetryHistory: [
            { time: "04:00", temp: 38.5, hr: 62 },
            { time: "08:00", temp: 38.6, hr: 63 },
            { time: "12:00", temp: 38.7, hr: 64 },
            { time: "16:00", temp: 38.9, hr: 67 },
            { time: "20:00", temp: 39.1, hr: 70 },
            { time: "Now", temp: 39.3, hr: 72 },
        ],
    },
    {
        id: "441",
        tagId: "TAG-1192-C",
        shed: "Shed 4 (High Yielders)",
        status: "flagged",
        temp: 39.2,
        baseTemp: 38.4,
        hr: 74,
        baseHr: 61,
        reason: "Edge sensor: Heart rate elevated",
        confidence: 71,
        category: "On-Device Baseline Watchlist",
        durationMinutes: 8,
        heldMilk: false,
        vetFlagged: false,
        latOffset: 0.00003,
        lngOffset: -0.00002,
        featureWeights: [
            { feature: "Heart Rate Variance Anomaly", weight: 75 },
            { feature: "Ambient Temp Stress Co-factor", weight: 25 },
        ],
        telemetryHistory: [
            { time: "04:00", temp: 38.4, hr: 61 },
            { time: "08:00", temp: 38.5, hr: 62 },
            { time: "12:00", temp: 38.6, hr: 64 },
            { time: "16:00", temp: 38.8, hr: 68 },
            { time: "20:00", temp: 39.0, hr: 71 },
            { time: "Now", temp: 39.2, hr: 74 },
        ],
    },
    {
        id: "012",
        tagId: "TAG-8820-A",
        shed: "Shed 1 (Milking Barn)",
        status: "normal",
        temp: 38.5,
        baseTemp: 38.5,
        hr: 61,
        baseHr: 61,
        reason: "Normal individual baseline",
        confidence: 99,
        category: "Healthy",
        durationMinutes: 0,
        heldMilk: false,
        vetFlagged: false,
        latOffset: 0.00001,
        lngOffset: -0.00002,
        featureWeights: [],
        telemetryHistory: [],
    },
    {
        id: "013",
        tagId: "TAG-8820-B",
        shed: "Shed 1 (Milking Barn)",
        status: "normal",
        temp: 38.6,
        baseTemp: 38.6,
        hr: 63,
        baseHr: 63,
        reason: "Normal individual baseline",
        confidence: 99,
        category: "Healthy",
        durationMinutes: 0,
        heldMilk: false,
        vetFlagged: false,
        latOffset: 0.00002,
        lngOffset: 0.00003,
        featureWeights: [],
        telemetryHistory: [],
    },
];

export function useHerdState() {
    const [cows, setCows] = useState<CowData[]>(INITIAL_COWS);
    const [lastSync, setLastSync] = useState<Date>(new Date());
    const [simTick, setSimTick] = useState(0);

    // Live micro-simulation (fluctuates heart rate & temps slightly every 3 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            setLastSync(new Date());
            setSimTick((prev) => prev + 1);
            setCows((prevCows) =>
                prevCows.map((cow) => {
                    const tempJitter = (Math.random() - 0.5) * 0.04;
                    const hrJitter = Math.floor((Math.random() - 0.5) * 2);
                    return {
                        ...cow,
                        temp: Number((cow.temp + tempJitter).toFixed(1)),
                        hr: Math.max(50, cow.hr + hrJitter),
                    };
                })
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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

    const totalCows = 1240;
    const onlineTags = 1238;
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
        lastSync,
        simTick,
        holdMilk,
        flagVet,
        holdMilkAllEscalated,
    };
}
