"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Thermometer, Activity, CloudLightning, ShieldAlert, Check, Stethoscope, AlertTriangle, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";
import { useHerdState } from "@/lib/useHerdState";

export default function CowDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const cowId = resolvedParams.id;
    const { cows, holdMilk, flagVet } = useHerdState();

    const cow = cows.find((c) => c.id === cowId) || cows[0];
    const isEscalated = cow.status === "escalated";
    const tempDelta = (cow.temp - cow.baseTemp).toFixed(1);

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-6 z-10 pb-10">
                {/* Top Header */}
                <header className="flex justify-between items-center bg-transparent">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs border border-[#E9F4EC] hover:bg-[#F4F9F4] transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#184F35]" />
                    </button>
                    
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-[#113A28] leading-none">
                                Cow #{cow.id}
                            </h1>
                            <span className="text-[10px] font-mono font-extrabold text-[#6C8576] bg-white px-2 py-0.5 rounded-full border border-[#E9F4EC]">
                                {cow.tagId}
                            </span>
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full",
                            isEscalated ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        )}>
                            {isEscalated ? "Tier 3: Escalated to Cloud" : "Tier 2: Flagged on Edge"}
                        </span>
                    </div>

                    <div className="w-10 h-10" />
                </header>

                {/* Bulk Milk Tank Protection Status Banner (The Stakes!) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "rounded-[28px] p-4 border transition-all shadow-md relative overflow-hidden",
                        cow.heldMilk
                            ? "bg-[#184F35] text-white border-[#184F35]"
                            : "bg-red-600 text-white border-red-500 animate-pulse"
                    )}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-sm",
                                cow.heldMilk ? "bg-emerald-800 text-emerald-200" : "bg-white text-red-600"
                            )}>
                                {cow.heldMilk ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                    Bulk Tank Protection
                                </div>
                                <h3 className="text-[16px] font-black leading-tight mt-0.5">
                                    {cow.heldMilk 
                                        ? "TANK SECURED — Milk Withheld" 
                                        : "HIGH RISK — Hold Milk Immediately"}
                                </h3>
                                <p className="text-[11px] font-medium opacity-90 mt-1 leading-snug">
                                    {cow.heldMilk 
                                        ? "This cow's milk supply valve is locked. Pooled farm tank contamination is 100% prevented."
                                        : "Unfiltered milk from this animal risks contaminating the 10,000L farm tank!"}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Cloud Model Reasoning & Explainability Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-[32px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-[14px] bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                                <CloudLightning size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-extrabold text-[#113A28]">
                                    Cloud Model Classification
                                </h3>
                                <p className="text-[11px] font-bold text-red-700">
                                    {cow.confidence}% Confidence Rating
                                </p>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-red-100 text-red-800 px-2.5 py-1 rounded-full">
                            Category 4 Alert
                        </span>
                    </div>

                    <div className="bg-[#F8FBF8] rounded-[20px] p-3.5 border border-[#E9F4EC]">
                        <div className="text-[10px] font-black text-[#6C8576] uppercase tracking-wider mb-0.5">Suspected Health Category</div>
                        <div className="text-[15px] font-black text-[#113A28]">{cow.category}</div>
                        <p className="text-[12px] font-medium text-[#6C8576] mt-1.5 leading-relaxed">
                            {cow.reason}. On-device edge sensor detected individual baseline departure. Cloud neural model confirms high-confidence anomaly requiring immediate isolation.
                        </p>
                    </div>

                    {/* Feature Attribution Breakdown */}
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-[#6C8576] mb-2">
                            Model Feature Weights (Why Flagged)
                        </h4>
                        <div className="space-y-2">
                            {cow.featureWeights.map((fw, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold text-[#113A28]">
                                        <span>{fw.feature}</span>
                                        <span>{fw.weight}%</span>
                                    </div>
                                    <div className="w-full bg-[#E9F4EC] h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-[#184F35] h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${fw.weight}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div className="space-y-2.5 pt-2">
                        {!cow.heldMilk ? (
                            <button 
                                onClick={() => holdMilk(cow.id)}
                                className="w-full py-4 rounded-[20px] flex items-center justify-center gap-2 font-black text-[15px] transition-all shadow-[0_8px_24px_rgba(239,68,68,0.3)] bg-red-600 text-white hover:bg-red-700 active:scale-95"
                            >
                                <Lock size={18} /> Hold Milk & Lock Valve
                            </button>
                        ) : (
                            <div className="w-full py-3.5 rounded-[20px] flex items-center justify-center gap-2 font-black text-[14px] bg-emerald-700 text-white shadow-sm">
                                <Check size={18} /> Milk Isolation Valve Locked
                            </div>
                        )}

                        {!cow.vetFlagged ? (
                            <button 
                                onClick={() => flagVet(cow.id)}
                                className="w-full py-3 rounded-[18px] flex items-center justify-center gap-2 font-black text-[13px] border border-red-200 bg-white text-red-700 hover:bg-red-50 transition-colors"
                            >
                                <Stethoscope size={16} /> Flag for Immediate Vet Visit
                            </button>
                        ) : (
                            <div className="w-full py-3 rounded-[18px] flex items-center justify-center gap-2 font-black text-[13px] bg-blue-50 text-blue-800 border border-blue-100">
                                <Check size={16} /> Vet Notified (Scheduled Today)
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* 48-Hour Individual Baseline Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-[32px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white"
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[16px] font-extrabold text-[#113A28]">
                            Personalized Baseline Vitals
                        </h3>
                        <span className="text-[10px] font-black text-[#6C8576] bg-[#F4F9F4] px-2 py-0.5 rounded-full border border-[#E9F4EC]">
                            48h Telemetry
                        </span>
                    </div>
                    
                    <div className="h-[220px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cow.telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9F4EC" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8DA697', fontWeight: 700 }} dy={10} />
                                <YAxis yAxisId="left" domain={[37.5, 41.5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8DA697', fontWeight: 700 }} />
                                <YAxis yAxisId="right" orientation="right" domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8DA697', fontWeight: 700 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }}
                                    itemStyle={{ fontWeight: 800 }}
                                />
                                <ReferenceLine yAxisId="left" y={cow.baseTemp} label={{ value: `Baseline (${cow.baseTemp}°C)`, fill: '#184F35', fontSize: 10, fontWeight: 800 }} stroke="#184F35" strokeDasharray="4 4" />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, marginTop: '10px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#C62828" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Actual Temp (°C)" />
                                <Line yAxisId="right" type="monotone" dataKey="hr" stroke="#F29C38" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Heart Rate (bpm)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-[#F8FBF8] rounded-[20px] p-3 border border-[#E9F4EC] flex items-center gap-3">
                            <div className="bg-red-50 p-2 rounded-xl text-red-600 shrink-0">
                                <Thermometer size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[#6C8576]">Current Temp</div>
                                <div className="text-[17px] font-black text-[#113A28] leading-none mt-0.5">
                                    {cow.temp}°C <span className="text-[10px] text-red-600">(+{tempDelta}°C)</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F8FBF8] rounded-[20px] p-3 border border-[#E9F4EC] flex items-center gap-3">
                            <div className="bg-orange-50 p-2 rounded-xl text-[#F29C38] shrink-0">
                                <Activity size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[#6C8576]">Current Heart Rate</div>
                                <div className="text-[17px] font-black text-[#113A28] leading-none mt-0.5">
                                    {cow.hr} bpm
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
