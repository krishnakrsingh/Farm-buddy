"use client";

import { useEffect, useState, ComponentType } from "react";
import { CloudRain, Droplets, Wind, Sun, Cloud, Moon, CloudSnow, CloudLightning, Loader2, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface IconProps {
    size?: number | string;
    strokeWidth?: number | string;
    className?: string;
}

type HourlyData = {
    timeKey: string;
    time: string;
    temp: number;
    icon: ComponentType<IconProps>;
};

type WeatherInfo = {
    temp: number;
    condition: string;
    feelsLike: number;
    humidity: number;
    windKph: number;
    hourly: HourlyData[];
    isDay: boolean;
};

interface ForecastHour {
    time_epoch: number;
    temp_c: number;
    is_day: number;
    condition: {
        text: string;
    };
}

interface ForecastDay {
    hour: ForecastHour[];
}

function getWeatherIcon(condition: string, isDay: boolean): ComponentType<IconProps> {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return CloudRain;
    if (c.includes("snow") || c.includes("sleet") || c.includes("ice")) return CloudSnow;
    if (c.includes("thunder")) return CloudLightning;
    if (c.includes("cloud") || c.includes("overcast")) return Cloud;
    return isDay ? Sun : Moon;
}

const FALLBACK_WEATHER_INFO: WeatherInfo = {
    temp: 28,
    condition: "Partly Cloudy",
    feelsLike: 30,
    humidity: 68,
    windKph: 12,
    isDay: true,
    hourly: [
        { timeKey: "now", time: "Now", temp: 28, icon: Sun },
        { timeKey: "", time: "5 PM", temp: 29, icon: Sun },
        { timeKey: "", time: "6 PM", temp: 28, icon: Cloud },
        { timeKey: "", time: "7 PM", temp: 26, icon: Moon },
        { timeKey: "", time: "8 PM", temp: 25, icon: Moon },
    ],
};

// Calculate THI (Temperature-Humidity Index) for cattle heat stress
function calculateTHI(tempC: number, rh: number): { thi: number; level: "Low" | "Moderate" | "High"; color: string; badgeBg: string } {
    const thi = 0.8 * tempC + (rh * (tempC - 14.3)) / 100 + 46.4;
    if (thi >= 78) {
        return { thi: Math.round(thi), level: "High", color: "text-red-700", badgeBg: "bg-red-50 border-red-200" };
    } else if (thi >= 72) {
        return { thi: Math.round(thi), level: "Moderate", color: "text-[#D97706]", badgeBg: "bg-[#FFF8DF] border-[#FFEBB3]" };
    } else {
        return { thi: Math.round(thi), level: "Low", color: "text-[#3FA65A]", badgeBg: "bg-[#F4F9F4] border-[#E9F4EC]" };
    }
}

export function AdvancedWeatherWidget() {
    const { t } = useLanguage();
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async (query: string) => {
            try {
                const res = await fetch(`/api/weather?q=${encodeURIComponent(query)}`);
                if (!res.ok) {
                    console.warn("Weather route returned non-OK status. Using client fallback.");
                    setWeather(FALLBACK_WEATHER_INFO);
                    return;
                }
                const data = await res.json();

                const current = data.current;
                const forecastDays: ForecastDay[] = data.forecast?.forecastday || [];

                const allHours: ForecastHour[] = [];
                forecastDays.forEach((day) => {
                    allHours.push(...day.hour);
                });

                const nowEpoch = current?.last_updated_epoch || Math.floor(Date.now() / 1000);
                const futureHours = allHours
                    .filter((h) => h.time_epoch >= nowEpoch - 3600)
                    .slice(0, 5);

                const hourly: HourlyData[] = futureHours.map((h, index) => {
                    const date = new Date(h.time_epoch * 1000);
                    const hours = date.getHours();
                    const ampm = hours >= 12 ? "PM" : "AM";
                    const displayHours = hours % 12 || 12;
                    const timeStr = `${displayHours} ${ampm}`;

                    return {
                        timeKey: index === 0 ? "now" : "",
                        time: timeStr,
                        temp: Math.round(h.temp_c),
                        icon: getWeatherIcon(h.condition.text, h.is_day === 1),
                    };
                });

                setWeather({
                    temp: Math.round(current?.temp_c ?? 28),
                    condition: current?.condition?.text || "Partly Cloudy",
                    feelsLike: Math.round(current?.feelslike_c ?? 30),
                    humidity: current?.humidity ?? 68,
                    windKph: Math.round(current?.wind_kph ?? 12),
                    hourly: hourly.length > 0 ? hourly : FALLBACK_WEATHER_INFO.hourly,
                    isDay: current?.is_day === 1,
                });
            } catch (e) {
                console.warn("Failed to load weather data from API:", e);
                setWeather(FALLBACK_WEATHER_INFO);
            } finally {
                setLoading(false);
            }
        };

        if (!navigator.geolocation) {
            fetchWeather("New Delhi");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(`${position.coords.latitude},${position.coords.longitude}`);
            },
            () => {
                fetchWeather("New Delhi");
            }
        );
    }, []);

    if (loading || !weather) {
        return (
            <div className="bg-white text-[#113A28] rounded-[24px] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] justify-center border border-[#E9F4EC] flex items-center min-h-[160px]">
                <Loader2 className="animate-spin text-[#184F35]" size={32} />
            </div>
        );
    }

    const MainIcon = getWeatherIcon(weather.condition, weather.isDay);
    const thiInfo = calculateTHI(weather.temp, weather.humidity);

    return (
        <div className="bg-white text-[#113A28] rounded-[24px] p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] relative overflow-hidden border border-[#E9F4EC]">
            {/* Header */}
            <div className="flex justify-between items-start mb-2.5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[32px] font-black tracking-tighter text-[#184F35] leading-none">
                            {weather.temp}°
                        </span>
                        <div className="flex flex-col justify-center max-w-[140px]">
                            <span
                                className="text-[13px] font-extrabold text-[#113A28] leading-tight truncate"
                                title={weather.condition}
                            >
                                {weather.condition}
                            </span>
                            <span className="text-[10px] font-bold text-[#8DA697]">
                                {t("feels")} {weather.feelsLike}°
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="bg-[#FFF4E5] p-2 rounded-[14px] shadow-sm flex-shrink-0">
                        <MainIcon size={20} strokeWidth={2.5} className="text-[#F29C38]" />
                    </div>
                </div>
            </div>

            {/* Derived THI Heat Stress Risk Chip */}
            <div className={`mb-2.5 px-3 py-1.5 rounded-[12px] border ${thiInfo.badgeBg} flex items-center justify-between`}>
                <div className="flex items-center gap-1.5">
                    <Flame size={14} className={thiInfo.color} />
                    <span className="text-[11px] font-bold text-[#113A28]">
                        Heat stress risk: <span className={`font-black ${thiInfo.color}`}>{thiInfo.level}</span>
                    </span>
                </div>
                <span className="text-[10px] font-bold text-[#8DA697]">THI: {thiInfo.thi}</span>
            </div>

            {/* Vital Stats */}
            <div className="grid grid-cols-2 gap-2 mb-2.5">
                <div className="bg-[#F4F9F4] border border-[#E9F4EC] rounded-[16px] p-1.5 flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-[10px] shadow-sm text-[#4CAF50] flex-shrink-0">
                        <Droplets size={14} strokeWidth={2.5} />
                    </div>
                    <div className="truncate">
                        <p className="text-[9px] font-bold text-[#6C8576] leading-none">
                            {t("moisture")}
                        </p>
                        <p className="text-[12px] font-extrabold text-[#113A28] leading-tight mt-0.5">
                            {weather.humidity}%
                        </p>
                    </div>
                </div>
                <div className="bg-[#F4F9F4] border border-[#E9F4EC] rounded-[16px] p-1.5 flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-[10px] shadow-sm text-[#5D87FF] flex-shrink-0">
                        <Wind size={14} strokeWidth={2.5} />
                    </div>
                    <div className="truncate">
                        <p className="text-[9px] font-bold text-[#6C8576] leading-none">{t("wind")}</p>
                        <p className="text-[12px] font-extrabold text-[#113A28] leading-tight mt-0.5">
                            {weather.windKph} <span className="text-[9px]">km/h</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-[#F8FBF8] border border-[#E9F4EC] rounded-[16px] p-2">
                <div className="flex justify-between items-end gap-1.5 overflow-x-auto scrollbar-hide">
                    {weather.hourly.map((item, index) => {
                        const Icon = item.icon;
                        const isNow = item.timeKey === "now";
                        const displayTime = isNow ? t("now") : item.time;
                        return (
                            <div key={index} className="flex flex-col items-center gap-1.5 min-w-[2.2rem]">
                                <span
                                    className={cn(
                                        "text-[8px] sm:text-[9px] font-bold whitespace-nowrap",
                                        isNow ? "text-[#184F35]" : "text-[#8DA697]"
                                    )}
                                >
                                    {displayTime}
                                </span>
                                <div className={cn("p-1.5 rounded-[10px]", isNow ? "bg-white shadow-sm" : "")}>
                                    <Icon
                                        size={14}
                                        strokeWidth={2.5}
                                        className={cn(isNow ? "text-[#F29C38]" : "text-[#A0B8AA]")}
                                    />
                                </div>
                                <span className="text-[11px] font-extrabold text-[#113A28]">
                                    {item.temp}°
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
