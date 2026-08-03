"use client";

import { useState, useEffect, useCallback } from "react";

export interface CowReading {
  cowId: string; // e.g. "COW-014"
  shed: string; // "Shed A", "Shed B", "Shed C"
  temp: number; // in Celsius e.g. 38.6 to 40.8
  hr: number | null; // heart rate in BPM or null if SQI failed
  sqiValid: boolean; // Algo 1 output: Signal Quality Index check passed
  baselineZ: { temp: number; hr: number | null }; // Algo 2/3 output: Z-scores relative to circadian baseline
  cusumFlag: boolean; // Algo 4 output: Cumulative Sum anomaly flag
  circadianDeviation: number; // Algo 5 output: °C deviation from 24h expected curve
  fusionConfidence: number; // Algo 6 output: 0.0 to 1.0 confidence score
  statusTier: "optimal" | "attention" | "critical";
  escalated: boolean; // True if sent to cloud super model
  category: string | null; // Cloud model output e.g. "Sustained temp rise — CUSUM breach"
  lastUpdated: string; // ISO timestamp string
  milkSegregated?: boolean; // Flagged for vet check & milk held
}

export interface HerdStats {
  cowsMonitored: number;
  devicesOnline: number;
  flaggedToday: number;
  escalatedToCloud: number;
}

const ANOMALY_CATEGORIES = [
  "Sustained temp rise — CUSUM breach",
  "Co-occurring temp + HR anomaly",
  "Circadian rhythm phase shift",
  "Heat stress onset (THI > 78)",
  "Post-calving fever indicator",
  "Locomotion/rumination drop alert",
];

// Generate 1000 realistic cows
function generateInitialCows(): CowReading[] {
  const cows: CowReading[] = [];
  const now = new Date().toISOString();

  for (let i = 1; i <= 1000; i++) {
    const padId = String(i).padStart(3, "0");
    const cowId = `COW-${padId}`;
    const shed = i <= 400 ? "Shed A" : i <= 750 ? "Shed B" : "Shed C";

    let statusTier: "optimal" | "attention" | "critical" = "optimal";
    let temp = 38.5 + (Math.random() * 0.4 - 0.2); // ~38.3 - 38.7 °C normal
    let hr: number | null = Math.floor(62 + Math.random() * 8);
    let cusumFlag = false;
    let category: string | null = null;
    let escalated = false;
    let fusionConfidence = 0.12 + Math.random() * 0.2;

    if (cowId === "COW-014") {
      statusTier = "critical";
      temp = 40.4;
      hr = 96;
      cusumFlag = true;
      escalated = true;
      category = "Sustained temp rise — CUSUM breach";
      fusionConfidence = 0.94;
    } else if (cowId === "COW-108") {
      statusTier = "critical";
      temp = 40.1;
      hr = 91;
      cusumFlag = true;
      escalated = true;
      category = "Co-occurring temp + HR anomaly";
      fusionConfidence = 0.89;
    } else if (cowId === "COW-042") {
      statusTier = "attention";
      temp = 39.4;
      hr = 82;
      cusumFlag = true;
      escalated = false;
      category = "Circadian rhythm phase shift";
      fusionConfidence = 0.68;
    } else {
      const rand = Math.random();
      if (rand < 0.015) {
        statusTier = "critical";
        temp = 39.9 + Math.random() * 0.8;
        hr = Math.floor(86 + Math.random() * 12);
        cusumFlag = true;
        escalated = true;
        category = ANOMALY_CATEGORIES[Math.floor(Math.random() * ANOMALY_CATEGORIES.length)];
        fusionConfidence = 0.85 + Math.random() * 0.12;
      } else if (rand < 0.08) {
        statusTier = "attention";
        temp = 39.1 + Math.random() * 0.6;
        hr = Math.floor(75 + Math.random() * 10);
        cusumFlag = Math.random() > 0.5;
        escalated = false;
        category = ANOMALY_CATEGORIES[Math.floor(Math.random() * ANOMALY_CATEGORIES.length)];
        fusionConfidence = 0.55 + Math.random() * 0.25;
      }
    }

    // 2% chance of bad PPG contact (SQI rejection gate)
    const sqiValid = Math.random() > 0.02;
    if (!sqiValid) hr = null;

    const baseTempZ = Number(((temp - 38.5) / 0.3).toFixed(2));
    const baseHrZ = hr ? Number(((hr - 65) / 6.0).toFixed(2)) : null;

    cows.push({
      cowId,
      shed,
      temp: Number(temp.toFixed(1)),
      hr,
      sqiValid,
      baselineZ: { temp: baseTempZ, hr: baseHrZ },
      cusumFlag,
      circadianDeviation: Number((temp - 38.5).toFixed(2)),
      fusionConfidence: Number(fusionConfidence.toFixed(2)),
      statusTier,
      escalated,
      category,
      lastUpdated: now,
      milkSegregated: false,
    });
  }

  return cows;
}

export function useHerdData() {
  const [cows, setCows] = useState<CowReading[]>([]);
  const [selectedCowId, setSelectedCowId] = useState<string | null>(null);
  const [activeShed, setActiveShed] = useState<string>("Shed A");
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const initial = generateInitialCows();
    setCows(initial);
  }, []);

  // Live simulation nudge every 4 seconds + occasional escalation every 24s
  useEffect(() => {
    if (cows.length === 0) return;

    const interval = setInterval(() => {
      setCows((prevCows) => {
        if (!prevCows || prevCows.length === 0) return prevCows;
        const updated = [...prevCows];

        // Pick 5 random cows for micro temperature/HR fluctuations
        for (let i = 0; i < 5; i++) {
          const index = Math.floor(Math.random() * updated.length);
          const cow = { ...updated[index] };

          // Small random walk: -0.1 to +0.1 °C
          const deltaTemp = (Math.random() - 0.5) * 0.1;
          const newTemp = Number(Math.max(38.0, Math.min(41.5, cow.temp + deltaTemp)).toFixed(1));
          cow.temp = newTemp;

          if (cow.hr !== null) {
            const deltaHr = Math.floor((Math.random() - 0.5) * 3);
            cow.hr = Math.max(50, Math.min(120, cow.hr + deltaHr));
          }

          cow.lastUpdated = new Date().toISOString();
          updated[index] = cow;
        }

        return updated;
      });
    }, 4000);

    // Periodic simulation of a new anomaly escalation every 24s
    const escalationInterval = setInterval(() => {
      setCows((prevCows) => {
        if (!prevCows || prevCows.length === 0) return prevCows;
        const updated = [...prevCows];
        
        const optimalCandidates = updated.filter((c) => c.statusTier === "optimal");
        if (optimalCandidates.length === 0) return prevCows;

        const target = optimalCandidates[Math.floor(Math.random() * optimalCandidates.length)];
        const targetIndex = updated.findIndex((c) => c.cowId === target.cowId);

        if (targetIndex !== -1) {
          const isCritical = Math.random() > 0.4;
          const newTier: "attention" | "critical" = isCritical ? "critical" : "attention";
          const newCategory = ANOMALY_CATEGORIES[Math.floor(Math.random() * ANOMALY_CATEGORIES.length)];

          updated[targetIndex] = {
            ...updated[targetIndex],
            statusTier: newTier,
            temp: isCritical ? 40.3 : 39.5,
            hr: isCritical ? 92 : 80,
            cusumFlag: true,
            escalated: isCritical,
            fusionConfidence: isCritical ? 0.92 : 0.65,
            category: newCategory,
            lastUpdated: new Date().toISOString(),
          };

          setLastNotification(`ALERT: ${target.cowId} in ${target.shed} escalated to ${newTier.toUpperCase()} (${newCategory})`);
        }

        return updated;
      });
    }, 24000);

    return () => {
      clearInterval(interval);
      clearInterval(escalationInterval);
    };
  }, [cows.length]);

  // Calculated herd stats
  const stats: HerdStats = {
    cowsMonitored: cows.length,
    devicesOnline: cows.filter((c) => c.sqiValid).length,
    flaggedToday: cows.filter((c) => c.statusTier !== "optimal").length,
    escalatedToCloud: cows.filter((c) => c.escalated).length,
  };

  // Active alerts list (attention & critical cows, sorted critical first)
  const activeAlerts = cows
    .filter((c) => c.statusTier !== "optimal")
    .sort((a, b) => (a.statusTier === "critical" ? -1 : 1));

  // Selected cow object
  const selectedCow = cows.find((c) => c.cowId === selectedCowId) || null;

  // Mark cow for milk segregation
  const holdMilk = useCallback((cowId: string) => {
    setCows((prev) =>
      prev.map((c) =>
        c.cowId === cowId ? { ...c, milkSegregated: true } : c
      )
    );
  }, []);

  // Trigger manual demo anomaly for instant presenter action
  const triggerDemoEscalation = useCallback(() => {
    setCows((prev) => {
      const updated = [...prev];
      const targetIndex = updated.findIndex((c) => c.cowId === "COW-014");
      if (targetIndex !== -1) {
        updated[targetIndex] = {
          ...updated[targetIndex],
          statusTier: "critical",
          temp: 40.6,
          hr: 98,
          cusumFlag: true,
          escalated: true,
          category: "Co-occurring temp + HR anomaly",
          fusionConfidence: 0.97,
          milkSegregated: false,
          lastUpdated: new Date().toISOString(),
        };
      }
      return updated;
    });
    setSelectedCowId("COW-014");
  }, []);

  return {
    cows,
    stats,
    activeAlerts,
    activeShed,
    setActiveShed,
    selectedCow,
    selectedCowId,
    setSelectedCowId,
    holdMilk,
    triggerDemoEscalation,
    lastNotification,
    setLastNotification,
  };
}
