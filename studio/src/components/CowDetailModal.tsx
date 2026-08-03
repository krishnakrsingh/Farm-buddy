"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Thermometer,
  Heart,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Activity,
  Cpu,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { CowReading } from "@/hooks/useHerdData";

interface CowDetailModalProps {
  cow: CowReading | null;
  onClose: () => void;
  onHoldMilk: (cowId: string) => void;
}

export function CowDetailModal({ cow, onClose, onHoldMilk }: CowDetailModalProps) {
  if (!cow) return null;

  const isCrit = cow.statusTier === "critical";
  const isWarn = cow.statusTier === "attention";

  // Mock 48h temp data points for sparkline
  const baseTemp = cow.statusTier === "optimal" ? 38.5 : 38.6;
  const peakTemp = cow.temp;
  const tempPoints = [
    baseTemp - 0.1,
    baseTemp,
    baseTemp + 0.1,
    baseTemp - 0.2,
    baseTemp + 0.2,
    baseTemp + 0.3,
    (baseTemp + peakTemp) / 2,
    peakTemp - 0.3,
    peakTemp,
  ];

  // SVG sparkline calculation
  const minT = 38.0;
  const maxT = 41.5;
  const width = 280;
  const height = 50;
  const pointsString = tempPoints
    .map((val, idx) => {
      const x = (idx / (tempPoints.length - 1)) * width;
      const y = height - ((val - minT) / (maxT - minT)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-[32px] w-full max-w-md p-5 shadow-2xl border border-[#E9F4EC] relative my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F4F9F4] flex items-center justify-center text-[#6C8576] hover:text-[#113A28] transition-colors"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pr-8">
            <div
              className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 border border-white shadow-sm ${
                isCrit
                  ? "bg-red-50 text-red-600"
                  : isWarn
                  ? "bg-[#FFF8DF] text-[#E7A600]"
                  : "bg-[#F4F9F4] text-[#3FA65A]"
              }`}
            >
              <Activity size={24} className={isCrit ? "animate-pulse" : ""} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-black text-[#113A28]">{cow.cowId}</h2>
                <span className="text-[11px] font-bold text-[#6C8576] bg-[#F4F9F4] px-2 py-0.5 rounded-md border border-[#E9F4EC]">
                  {cow.shed}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCrit ? "bg-red-500 animate-pulse" : isWarn ? "bg-[#F5A524]" : "bg-[#3FA65A]"
                  }`}
                />
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isCrit ? "text-red-600" : isWarn ? "text-[#E7A600]" : "text-[#3FA65A]"
                  }`}
                >
                  {cow.statusTier.toUpperCase()} STATUS
                </span>
              </div>
            </div>
          </div>

          {/* Key Vitals Row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#F8FBF8] rounded-[20px] p-3.5 border border-[#E9F4EC] flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-[14px] text-orange-600 shrink-0">
                <Thermometer size={20} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6C8576]">Temp (DS18B20)</span>
                <div className="text-[20px] font-black text-[#113A28] leading-none mt-0.5">
                  {cow.temp}°C
                </div>
                <span className="text-[9px] font-semibold text-[#8DA697]">
                  Z: {cow.baselineZ.temp > 0 ? `+${cow.baselineZ.temp}` : cow.baselineZ.temp}
                </span>
              </div>
            </div>

            <div className="bg-[#F8FBF8] rounded-[20px] p-3.5 border border-[#E9F4EC] flex items-center gap-3">
              <div className="bg-red-50 p-2.5 rounded-[14px] text-red-500 shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6C8576]">HR (MAX30102)</span>
                <div className="text-[20px] font-black text-[#113A28] leading-none mt-0.5">
                  {cow.hr !== null ? `${cow.hr} BPM` : "N/A"}
                </div>
                <span className="text-[9px] font-semibold text-[#8DA697]">
                  {cow.sqiValid ? "SQI Valid ✓" : "SQI Rejected ✕"}
                </span>
              </div>
            </div>
          </div>

          {/* 48H Temperature Trend Sparkline */}
          <div className="bg-[#F8FBF8] rounded-[20px] p-3.5 border border-[#E9F4EC] mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-extrabold text-[#113A28] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#184F35]" /> 48-Hour Core Temp Trend
              </span>
              <span className="text-[10px] font-bold text-[#8DA697]">Peak: {cow.temp}°C</span>
            </div>
            <div className="h-[55px] w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
                <polyline
                  fill="none"
                  stroke={isCrit ? "#E8514A" : isWarn ? "#F5A524" : "#3FA65A"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              </svg>
            </div>
          </div>

          {/* 6-Algorithm Edge Pipeline Breakdown */}
          <div className="bg-[#F4F9F4] rounded-[20px] p-3.5 border border-[#E9F4EC] mb-4 space-y-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Cpu size={14} className="text-[#184F35]" />
              <span className="text-[11px] font-extrabold text-[#184F35] uppercase tracking-wider">
                Edge Pipeline Diagnostics (6 Algos)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-white p-2 rounded-[12px] border border-[#E9F4EC]">
                <span className="text-[#8DA697] font-bold">1. SQI Gate:</span>{" "}
                <span className="font-black text-[#113A28]">{cow.sqiValid ? "PASSED" : "REJECTED"}</span>
              </div>
              <div className="bg-white p-2 rounded-[12px] border border-[#E9F4EC]">
                <span className="text-[#8DA697] font-bold">2/3. Z-Score:</span>{" "}
                <span className="font-black text-[#113A28]">+{cow.baselineZ.temp}σ</span>
              </div>
              <div className="bg-white p-2 rounded-[12px] border border-[#E9F4EC]">
                <span className="text-[#8DA697] font-bold">4. CUSUM Flag:</span>{" "}
                <span className={`font-black ${cow.cusumFlag ? "text-red-600" : "text-[#3FA65A]"}`}>
                  {cow.cusumFlag ? "BREACHED" : "CLEAR"}
                </span>
              </div>
              <div className="bg-white p-2 rounded-[12px] border border-[#E9F4EC]">
                <span className="text-[#8DA697] font-bold">5. Circadian Δ:</span>{" "}
                <span className="font-black text-[#113A28]">+{cow.circadianDeviation}°C</span>
              </div>
            </div>

            {/* Algo 6 Fusion Confidence Bar */}
            <div className="bg-white p-2.5 rounded-[14px] border border-[#E9F4EC] mt-2">
              <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                <span className="text-[#6C8576]">Algo 6: Fusion Confidence Score</span>
                <span className="text-[#113A28] font-black">{Math.round(cow.fusionConfidence * 100)}%</span>
              </div>
              <div className="w-full bg-[#E9F4EC] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isCrit ? "bg-red-500" : isWarn ? "bg-[#F5A524]" : "bg-[#3FA65A]"
                  }`}
                  style={{ width: `${Math.round(cow.fusionConfidence * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cloud Model Reasoning Banner */}
          {cow.category && (
            <div
              className={`rounded-[20px] p-3.5 mb-4 border flex items-start gap-2.5 ${
                isCrit
                  ? "bg-red-50 border-red-200 text-red-900"
                  : "bg-[#FFF8DF] border-[#FFEBB3] text-[#9A6E00]"
              }`}
            >
              <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${isCrit ? "text-red-600" : "text-[#E7A600]"}`} />
              <div>
                <h4 className="font-bold text-[12px]">Cloud Super Model Diagnosis</h4>
                <p className="text-[11px] font-medium leading-tight mt-0.5">{cow.category}</p>
              </div>
            </div>
          )}

          {/* Segregation Status or Action Button */}
          {cow.milkSegregated ? (
            <div className="bg-red-500 text-white rounded-[18px] p-4 text-center border border-red-600 shadow-md flex items-center justify-center gap-2 font-black text-[14px]">
              <Lock size={18} /> MILK SEGREGATED — Tank Valve Locked
            </div>
          ) : (
            <button
              onClick={() => onHoldMilk(cow.cowId)}
              className="w-full py-4 rounded-[18px] flex items-center justify-center gap-2 font-black text-[15px] transition-all shadow-md bg-[#184F35] border border-[#184F35] text-white hover:bg-[#123926] active:scale-95"
            >
              <ShieldAlert className="w-5 h-5 text-red-400" />
              Hold milk — flag for vet check
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
