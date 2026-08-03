"use client";

import { Activity, AlertTriangle, ChevronRight, CheckCircle2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHerdData, CowReading } from "@/hooks/useHerdData";
import { BarnFloorplanMap } from "@/components/BarnFloorplanMap";
import { CowDetailModal } from "@/components/CowDetailModal";

export default function LiveHerdPage() {
    const [viewMode, setViewMode] = useState<"LIVE" | "24H">("LIVE");
    const {
        cows,
        stats,
        activeAlerts,
        activeShed,
        setActiveShed,
        selectedCow,
        selectedCowId,
        setSelectedCowId,
        holdMilk,
    } = useHerdData();

    // Cows in current active shed
    const shedCows = cows.filter((c) => c.shed === activeShed);

    // Risk tier for current active shed (worst tier among cows in shed)
    const hasCritical = shedCows.some((c) => c.statusTier === "critical");
    const hasAttention = shedCows.some((c) => c.statusTier === "attention");

    const shedRiskTier = hasCritical
        ? "HIGH RISK"
        : hasAttention
        ? "MODERATE RISK"
        : "LOW RISK";

    const shedRiskBadgeColor = hasCritical
        ? "bg-red-50 text-red-600 border-red-200"
        : hasAttention
        ? "bg-[#FFF8DF] text-[#E7A600] border-[#FFEBB3]"
        : "bg-[#F4F9F4] text-[#3FA65A] border-[#E9F4EC]";

    return (
        <div className="min-h-screen bg-[#E7F0DE] text-[#1A2E22] pb-36 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-6 z-10 pb-10">
                {/* Header Section */}
                <header className="flex justify-between items-center bg-transparent">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-[#113A28] leading-none flex items-center gap-2">
                            <Activity className="text-[#184F35] w-6 h-6" /> Live Herd
                        </h1>
                    </div>

                    <div className="bg-white/90 text-[#6C8576] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs border border-[#113A28]/5 flex items-center gap-1.5 tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-[#3FA65A] animate-pulse" />
                        {stats.devicesOnline} Active
                    </div>
                </header>

                {/* Main Shed Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white">
                        {/* Shed Selector & Risk Badge Header */}
                        <div className="flex justify-between items-center mb-3 px-1 pt-1">
                            <div className="flex items-center gap-2">
                                <select
                                    value={activeShed}
                                    onChange={(e) => setActiveShed(e.target.value)}
                                    className="text-[18px] font-extrabold text-[#113A28] bg-transparent outline-none cursor-pointer"
                                >
                                    <option value="Shed A">Shed A (400 Cows)</option>
                                    <option value="Shed B">Shed B (350 Cows)</option>
                                    <option value="Shed C">Shed C (250 Cows)</option>
                                </select>
                            </div>

                            {/* LIVE / 24H Toggle */}
                            <div className="flex bg-[#F4F9F4] p-1 rounded-xl border border-[#E9F4EC]">
                                <button
                                    onClick={() => setViewMode("LIVE")}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                                        viewMode === "LIVE"
                                            ? "bg-white text-[#184F35] shadow-xs"
                                            : "text-[#8DA697]"
                                    }`}
                                >
                                    LIVE
                                </button>
                                <button
                                    onClick={() => setViewMode("24H")}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                                        viewMode === "24H"
                                            ? "bg-white text-[#184F35] shadow-xs"
                                            : "text-[#8DA697]"
                                    }`}
                                >
                                    24H
                                </button>
                            </div>
                        </div>

                        {/* Shed Risk Status Chip */}
                        <div className="mb-3 px-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[10px] border inline-block ${shedRiskBadgeColor}`}>
                                {hasCritical ? "🔴" : hasAttention ? "🟡" : "🟢"} {shedRiskTier}
                            </span>
                        </div>

                        {/* Interactive Barn Schematic Map / 24H Trend View */}
                        {viewMode === "LIVE" ? (
                            <BarnFloorplanMap
                                cows={cows}
                                activeShed={activeShed}
                                selectedCowId={selectedCowId}
                                onSelectCow={(id) => setSelectedCowId(id)}
                            />
                        ) : (
                            <div className="h-[250px] w-full rounded-[24px] bg-[#F8FBF8] border-[2px] border-[#E9F4EC] p-4 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-[14px] font-extrabold text-[#113A28] flex items-center gap-1.5">
                                        <TrendingUp size={16} className="text-[#184F35]" /> 24H Herd Anomaly Rate Trend
                                    </h4>
                                    <p className="text-[11px] font-semibold text-[#8DA697] mt-0.5">
                                        1.4% average edge escalation rate over past 24 hours
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span className="text-[#6C8576]">Optimal Baseline</span>
                                        <span className="text-[#3FA65A]">97.8%</span>
                                    </div>
                                    <div className="w-full bg-[#E9F4EC] h-2 rounded-full overflow-hidden">
                                        <div className="bg-[#3FA65A] h-full" style={{ width: "97.8%" }} />
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span className="text-[#6C8576]">Edge Anomaly (Z-Score/CUSUM)</span>
                                        <span className="text-[#E7A600]">1.6%</span>
                                    </div>
                                    <div className="w-full bg-[#E9F4EC] h-2 rounded-full overflow-hidden">
                                        <div className="bg-[#F5A524] h-full" style={{ width: "1.6%" }} />
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span className="text-[#6C8576]">Cloud Confirmed Anomaly</span>
                                        <span className="text-red-600">0.6%</span>
                                    </div>
                                    <div className="w-full bg-[#E9F4EC] h-2 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full" style={{ width: "0.6%" }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Legend Row */}
                        <div className="mt-3 bg-[#F8FBF8] rounded-[20px] p-3 border border-[#E9F4EC] flex justify-between items-center text-[10px] font-bold text-[#6C8576] uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#3FA65A]" /> OPTIMAL
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F5A524]" /> ATTENTION
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#E8514A] animate-pulse" /> CRITICAL
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Active Alerts List Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-3"
                >
                    <div className="px-1 flex justify-between items-end">
                        <h2 className="text-[17px] font-extrabold text-[#113A28]">
                            Active Alerts ({activeAlerts.length})
                        </h2>
                        <span className="text-[11px] font-bold text-[#8DA697]">
                            Real-time Edge Stream
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {activeAlerts.map((cow: CowReading, i: number) => {
                            const isCrit = cow.statusTier === "critical";
                            return (
                                <motion.div
                                    key={`alert-${cow.cowId}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    onClick={() => setSelectedCowId(cow.cowId)}
                                    className="bg-white rounded-[24px] p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-white cursor-pointer hover:shadow-md transition-all flex items-center gap-3 active:scale-[0.98]"
                                >
                                    {/* Circle Icon */}
                                    <div
                                        className={`w-[46px] h-[46px] rounded-[16px] flex items-center justify-center shrink-0 border ${
                                            isCrit
                                                ? "bg-red-50 text-red-600 border-red-100 shadow-[0_4px_12px_rgba(239,68,68,0.1)]"
                                                : "bg-[#FFF8DF] text-[#E7A600] border-[#FFEBB3]"
                                        }`}
                                    >
                                        <AlertTriangle
                                            size={18}
                                            strokeWidth={2.5}
                                            className={isCrit ? "animate-pulse" : ""}
                                        />
                                    </div>

                                    {/* Text Stack */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    isCrit ? "bg-red-500 animate-pulse" : "bg-[#F5A524]"
                                                }`}
                                            />
                                            <h4 className="text-[14px] font-extrabold text-[#113A28] leading-tight truncate">
                                                {cow.shed} – {cow.cowId}
                                            </h4>
                                        </div>
                                        <p className="text-[11px] font-semibold text-[#8DA697] mt-0.5 truncate">
                                            {cow.category || "Baseline deviation detected"} ({cow.temp}°C, {cow.hr ? `${cow.hr} BPM` : "SQI --"})
                                        </p>
                                    </div>

                                    {/* Segregation Tag or Chevron */}
                                    {cow.milkSegregated ? (
                                        <span className="text-[9px] font-black text-white bg-red-500 px-2 py-1 rounded-full uppercase tracking-tight shrink-0">
                                            MILK HELD
                                        </span>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#F4F9F4] flex items-center justify-center text-[#184F35] shrink-0 border border-[#E9F4EC]">
                                            <ChevronRight size={16} />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {activeAlerts.length === 0 && (
                            <div className="text-center p-6 bg-white border border-[#E9F4EC] shadow-sm rounded-[24px]">
                                <CheckCircle2 size={28} className="text-[#3FA65A] mx-auto mb-2" />
                                <p className="text-[14px] font-bold text-[#113A28]">All 1000 Cows Optimal</p>
                                <p className="text-[11px] font-medium text-[#6C8576] mt-1">
                                    Zero CUSUM breaches detected across all sheds.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Cow Detail Modal */}
            {selectedCow && (
                <CowDetailModal
                    cow={selectedCow}
                    onClose={() => setSelectedCowId(null)}
                    onHoldMilk={holdMilk}
                />
            )}
        </div>
    );
}
