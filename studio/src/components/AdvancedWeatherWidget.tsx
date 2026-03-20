"use client";

import { CloudRain, Droplets, Wind, Sun, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const hourlyForecast = [
    { time: "Now", temp: 28, icon: Sun },
    { time: "10 AM", temp: 29, icon: Sun },
    { time: "11 AM", temp: 31, icon: Sun },
    { time: "12 PM", temp: 32, icon: CloudRain },
    { time: "1 PM", temp: 31, icon: CloudRain },
    { time: "2 PM", temp: 30, icon: CloudRain },
];

export function AdvancedWeatherWidget() {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start relative z-10 mb-6">
                <div>
                    <h2 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Local Forecast</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-6xl font-black tracking-tighter">28°</span>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold">Sunny</span>
                            <span className="text-sm opacity-80">Feels like 30°</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-inner">
                    <Sun size={40} className="text-yellow-300 drop-shadow-md" />
                </div>
            </div>

            {/* Vital Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Droplets size={20} className="text-blue-100" />
                    </div>
                    <div>
                        <p className="text-xs font-medium opacity-80">Soil Moisture</p>
                        <p className="text-sm font-bold">45% <span className="text-xs font-normal text-green-200">(Optimum)</span></p>
                    </div>
                </div>
                <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Wind size={20} className="text-blue-100" />
                    </div>
                    <div>
                        <p className="text-xs font-medium opacity-80">Wind Speed</p>
                        <p className="text-sm font-bold">12 km/h <span className="text-xs font-normal text-yellow-200">(Gusty)</span></p>
                    </div>
                </div>
            </div>

            {/* Hourly Forecast */}
            <div className="relative z-10 bg-black/5 rounded-2xl p-4 mb-4 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between items-end gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {hourlyForecast.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="flex flex-col items-center gap-2 min-w-[3rem]">
                                <span className="text-xs font-medium opacity-80">{item.time}</span>
                                <Icon size={20} className={cn(item.time === "Now" ? "text-yellow-300" : "text-white/80")} />
                                <span className="text-sm font-bold">{item.temp}°</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Advisory Alert */}
            <div className="relative z-10 bg-orange-500/80 backdrop-blur-md border border-orange-400/50 rounded-2xl p-3 flex items-start gap-3 shadow-inner">
                <AlertTriangle size={20} className="text-orange-100 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">Spraying Advisory</h4>
                    <p className="text-xs text-orange-50 leading-tight">High winds expected afternoon. Avoid pesticide spraying between 1 PM - 4 PM.</p>
                </div>
            </div>
        </div>
    );
}
