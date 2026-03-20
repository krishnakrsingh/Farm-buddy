"use client";

import { CloudRain, Droplets, Wind, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

// Mock Data
const hourlyForecast = [
    { timeKey: "now", time: "Now", temp: 28, icon: Sun },
    { timeKey: "", time: "10 AM", temp: 29, icon: Sun },
    { timeKey: "", time: "11 AM", temp: 31, icon: Sun },
    { timeKey: "", time: "12 PM", temp: 32, icon: CloudRain },
    { timeKey: "", time: "1 PM", temp: 31, icon: CloudRain },
];

export function AdvancedWeatherWidget() {
    const { t } = useLanguage();

    return (
        <div className="bg-white text-[#113A28] rounded-[24px] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] relative overflow-hidden border border-[#E9F4EC]">
            {/* Header */}
            <div className="flex justify-between items-start mb-2.5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[32px] font-black tracking-tighter text-[#184F35] leading-none">28°</span>
                        <div className="flex flex-col justify-center">
                            <span className="text-[13px] font-extrabold text-[#113A28] leading-tight">{t("sunny")}</span>
                            <span className="text-[10px] font-bold text-[#8DA697]">{t("feels")} 30°</span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#FFF4E5] p-2 rounded-[14px] shadow-sm">
                    <Sun size={20} strokeWidth={2.5} className="text-[#F29C38]" />
                </div>
            </div>

            {/* Vital Stats */}
            <div className="grid grid-cols-2 gap-2 mb-2.5">
                <div className="bg-[#F4F9F4] border border-[#E9F4EC] rounded-[16px] p-1.5 flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-[10px] shadow-sm text-[#4CAF50]">
                        <Droplets size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-[#6C8576] leading-none">{t("moisture")}</p>
                        <p className="text-[12px] font-extrabold text-[#113A28] leading-tight mt-0.5">45%</p>
                    </div>
                </div>
                <div className="bg-[#F4F9F4] border border-[#E9F4EC] rounded-[16px] p-1.5 flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-[10px] shadow-sm text-[#5D87FF]">
                        <Wind size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-[#6C8576] leading-none">{t("wind")}</p>
                        <p className="text-[12px] font-extrabold text-[#113A28] leading-tight mt-0.5">12 km/h</p>
                    </div>
                </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-[#F8FBF8] border border-[#E9F4EC] rounded-[16px] p-2">
                <div className="flex justify-between items-end gap-1.5 overflow-x-auto scrollbar-hide">
                    {hourlyForecast.map((item, index) => {
                        const Icon = item.icon;
                        const isNow = item.timeKey === "now";
                        const displayTime = isNow ? t("now") : item.time;
                        return (
                            <div key={index} className="flex flex-col items-center gap-1.5 min-w-[2.2rem]">
                                <span className={cn("text-[9px] font-bold", isNow ? "text-[#184F35]" : "text-[#8DA697]")}>{displayTime}</span>
                                <div className={cn(
                                    "p-1.5 rounded-[10px]",
                                    isNow ? "bg-white shadow-sm" : ""
                                )}>
                                    <Icon size={14} strokeWidth={2.5} className={cn(isNow ? "text-[#F29C38]" : "text-[#A0B8AA]")} />
                                </div>
                                <span className="text-[11px] font-extrabold text-[#113A28]">{item.temp}°</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
