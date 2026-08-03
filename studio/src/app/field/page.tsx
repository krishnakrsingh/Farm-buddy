"use client";

import { Map, AlertTriangle, Droplets, Thermometer, Radio, CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

interface FieldZone {
    id: number;
    node: string;
    status: "healthy" | "critical" | "warning";
    moisture: string;
    temp: string;
    issue?: string;
    details?: string;
}

function NodeDetailCard({
    nodeData,
}: {
    nodeData: FieldZone;
}) {
    const { t } = useLanguage();
    const isCrit = nodeData.status === "critical";
    const isWarn = nodeData.status === "warning";

    return (
        <div className="bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white">
            <div className="flex items-center gap-3 mb-4">
                <div
                    className={cn(
                        "w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 border border-white",
                        isCrit
                            ? "bg-red-50 text-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.1)]"
                            : isWarn
                            ? "bg-[#FFF8DF] text-[#E7A600] shadow-[0_4px_12px_rgba(231,166,0,0.1)]"
                            : "bg-[#F4F9F4] text-[#184F35] shadow-[0_4px_12px_rgba(24,79,53,0.1)]"
                    )}
                >
                    <Radio size={20} className={isCrit ? "animate-pulse" : ""} />
                </div>
                <div>
                    <h3 className="text-[18px] font-extrabold text-[#113A28] leading-snug">
                        {nodeData.node}
                    </h3>
                    <p
                        className={cn(
                            "text-[10px] font-black mt-0.5 uppercase tracking-wider",
                            isCrit ? "text-red-600" : isWarn ? "text-[#E7A600]" : "text-[#4CAF50]"
                        )}
                    >
                        {isCrit ? t("critical_status") : t("healthy")}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-[#F8FBF8] rounded-[20px] p-3 border border-[#E9F4EC] flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-xl text-blue-500 shrink-0">
                        <Droplets size={16} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-[#6C8576]">
                            {t("moisture")}
                        </div>
                        <div className="text-[16px] font-black text-[#113A28] leading-none mt-1">
                            {nodeData.moisture}
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-[#F8FBF8] rounded-[20px] p-3 border border-[#E9F4EC] flex items-center gap-3">
                    <div className="bg-orange-50 p-2 rounded-xl text-orange-500 shrink-0">
                        <Thermometer size={16} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-[#6C8576]">
                            {t("temp")}
                        </div>
                        <div className="text-[16px] font-black text-[#113A28] leading-none mt-1">
                            {nodeData.temp}
                        </div>
                    </div>
                </div>
            </div>

            {isCrit || isWarn ? (
                <div
                    className={cn(
                        "rounded-[20px] p-4 mb-4 border relative overflow-hidden",
                        isCrit ? "bg-red-50 border-red-100" : "bg-[#FFF8DF] border-[#FFEBB3]"
                    )}
                >
                    <div className="flex items-start gap-2 relative z-10">
                        <AlertTriangle
                            size={16}
                            className={cn("shrink-0 mt-0.5", isCrit ? "text-red-600" : "text-[#E7A600]")}
                        />
                        <div>
                            <h5
                                className={cn(
                                    "font-bold text-[13px] mb-1",
                                    isCrit ? "text-red-900" : "text-[#9A6E00]"
                                )}
                            >
                                {nodeData.issue}
                            </h5>
                            <p
                                className={cn(
                                    "text-[11px] font-medium leading-relaxed",
                                    isCrit ? "text-red-800" : "text-[#B38000]"
                                )}
                            >
                                {nodeData.details}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-4 bg-[#F4F9F4] p-4 rounded-[20px] border border-[#E9F4EC] flex items-start gap-2">
                    <CheckCircle2 className="text-[#4CAF50] shrink-0 mt-0.5" size={16} />
                    <div>
                        <h5 className="font-bold text-[#184F35] text-[13px] mb-0.5">
                            {t("optimal_conditions")}
                        </h5>
                        <p className="text-[11px] font-medium text-[#6C8576] leading-relaxed">
                            {t("no_intervention")}
                        </p>
                    </div>
                </div>
            )}

            {isCrit && (
                <button className="w-full py-[14px] rounded-[16px] flex items-center justify-center gap-2 font-bold text-[14px] transition-all shadow-md bg-red-600 border border-red-600 text-white hover:bg-red-700">
                    <Droplets className="w-4 h-4" /> {t("trigger_sprinklers")}
                </button>
            )}
        </div>
    );
}

export default function FieldPage() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const { t } = useLanguage();

    const FIELD_ZONES: FieldZone[] = [
        { id: 1, node: "N-01", status: "healthy", moisture: "46%", temp: "24°C" },
        {
            id: 2,
            node: "N-02",
            status: "critical",
            moisture: "15%",
            temp: "30°C",
            issue: t("critical_dryness"),
            details: t("critical_dryness_details"),
        },
    ];

    const criticalNodes = FIELD_ZONES.filter((z) => z.status === "critical");
    const activeNodeData = FIELD_ZONES.find((z) => z.node === selectedNode);

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-10 px-5 space-y-7 z-10 pb-10">
                {/* Header Section */}
                <header className="flex justify-between items-center bg-transparent">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-[#113A28] leading-none flex items-center gap-2">
                            <Map className="text-[#184F35] w-6 h-6" /> {t("live_field")}
                        </h1>
                    </div>

                    <div className="bg-white/90 text-[#6C8576] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-[#113A28]/5 flex items-center gap-1.5 tracking-wide">
                        <Radio size={12} className="text-[#4CAF50] animate-pulse" /> 2 {t("active")}
                    </div>
                </header>

                {/* Main Sector Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="bg-white rounded-[32px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white">
                        <div className="flex justify-between items-center mb-4 px-1 pt-1">
                            <div>
                                <h3 className="text-[18px] font-extrabold text-[#113A28] leading-snug">
                                    {t("sector_a")}
                                </h3>
                                <div className="bg-[#FFF8DF] px-2 py-1 rounded-[10px] flex items-center gap-1 mt-1 w-max">
                                    <span className="text-[#E7A600] text-[11px] font-black uppercase tracking-wider">
                                        🟡 {t("moderate_risk")}
                                    </span>
                                </div>
                            </div>
                            <div className="flex bg-[#F4F9F4] p-1 rounded-xl border border-[#E9F4EC]">
                                <button className="bg-white text-[#184F35] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                                    {t("live")}
                                </button>
                                <button className="text-[#8DA697] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                                    24H
                                </button>
                            </div>
                        </div>

                        {/* Interactive Leaflet Map */}
                        <div
                            className={cn(
                                "relative h-[240px] w-full rounded-[24px] overflow-hidden border-[2px] border-[#E9F4EC] shadow-sm mb-4 transition-all duration-700 ease-in-out",
                                selectedNode ? "scale-[1.02] shadow-inner" : "scale-100"
                            )}
                        >
                            <MapComponent selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                            {selectedNode && (
                                <div className="absolute inset-0 bg-black/30 z-[400] transition-opacity duration-500 pointer-events-none rounded-[24px]" />
                            )}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#E9F4EC] shadow-sm z-[500] pointer-events-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
                                <span className="text-[9px] uppercase font-black tracking-widest text-[#184F35]">
                                    {t("live")}
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="bg-[#F8FBF8] rounded-[20px] p-3 border border-[#E9F4EC] flex justify-between items-center text-[10px] font-bold text-[#6C8576] uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" /> {t("optimal")}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F9A825]" /> {t("attention")}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#C62828] animate-pulse" />{" "}
                                {t("critical")}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Node Analytics / Alerts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="px-1 flex justify-between items-end">
                        <h2 className="text-[17px] font-extrabold text-[#113A28]">
                            {selectedNode ? t("node_analytics") : t("active_alerts")}
                        </h2>
                        {selectedNode && (
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="text-[11px] font-bold text-[#6C8576] hover:text-[#184F35] uppercase tracking-wider"
                            >
                                {t("close")}
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedNode && activeNodeData ? (
                            <motion.div
                                key="node-details"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <NodeDetailCard nodeData={activeNodeData} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="alerts"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col gap-3"
                            >
                                {criticalNodes.map((node, i) => (
                                    <motion.div
                                        key={`overview-crit-${node.id}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        onClick={() => setSelectedNode(node.node)}
                                        className="bg-white rounded-[24px] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-white cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
                                    >
                                        <div className="w-[46px] h-[46px] rounded-[16px] bg-red-50 flex items-center justify-center text-red-600 shrink-0 border border-red-100 shadow-[0_4px_12px_rgba(239,68,68,0.1)]">
                                            <AlertTriangle size={18} strokeWidth={2.5} className="animate-pulse" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[14px] font-extrabold text-[#113A28] leading-tight flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t("sector_a")} - {node.node}
                                            </h4>
                                            <p className="text-[11px] font-semibold text-[#8DA697] mt-0.5 truncate">
                                                {t("moisture_critically_low")} ({node.moisture})
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#F4F9F4] flex items-center justify-center text-[#184F35] shrink-0 border border-[#E9F4EC]">
                                            <ChevronRight size={16} />
                                        </div>
                                    </motion.div>
                                ))}
                                {criticalNodes.length === 0 && (
                                    <div className="text-center p-5 bg-white border border-[#E9F4EC] shadow-sm rounded-[24px]">
                                        <CheckCircle2 size={24} className="text-[#4CAF50] mx-auto mb-2" />
                                        <p className="text-[13px] font-bold text-[#113A28]">{t("all_clear")}</p>
                                        <p className="text-[11px] font-medium text-[#6C8576] mt-1">
                                            {t("no_critical_issues")}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
