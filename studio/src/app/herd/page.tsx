"use client";

import { Map, AlertTriangle, ChevronRight, Radio, CheckCircle2, ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useHerdState } from "@/lib/useHerdState";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const SHEDS = [
    { id: "Shed 1", label: "Shed 1 (Milking)", risk: "high" },
    { id: "Shed 2", label: "Shed 2 (Maternity)", risk: "medium" },
    { id: "Shed 3", label: "Shed 3 (Dry)", risk: "medium" },
    { id: "Shed 4", label: "Shed 4 (High Yield)", risk: "low" },
];

export default function HerdPage() {
    const [selectedShed, setSelectedShed] = useState("Shed 1");
    const [selectedCowId, setSelectedCowId] = useState<string | null>(null);
    const { cows, onlineTags } = useHerdState();
    const router = useRouter();

    const filteredCows = cows.filter((c) => c.shed.includes(selectedShed));
    const activeAlerts = filteredCows.filter((c) => c.status !== "normal");

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-5 z-10 pb-10">
                {/* Header Section */}
                <header className="flex justify-between items-center bg-transparent">
                    <div>
                        <h1 className="text-2xl font-black text-[#113A28] leading-none flex items-center gap-2">
                            <Map className="text-[#184F35] w-6 h-6" /> Live Herd Map
                        </h1>
                        <p className="text-[11px] font-bold text-[#6C8576] mt-1">Real-time edge telemetry map</p>
                    </div>

                    <div className="bg-white/90 text-[#6C8576] text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-xs border border-[#113A28]/5 flex items-center gap-1.5 tracking-wide">
                        <Radio size={12} className="text-[#4CAF50] animate-pulse" /> {onlineTags} Online
                    </div>
                </header>

                {/* Hero Edge-to-Edge Map Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-[360px] rounded-[32px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.08)] border-2 border-white"
                >
                    {/* Leaflet Map Canvas */}
                    <MapComponent 
                        selectedNode={selectedCowId} 
                        setSelectedNode={setSelectedCowId} 
                        cows={filteredCows} 
                    />

                    {/* Top Floating Glass Shed Selector */}
                    <div className="absolute top-3 left-3 right-3 z-[500] flex items-center justify-between pointer-events-auto">
                        <div className="flex gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-md border border-white/80 overflow-x-auto no-scrollbar max-w-[78%]">
                            {SHEDS.map((shed) => {
                                const isSelected = selectedShed === shed.id;
                                return (
                                    <button
                                        key={shed.id}
                                        onClick={() => {
                                            setSelectedShed(shed.id);
                                            setSelectedCowId(null);
                                        }}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5",
                                            isSelected
                                                ? "bg-[#184F35] text-white shadow-xs"
                                                : "text-[#6C8576] hover:bg-white/60"
                                        )}
                                    >
                                        <span>{shed.id}</span>
                                        {shed.risk === "high" && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                        {shed.risk === "medium" && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                                        {shed.risk === "low" && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="bg-[#184F35]/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full shadow-md text-[9px] font-black uppercase tracking-widest border border-white/40 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                        </div>
                    </div>

                    {/* Bottom Floating Glass 3-Tier Legend Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 z-[500] pointer-events-none flex justify-center">
                        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/80 flex items-center justify-around text-[9px] font-black text-[#113A28] uppercase tracking-wider w-full max-w-[95%]">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" /> Tier 1: Normal
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F9A825]" /> Tier 2: Flagged
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#C62828] animate-pulse" /> Tier 3: Escalated
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Active Zone Anomalies Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-3"
                >
                    <div className="px-1 flex justify-between items-end">
                        <div>
                            <h2 className="text-[17px] font-extrabold text-[#113A28]">
                                {selectedShed} Anomalies ({activeAlerts.length})
                            </h2>
                        </div>
                        {selectedCowId && (
                            <button
                                onClick={() => setSelectedCowId(null)}
                                className="text-[10px] font-black text-[#6C8576] hover:text-[#184F35] uppercase tracking-wider"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div className="flex flex-col gap-3">
                            {activeAlerts.map((cow, i) => {
                                const isEscalated = cow.status === "escalated";
                                const isSelected = selectedCowId === cow.id;
                                const tempDelta = (cow.temp - cow.baseTemp).toFixed(1);

                                return (
                                    <motion.div
                                        key={`alert-${cow.id}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                        onClick={() => router.push(`/cow/${cow.id}`)}
                                        className={cn(
                                            "bg-white rounded-[24px] p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-white cursor-pointer hover:shadow-md transition-all flex items-center gap-3",
                                            isSelected ? "ring-2 ring-[#184F35] bg-[#F4F9F4]" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-[48px] h-[48px] rounded-[18px] flex items-center justify-center shrink-0 shadow-xs border",
                                            isEscalated ? "bg-red-50 text-red-600 border-red-100" : "bg-[#FFF8DF] text-[#E7A600] border-[#FFEBB3]"
                                        )}>
                                            <AlertTriangle size={20} strokeWidth={2.5} className={isEscalated ? "animate-pulse" : ""} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-[15px] font-black text-[#113A28] leading-tight flex items-center gap-2">
                                                    Cow #{cow.id}
                                                    <span className="text-[10px] font-black text-[#6C8576] font-mono">{cow.tagId}</span>
                                                    {cow.isLiveHardware && (
                                                        <span className="text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                                                            <Zap size={8} /> USB UART LIVE
                                                        </span>
                                                    )}
                                                </h4>
                                                <span className="text-[10px] font-bold text-[#8DA697]">{cow.durationMinutes}m ago</span>
                                            </div>

                                            <p className={cn(
                                                "text-[12px] font-extrabold truncate",
                                                isEscalated ? "text-red-700" : "text-[#9A6E00]"
                                            )}>
                                                {cow.reason}
                                            </p>

                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] font-extrabold text-[#6C8576]">
                                                    Temp: <span className={isEscalated ? "text-red-600" : "text-[#9A6E00]"}>{cow.temp}°C (+{tempDelta}°C)</span>
                                                </span>
                                                <span className="text-[10px] font-extrabold text-[#6C8576]">
                                                    HR: <span className="text-[#113A28]">{cow.hr} bpm</span>
                                                </span>
                                                {cow.isLiveHardware && (
                                                    <span className="text-[10px] font-extrabold text-[#6C8576]">
                                                        SpO2: <span className="text-blue-600">{cow.spo2?.toFixed(1)}%</span>
                                                    </span>
                                                )}

                                                {cow.heldMilk ? (
                                                    <span className="ml-auto text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <ShieldCheck size={10} /> Milk Held
                                                    </span>
                                                ) : (
                                                    <span className="ml-auto text-[9px] font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <ShieldAlert size={10} /> Isolation Needed
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-8 h-8 rounded-full bg-[#F4F9F4] flex items-center justify-center text-[#184F35] shrink-0 border border-[#E9F4EC]">
                                            <ChevronRight size={16} />
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {activeAlerts.length === 0 && (
                                <div className="text-center p-6 bg-white border border-[#E9F4EC] shadow-xs rounded-[24px]">
                                    <CheckCircle2 size={28} className="text-[#4CAF50] mx-auto mb-2" />
                                    <p className="text-[14px] font-black text-[#113A28]">All Clear in {selectedShed}</p>
                                    <p className="text-[11px] font-semibold text-[#6C8576] mt-1">
                                        All cows in this zone are currently within baseline parameters.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
