"use client";

import { Map, AlertTriangle, Droplets, Thermometer, Radio, Cpu, CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FIELD_ZONES = [
    { id: 1, node: "N-01", status: "healthy", moisture: "46%", temp: "24°C" },
    { id: 2, node: "N-02", status: "healthy", moisture: "42%", temp: "24°C" },
    { id: 3, node: "N-03", status: "warning", moisture: "31%", temp: "26°C" },
    { id: 4, node: "N-04", status: "healthy", moisture: "48%", temp: "23°C" },
    { id: 5, node: "N-05", status: "critical", moisture: "15%", temp: "30°C", issue: "Critical Dryness", details: "Soil moisture critically low at 15%. High risk of crop perishing. Immediate remote irrigation required in this sector." },
    { id: 6, node: "N-06", status: "healthy", moisture: "44%", temp: "24°C" },
    { id: 7, node: "N-07", status: "healthy", moisture: "41%", temp: "25°C" },
    { id: 8, node: "N-08", status: "critical", moisture: "12%", temp: "31°C", issue: "Severe Drought Alert", details: "Soil moisture critically low at 12%. Temperature spiking to 31°C. Sprinklers must be triggered immediately." },
    { id: 9, node: "N-09", status: "warning", moisture: "28%", temp: "27°C", issue: "Temperature Rise", details: "Regional temperature rising (27°C). Moisture levels dropping steadily to 28%. Monitor closely." },
];

export default function FieldPage() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "critical": return "bg-[#C62828] border-white text-white shadow-xl";
            case "warning": return "bg-[#F9A825] border-white text-white shadow-lg";
            case "healthy": return "bg-[#2E7D32] border-white text-white shadow-md";
            default: return "bg-zinc-500 border-white text-white";
        }
    };

    const getStatusAnimation = (status: string) => {
        if (status === "critical") return "animate-bounce";
        return "";
    };

    const criticalNodes = FIELD_ZONES.filter(z => z.status === "critical");

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
            {/* Header Section */}
            <div className="bg-white dark:bg-zinc-900 pt-6 pb-6 px-6 rounded-b-[2.5rem] shadow-sm mb-6 sticky top-0 z-30 transition-all">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Map className="text-primary" /> Live Field Map
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium mt-1 inline-flex items-center gap-1">
                            <Radio size={14} className="text-emerald-500 animate-pulse" /> 9 Active Sensor Nodes
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                        <Cpu size={20} />
                    </div>
                </div>
            </div>

            <div className="px-5 max-w-xl mx-auto space-y-6">

                {/* Sector Header & Overview */}
                <div className="bg-white dark:bg-zinc-900 px-5 py-4 rounded-[2rem] shadow-sm border border-border flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-xl leading-none mb-1">Sector A</h2>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <span className="text-muted-foreground">Field Health:</span>
                            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-sm">
                                🟡 Moderate Risk
                            </span>
                        </div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">2 Areas Critical</p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex flex-col gap-1">
                        <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-700 shadow-sm text-foreground transition-all">
                            Current
                        </button>
                        <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-zinc-700/50 transition-all">
                            24h Forecast
                        </button>
                    </div>
                </div>

                {/* Map Visualization */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-[2.5rem] shadow-sm border border-zinc-100 dark:border-zinc-800 relative">



                    {/* Farm Layout - Uniform Grid + Textured Background */}
                    <div className={cn("relative aspect-[4/5] sm:aspect-[4/3] w-full rounded-[2rem] overflow-hidden border-[3px] sm:border-4 border-white dark:border-zinc-800 shadow-2xl bg-[#314a2b] isolation-auto transition-all duration-700 ease-in-out",
                        selectedNode ? "scale-[1.03] shadow-inner" : "scale-100"
                    )}>

                        {/* Textured Ground Background (CSS SVG) */}
                        <div
                            className="absolute inset-0 opacity-40 mix-blend-color-burn pointer-events-none z-0"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%231b2e16' fill-opacity='1'%3E%3Cpath d='M10 10l10-10h10l-10 10zM40 10l10-10h10l-10 10zM70 10l10-10h10l-10 10zM10 40l10-10h10l-10 10zM40 40l10-10h10l-10 10zM70 40l10-10h10l-10 10zM10 70l10-10h10l-10 10zM40 70l10-10h10l-10 10zM70 70l10-10h10l-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '40px 40px'
                            }}
                        ></div>

                        {/* Field Paths Overlay (Geometric Lines) */}
                        <div className="absolute inset-0 z-0 pointer-events-none" style={{
                            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                            backgroundSize: '33.33% 33.33%'
                        }}></div>

                        {/* Vignette Lighting */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6bae5d]/30 via-transparent to-black/70 pointer-events-none z-0"></div>

                        {/* Focus Overlay - Dims map when a node is selected */}
                        {selectedNode && (
                            <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-500 pointer-events-none"></div>
                        )}

                        {/* Container for Dots using Native CSS Grid */}
                        <div className="absolute inset-0 z-20 grid grid-cols-3 grid-rows-3 px-4 py-8 pointer-events-none">
                            {FIELD_ZONES.map((zone) => (
                                <div key={`zone-${zone.id}`} className="relative flex items-center justify-center w-full h-full">
                                    {/* Node Marker */}
                                    <div
                                        onClick={(e) => { e.stopPropagation(); setSelectedNode(zone.node); }}
                                        className={cn(
                                            "relative flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl backdrop-blur-md pointer-events-auto",
                                            "w-9 h-9 sm:w-12 sm:h-12 rounded-full border-[3px] sm:border-[4px]",
                                            getStatusColor(zone.status),
                                            selectedNode === zone.node ? "ring-[4px] sm:ring-[6px] ring-white/90 dark:ring-zinc-900/90 scale-125 z-30" : "hover:scale-110 z-20",
                                            getStatusAnimation(zone.status)
                                        )}
                                    >
                                        {zone.status === 'critical' ? (
                                            <AlertTriangle size={16} strokeWidth={3} className="text-white drop-shadow-md sm:w-5 sm:h-5" />
                                        ) : (
                                            <span className="text-[12px] sm:text-[14px] font-black tracking-tighter text-white drop-shadow-md">
                                                {zone.id}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Live Indicator */}
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg z-20 pointer-events-none">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-white">Live</span>
                        </div>
                    </div>

                    {/* Map Legend */}
                    <div className="mt-5 flex justify-between px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl">
                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-[#2E7D32] border-2 border-white dark:border-zinc-800 shadow-sm"></div> Optimal <span className="hidden sm:inline">(Good Moisture)</span></div>
                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-[#F9A825] border-2 border-white dark:border-zinc-800 shadow-sm"></div> Attention Needed</div>
                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-[#C62828] border-2 border-white dark:border-zinc-800 shadow-sm animate-pulse"></div> Critical Dryness</div>
                    </div>
                </div>

                {/* Dynamic Display (Shows selected node problem, OR general alerts) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-xl">
                            {selectedNode ? `Node Analysis` : `System Status`}
                        </h3>
                    </div>

                    {selectedNode ? (
                        // Detailed Node Problem / Info Card
                        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                            {(() => {
                                const nodeData = FIELD_ZONES.find(z => z.node === selectedNode);
                                if (!nodeData) return null;

                                const isCrit = nodeData.status === 'critical';
                                const isWarn = nodeData.status === 'warning';

                                return (
                                    <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-3xl p-5 border border-border transition-all">
                                        <div className="flex flex-col gap-4">
                                            {/* Top Row: Node & Icon */}
                                            <div className="flex items-center justify-between pb-4 border-b border-border/50">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center",
                                                        isCrit ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                                                            isWarn ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                                                'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    )}>
                                                        <Radio size={22} className={isCrit ? "animate-pulse" : ""} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h4 className="font-bold text-lg leading-none text-foreground">{nodeData.node}</h4>
                                                            <span className={cn("text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full inline-block border",
                                                                isCrit ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900/30" :
                                                                    isWarn ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/30" :
                                                                        "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30"
                                                            )}>{nodeData.status}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground font-medium">Real-time telemetry</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Metrics Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-border/50">
                                                    <div className="bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                                                        <Droplets size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Soil Moisture</div>
                                                        <div className="text-lg font-black text-foreground leading-none">{nodeData.moisture}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-border/50">
                                                    <div className="bg-orange-100/50 dark:bg-orange-900/30 p-2 rounded-xl text-orange-600 dark:text-orange-400">
                                                        <Thermometer size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Temperature</div>
                                                        <div className="text-lg font-black text-foreground leading-none">{nodeData.temp}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* NPK Simulated Data (Hackathon Booster) */}
                                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-2xl border border-border/50 flex justify-between items-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Nitrogen (N)</span>
                                                    <span className={cn("text-sm font-black", isCrit ? "text-red-500" : "text-emerald-600 dark:text-emerald-400")}>
                                                        {isCrit ? "Low" : "Normal"}
                                                    </span>
                                                </div>
                                                <div className="w-px h-8 bg-border/50"></div>
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Phosphorus (P)</span>
                                                    <span className={cn("text-sm font-black text-emerald-600 dark:text-emerald-400")}>
                                                        Normal
                                                    </span>
                                                </div>
                                                <div className="w-px h-8 bg-border/50"></div>
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Potassium (K)</span>
                                                    <span className={cn("text-sm font-black text-emerald-600 dark:text-emerald-400")}>
                                                        Normal
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Dynamic Problem Statement */}
                                            {(isCrit || isWarn) ? (
                                                <div className={cn(
                                                    "mt-2 p-4 rounded-2xl border flex flex-col gap-3",
                                                    isCrit ? "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-900/30" :
                                                        "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/30"
                                                )}>
                                                    <div className="flex items-start gap-3">
                                                        <AlertTriangle size={18} className={cn("shrink-0 mt-0.5", isCrit ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")} />
                                                        <div>
                                                            <h5 className={cn("font-bold text-sm mb-1",
                                                                isCrit ? "text-red-900 dark:text-red-100" : "text-amber-900 dark:text-amber-100"
                                                            )}>
                                                                {nodeData.issue}
                                                            </h5>
                                                            <p className={cn("text-xs font-medium leading-relaxed",
                                                                isCrit ? "text-red-800/80 dark:text-red-200/80" : "text-amber-800/80 dark:text-amber-200/80"
                                                            )}>
                                                                {nodeData.details}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {isCrit && (
                                                        <button className="w-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                                                            <Droplets size={16} /> Trigger Remote Sprinklers
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-2 bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3">
                                                    <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" size={18} />
                                                    <div>
                                                        <h5 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm mb-0.5">Optimal Conditions</h5>
                                                        <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-200/80">
                                                            This sector is operating perfectly. No intervention required.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    ) : (
                        // Overview Mode when no node is selected
                        <div className="animate-in fade-in duration-300">
                            {criticalNodes.map(node => (
                                <div
                                    key={`overview-crit-${node.id}`}
                                    onClick={() => setSelectedNode(node.node)}
                                    className="group bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 shadow-sm rounded-full p-2 pr-4 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer mb-4"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                                        <AlertTriangle size={20} strokeWidth={2.5} className="animate-pulse" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm md:text-base font-bold text-foreground leading-tight truncate">
                                                <span className={cn("inline-block w-2 h-2 rounded-full mr-2", node.status === 'critical' ? 'bg-red-500' : 'bg-amber-500')}></span>
                                                Sector A - Node {node.id}
                                            </h4>
                                        </div>
                                        <p className="text-xs font-bold text-muted-foreground truncate mb-0.5">
                                            Moisture below {node.moisture}
                                        </p>
                                        <p className="text-[10px] md:text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide truncate">
                                            Suggested Action: Irrigate within 6 hours
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 text-zinc-300 dark:text-zinc-700 group-hover:text-red-500 transition-colors ml-1">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            ))}
                            <div className="text-center p-5 bg-white dark:bg-zinc-900 border shadow-sm rounded-2xl">
                                <p className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
                                    Tap any node on the map to analyze its soil data <ChevronRight size={16} />
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
