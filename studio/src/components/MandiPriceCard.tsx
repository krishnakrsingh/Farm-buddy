"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface MandiPriceCardProps {
    mandiName: string;
    distanceKm: number;
    price: number;
    previousPrice: number;
    trend: "Rising" | "Falling" | "Stable";
}

export function MandiPriceCard({ mandiName, distanceKm, price, previousPrice, trend }: MandiPriceCardProps) {
    const { t } = useLanguage();
    const priceDiff = price - previousPrice;
    const isUp = priceDiff > 0;
    const isDown = priceDiff < 0;

    const trendLabel = trend === "Rising" ? t("rising") : trend === "Falling" ? t("falling") : t("stable");

    return (
        <div className="bg-white dark:bg-zinc-900 border border-border shadow-sm mb-3 rounded-[1.25rem] overflow-hidden transition-all hover:shadow-md">
            <div className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-foreground text-lg leading-tight">{mandiName}</h3>
                    <p className="text-sm text-muted-foreground font-medium mt-0.5">{distanceKm} {t("km_away")}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="font-black text-xl text-foreground">₹{price}</div>
                        <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isUp ? "text-emerald-600 dark:text-emerald-400" :
                            isDown ? "text-red-500 dark:text-red-400" :
                                "text-gray-500"
                            }`}>
                            {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
                            <span>{Math.abs(priceDiff)}</span>
                        </div>
                    </div>

                    <div className={`px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors border ${trend === "Rising"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                            : trend === "Falling"
                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900"
                                : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700"
                        }`}>
                        {t("trend")}: {trendLabel}
                    </div>
                </div>
            </div>
        </div>
    );
}
