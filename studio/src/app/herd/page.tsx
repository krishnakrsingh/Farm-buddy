"use client";

import { Map, AlertTriangle, ChevronRight, Radio, CheckCircle2, ShieldAlert, ShieldCheck, Zap, Heart, Thermometer, Filter } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useHerdState } from "@/lib/useHerdState";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const SHEDS = [
    { id: "Shed 1", label: "Shed 1 (Milking Barn)", count: 320, risk: "high" },
    { id: "Shed 2", label: "Shed 2 (Maternity)", count: 180, risk: "medium" },
    { id: "Shed 3", label: "Shed 3 (Dry Cows)", count: 240, risk: "medium" },
    { id: "Shed 4", label: "Shed 4 (High Yielders)", count: 500, risk: "low" },
];

export default function HerdPage() {
    const [selectedShed, setSelectedShed] = useState("Shed 1");
    const [selectedCowId, setSelectedCowId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<"all" | "alerts" | "healthy">("all");

    const { cows, totalCows, onlineTags, holdMilk, isTankContaminatedRisk } = useHerdState();
    const router = useRouter();

    const filteredCows = cows.filter((c) => c.shed.includes(selectedShed));
    const activeAlerts = filteredCows.filter((c) => c.status !== "normal");
    const healthyCount = filteredCows.filter((c) => c.status === "normal").length;

    const displayedCows = filteredCows.filter((c) => {
        if (filterCategory === "alerts") return c.status !== "normal";
        if (filterCategory === "healthy") return c.status === "normal";
        return true;
    });

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-5 z-10 pb-10">
                {/* Header Section */}
                <header className="flex justify-between items-center bg-transparent">
                    <div>
                        <h1 className="text-2xl font-black text-[#113A28] leading-none flex items-center gap-2">
                            <Map className="text-[#184F35] w-6 h-6" /> Herd Manager
                        </h1>
                        <p className="text-[11px] font-bold text-[#6C8576] mt-1">Live Farm Overview & Milk Tank Safety</p>
                    </div>

                    <div className="bg-white/90 text-[#6C8576] text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-xs border border-[#113A28]/5 flex items-center gap-1.5 tracking-wide">
                        <Radio size={12} className="text-[#4CAF50] animate-pulse" /> {onlineTags} Tags Active
                    </div>
                </header>



                {/* Hero Edge-to-Edge Map Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="relative w-full h-[320px] rounded-[32px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.08)] border-2 border-white"
                >
                    {/* Leaflet Map Canvas */}
                    <MapComponent 
                        selectedNode={selectedCowId} 
                        setSelectedNode={setSelectedCowId} 
                        cows={filteredCows} 
                    />

                    {/* Top Floating Glass Shed Selector */}
                    <div className="absolute top-3 left-3 right-3 z-[500] flex items-center justify-between pointer-events-auto">
                        <div className="flex gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-md border border-white/80 overflow-x-auto no-scrollbar max-w-[80%]">
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
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Map
                        </div>
                    </div>
                </motion.div>

                {/* Cattle Category List & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-3"
                >
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-[17px] font-extrabold text-[#113A28] flex items-center gap-2">
                            {selectedShed} Cattle List ({displayedCows.length})
                        </h2>

                        <div className="flex gap-1 bg-white/70 p-1 rounded-full border border-white">
                            <button
                                onClick={() => setFilterCategory("all")}
                                className={cn("px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase transition-all", filterCategory === "all" ? "bg-[#184F35] text-white" : "text-[#6C8576]")}
                            >
                                All ({filteredCows.length})
                            </button>
                            <button
                                onClick={() => setFilterCategory("alerts")}
                                className={cn("px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase transition-all", filterCategory === "alerts" ? "bg-red-700 text-white" : "text-red-700")}
                            >
                                Alerts ({activeAlerts.length})
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div className="flex flex-col gap-3">
                            {displayedCows.map((cow, i) => {
                                const isEscalated = cow.status === "escalated";
                                const isFlagged = cow.status === "flagged";
                                const isSelected = selectedCowId === cow.id;
                                const tempDelta = (cow.temp - cow.baseTemp).toFixed(1);

                                return (
                                    <motion.div
                                        key={`cow-${cow.id}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.04 * i }}
                                        className={cn(
                                            "bg-white rounded-[24px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-white transition-all space-y-3",
                                            isSelected ? "ring-2 ring-[#184F35] bg-[#F4F9F4]" : ""
                                        )}
                                    >
                                        {/* Cow Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-[48px] h-[48px] rounded-[18px] flex items-center justify-center shrink-0 shadow-xs border text-[18px] font-black",
                                                    isEscalated ? "bg-red-50 text-red-600 border-red-100" : isFlagged ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                )}>
                                                    🐄
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-[16px] font-black text-[#113A28] leading-tight">
                                                            {cow.name} <span className="text-[12px] font-bold text-[#6C8576]">(# {cow.id})</span>
                                                        </h4>
                                                        {cow.isLiveHardware && (
                                                            <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shadow-xs">
                                                                <Zap size={8} /> Live Smart Collar Tag
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-[#6C8576] mt-0.5">
                                                        {cow.breed} • Yield: <span className="text-[#184F35] font-black">{cow.milkYieldLitersPerDay} L/day</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <span className={cn(
                                                "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                                                isEscalated ? "bg-red-100 text-red-800 border border-red-200" : isFlagged ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                            )}>
                                                {isEscalated ? "High Fever Warning" : isFlagged ? "Slight Temperature Spike" : "Healthy"}
                                            </span>
                                        </div>

                                        {/* Human Readable Explanation */}
                                        <div className="bg-[#F8FBF8] rounded-[18px] p-3 border border-[#E9F4EC]">
                                            <p className="text-[12px] font-bold text-[#113A28] leading-snug">
                                                {cow.farmerNotes}
                                            </p>
                                        </div>

                                        {/* Vitals Summary Grid */}
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-[#F4F9F4] rounded-[14px] p-2 border border-[#E0E8E2]">
                                                <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">Body Temp</div>
                                                <div className={cn("text-[15px] font-black leading-none mt-1", isEscalated ? "text-red-600" : "text-[#113A28]")}>
                                                    {cow.temp}°C {Number(tempDelta) > 0 && <span className="text-[10px]">(+{tempDelta}°C)</span>}
                                                </div>
                                            </div>
                                            <div className="bg-[#F4F9F4] rounded-[14px] p-2 border border-[#E0E8E2]">
                                                <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">Heart Rate</div>
                                                <div className="text-[15px] font-black text-[#113A28] leading-none mt-1">
                                                    {cow.hr} <span className="text-[10px] font-bold text-[#6C8576]">bpm</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#F4F9F4] rounded-[14px] p-2 border border-[#E0E8E2]">
                                                <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">Activity</div>
                                                <div className="text-[13px] font-black text-[#113A28] leading-none mt-1 capitalize">
                                                    {cow.posture}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-1">
                                            {cow.status !== "normal" && (
                                                cow.heldMilk ? (
                                                    <div className="flex-1 py-2 px-3 bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 border border-emerald-200">
                                                        <ShieldCheck size={14} /> Milk Isolated from Bulk Tank
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => holdMilk(cow.id)}
                                                        className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                                                    >
                                                        <ShieldAlert size={14} /> Hold Milk from Bulk Tank
                                                    </button>
                                                )
                                            )}

                                            <button
                                                onClick={() => router.push(`/cow/${cow.id}`)}
                                                className="py-2 px-4 bg-[#184F35] hover:bg-[#113A28] text-white rounded-xl text-[11px] font-black transition-colors flex items-center justify-center gap-1 ml-auto shadow-xs"
                                            >
                                                View Health Record <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
