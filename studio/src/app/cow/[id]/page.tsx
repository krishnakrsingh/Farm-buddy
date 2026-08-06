"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Thermometer, Activity, ShieldAlert, Check, Stethoscope, AlertTriangle, ShieldCheck, Lock, Zap, Droplets, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";
import { useHerdState } from "@/lib/useHerdState";
import { useLiveSensorData } from "@/lib/useLiveSensorData";

export default function CowDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const cowId = resolvedParams.id;
    const { cows, holdMilk, flagVet } = useHerdState();

    const cow = cows.find((c) => c.id === cowId) || cows[0];
    const isEscalated = cow.status === "escalated";
    const tempDelta = (cow.temp - cow.baseTemp).toFixed(1);
    const { liveData, isHardwareOnline } = useLiveSensorData(cowId);

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-5 z-10 pb-10">
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
                                {cow.name}
                            </h1>
                            <span className="text-[10px] font-mono font-extrabold text-[#6C8576] bg-white px-2 py-0.5 rounded-full border border-[#E9F4EC]">
                                #{cow.id}
                            </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#6C8576] mt-0.5">
                            {cow.breed} • Yield: {cow.milkYieldLitersPerDay} L/day
                        </span>
                    </div>

                    <div className="w-10 h-10" />
                </header>

                {/* Smart Tag Active Banner */}
                {cow.isLiveHardware && isHardwareOnline && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-600 rounded-[22px] p-3.5 border border-emerald-500 shadow-md flex items-center gap-3 text-white"
                    >
                        <div className="w-10 h-10 rounded-[14px] bg-emerald-700/80 text-white flex items-center justify-center shrink-0">
                            <Zap size={22} className="animate-pulse text-yellow-300" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-90">Live Smart Ear Tag Connected</div>
                            <div className="text-[14px] font-black leading-tight">Continuous Vital Signs & Movement Stream</div>
                        </div>
                    </motion.div>
                )}

                {/* Bulk Milk Tank Protection Status Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "rounded-[28px] p-4 border transition-all shadow-md relative overflow-hidden text-white",
                        cow.heldMilk
                            ? "bg-[#184F35] border-[#184F35]"
                            : "bg-red-600 border-red-500 animate-pulse"
                    )}
                >
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-sm",
                            cow.heldMilk ? "bg-emerald-800 text-emerald-200" : "bg-white text-red-600"
                        )}>
                            {cow.heldMilk ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                Bulk Milk Quality Protection
                            </div>
                            <h3 className="text-[16px] font-black leading-tight mt-0.5">
                                {cow.heldMilk 
                                    ? "TANK PROTECTED — Milk Withheld" 
                                    : "HIGH FEVER — Hold Milk Immediately"}
                            </h3>
                            <p className="text-[11px] font-medium opacity-90 mt-1 leading-snug">
                                {cow.heldMilk 
                                    ? "Milk from this cow is safely isolated. Bulk farm cooling tank contamination is 100% prevented."
                                    : "Milk from this animal must be withheld to prevent spoiling the 10,000L farm tank!"}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Farmer Health Assessment Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-[32px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-[16px] font-extrabold text-[#113A28]">
                                Health Condition Summary
                            </h3>
                            <p className="text-[11px] font-bold text-[#6C8576]">
                                Category: <span className="text-red-700 font-extrabold">{cow.category}</span>
                            </p>
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase px-3 py-1 rounded-full",
                            isEscalated ? "bg-red-100 text-red-800 border border-red-200" : "bg-amber-100 text-amber-800"
                        )}>
                            {isEscalated ? "High Risk Alert" : "Watchlist Warning"}
                        </span>
                    </div>

                    <div className="bg-[#F8FBF8] rounded-[20px] p-4 border border-[#E9F4EC]">
                        <p className="text-[13px] font-extrabold text-[#113A28] leading-relaxed">
                            {cow.farmerNotes}
                        </p>
                    </div>

                    {/* Contributing Factors Breakdown */}
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-[#6C8576] mb-2">
                            Primary Health Indicators
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

                    {/* Action Buttons for Farm Manager */}
                    <div className="space-y-2.5 pt-2">
                        {!cow.heldMilk ? (
                            <button 
                                onClick={() => holdMilk(cow.id)}
                                className="w-full py-4 rounded-[20px] flex items-center justify-center gap-2 font-black text-[15px] transition-all shadow-md bg-red-600 text-white hover:bg-red-700 active:scale-95"
                            >
                                <Lock size={18} /> Hold Milk from Bulk Tank
                            </button>
                        ) : (
                            <div className="w-full py-3.5 rounded-[20px] flex items-center justify-center gap-2 font-black text-[14px] bg-emerald-700 text-white shadow-sm">
                                <Check size={18} /> Milk Safely Isolated from Tank
                            </div>
                        )}

                        {!cow.vetFlagged ? (
                            <button 
                                onClick={() => flagVet(cow.id)}
                                className="w-full py-3 rounded-[18px] flex items-center justify-center gap-2 font-black text-[13px] border border-red-200 bg-white text-red-700 hover:bg-red-50 transition-colors"
                            >
                                <Stethoscope size={16} /> Request Vet Visit for {cow.name}
                            </button>
                        ) : (
                            <div className="w-full py-3 rounded-[18px] flex items-center justify-center gap-2 font-black text-[13px] bg-blue-50 text-blue-800 border border-blue-100">
                                <Check size={16} /> Vet Inspection Scheduled Today
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Live Vital Signs Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-[32px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white"
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[16px] font-extrabold text-[#113A28]">
                            Vital Signs & Health Baseline
                        </h3>
                        <span className="text-[10px] font-black text-[#6C8576] bg-[#F4F9F4] px-2.5 py-0.5 rounded-full border border-[#E9F4EC]">
                            24-Hour Trend
                        </span>
                    </div>
                    
                    <div className="h-[200px] w-full -ml-4">
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
                                <ReferenceLine yAxisId="left" y={cow.baseTemp} label={{ value: `Normal (${cow.baseTemp}°C)`, fill: '#184F35', fontSize: 10, fontWeight: 800 }} stroke="#184F35" strokeDasharray="4 4" />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, marginTop: '10px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#C62828" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Body Temp (°C)" />
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
                                <div className="text-[10px] uppercase font-bold text-[#6C8576]">Body Temp</div>
                                <div className="text-[17px] font-black text-[#113A28] leading-none mt-0.5">
                                    {cow.temp}°C <span className="text-[10px] text-red-600">(+{tempDelta}°C)</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F8FBF8] rounded-[20px] p-3 border border-[#E9F4EC] flex items-center gap-3">
                            <div className="bg-orange-50 p-2 rounded-xl text-[#F29C38] shrink-0">
                                <Heart size={18} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-[#6C8576]">Heart Rate</div>
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
