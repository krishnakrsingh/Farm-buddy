"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, AlertTriangle, ShieldAlert, ChevronRight, Search, Lock, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHerdState } from "@/lib/useHerdState";

export default function AlertsPage() {
    const router = useRouter();
    const { cows, holdMilk, holdMilkAllEscalated, unhandledEscalated } = useHerdState();
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "escalated" | "flagged">("all");

    const alertCows = cows.filter((c) => c.status !== "normal");

    const filteredAlerts = alertCows.filter((cow) => {
        const matchesFilter = filter === "all" || cow.status === filter;
        const matchesSearch = cow.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              cow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              cow.shed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              cow.breed.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-5 z-10 pb-10">
                {/* Header Section */}
                <header className="flex justify-between items-center bg-transparent">
                    <div>
                        <h1 className="text-2xl font-black text-[#113A28] leading-none flex items-center gap-2">
                            <Bell className="text-[#184F35] w-6 h-6" /> Health Alerts
                        </h1>
                        <p className="text-[11px] font-bold text-[#6C8576] mt-1">
                            Fever warnings & bulk milk tank protection
                        </p>
                    </div>

                    <div className="bg-red-50 text-red-700 text-[10px] font-black px-3 py-1.5 rounded-full shadow-xs border border-red-100 flex items-center gap-1.5 uppercase tracking-wide">
                        <AlertTriangle size={12} className="text-red-500 animate-pulse" /> 
                        {unhandledEscalated.length} High Risk
                    </div>
                </header>

                {/* Batch Action Bar if Unhandled Escalations Exist */}
                {unhandledEscalated.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-600 rounded-[24px] p-4 text-white shadow-md border border-red-500 flex justify-between items-center"
                    >
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-90">Bulk Milk Tank Protection</div>
                            <div className="text-[14px] font-black leading-tight mt-0.5">
                                {unhandledEscalated.length} Cows Require Milk Isolation
                            </div>
                        </div>
                        <button
                            onClick={holdMilkAllEscalated}
                            className="bg-white text-red-700 hover:bg-red-50 text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-[14px] shadow-sm flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
                        >
                            <Lock size={12} /> Isolate All
                        </button>
                    </motion.div>
                )}

                {/* Search Bar */}
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8DA697]" />
                    <input
                        type="text"
                        placeholder="Search by Cow Name, ID, or Breed..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-[20px] bg-white border border-white text-[13px] font-bold text-[#113A28] placeholder-[#8DA697] shadow-[0_8px_24px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-[#184F35]"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter("all")}
                        className={cn(
                            "px-4 py-2 rounded-[16px] text-[11px] font-black tracking-wider uppercase transition-all shadow-xs",
                            filter === "all" ? "bg-[#184F35] text-white" : "bg-white text-[#6C8576] border border-white hover:bg-[#F4F9F4]"
                        )}
                    >
                        All Alerts ({alertCows.length})
                    </button>
                    <button 
                        onClick={() => setFilter("escalated")}
                        className={cn(
                            "px-4 py-2 rounded-[16px] text-[11px] font-black tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5",
                            filter === "escalated" ? "bg-red-600 text-white" : "bg-white text-red-700 border border-red-100 hover:bg-red-50"
                        )}
                    >
                        High Risk ({cows.filter(c => c.status === "escalated").length})
                    </button>
                    <button 
                        onClick={() => setFilter("flagged")}
                        className={cn(
                            "px-4 py-2 rounded-[16px] text-[11px] font-black tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5",
                            filter === "flagged" ? "bg-[#E7A600] text-white" : "bg-white text-[#9A6E00] border border-[#FFEBB3] hover:bg-[#FFF8DF]"
                        )}
                    >
                        Watchlist ({cows.filter(c => c.status === "flagged").length})
                    </button>
                </div>

                {/* Alerts List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredAlerts.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="text-center p-8 bg-white border border-white shadow-xs rounded-[28px] mt-2"
                            >
                                <CheckCircle2 size={32} className="text-[#4CAF50] mx-auto mb-2" />
                                <p className="text-[15px] font-black text-[#113A28]">All Herd Health Clear</p>
                                <p className="text-[12px] font-semibold text-[#6C8576] mt-1">
                                    No cows currently require health isolation.
                                </p>
                            </motion.div>
                        ) : (
                            filteredAlerts.map((cow, i) => {
                                const isEscalated = cow.status === "escalated";
                                const tempDelta = (cow.temp - cow.baseTemp).toFixed(1);

                                return (
                                    <motion.div
                                        key={cow.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white rounded-[28px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-white cursor-pointer hover:shadow-md transition-all"
                                        onClick={() => router.push(`/cow/${cow.id}`)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-xs border text-[18px]",
                                                isEscalated ? "bg-red-50 text-red-600 border-red-100" : "bg-[#FFF8DF] text-[#E7A600] border-[#FFEBB3]"
                                            )}>
                                                🐄
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <h4 className="text-[16px] font-black text-[#113A28] leading-tight flex items-center gap-2">
                                                        {cow.name}
                                                        <span className="text-[10px] font-mono font-bold text-[#8DA697]">(#{cow.id})</span>
                                                        {cow.isLiveHardware && (
                                                            <span className="text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                                                                <Zap size={8} /> Live Smart Collar Tag
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-[#8DA697] bg-[#F4F9F4] px-2 py-0.5 rounded-full border border-[#E9F4EC]">
                                                        {cow.durationMinutes}m ago
                                                    </span>
                                                </div>
                                                <p className={cn(
                                                    "text-[12px] font-extrabold leading-snug mb-1",
                                                    isEscalated ? "text-red-700" : "text-[#9A6E00]"
                                                )}>
                                                    {cow.reason}
                                                </p>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-[#6C8576]">
                                                    <span>{cow.shed}</span>
                                                    <span>Temp: <strong className={isEscalated ? "text-red-600" : "text-[#9A6E00]"}>{cow.temp}°C (+{tempDelta}°C)</strong></span>
                                                    <span>Yield: <strong className="text-[#184F35]">{cow.milkYieldLitersPerDay} L/day</strong></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="mt-3 pt-3 border-t border-[#E9F4EC] flex items-center justify-between">
                                            {cow.heldMilk ? (
                                                <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                                                    <ShieldCheck size={14} /> Milk Isolated from Tank
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        holdMilk(cow.id);
                                                    }}
                                                    className="py-1.5 px-3.5 rounded-full flex items-center justify-center gap-1.5 font-black text-[11px] transition-all bg-red-600 text-white shadow-xs hover:bg-red-700 active:scale-95"
                                                >
                                                    <ShieldAlert size={14} /> Hold Milk Now
                                                </button>
                                            )}

                                            <div className="flex items-center gap-1 text-[11px] font-black text-[#184F35]">
                                                <span>View Health Record</span>
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
