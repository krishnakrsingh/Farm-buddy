"use client";

import { MandiPriceCard } from "@/components/MandiPriceCard";
import { Filter, Search } from "lucide-react";

export default function MandiPricesPage() {
    // Dummy data for top 5 nearby mandis
    const mandiData = [
        { name: "Pipli Mandi", distanceKm: 4, price: 2275, previousPrice: 2250, trend: "Rising" as const },
        { name: "Thanesar Mandi", distanceKm: 12, price: 2310, previousPrice: 2280, trend: "Rising" as const },
        { name: "Ladwa Mandi", distanceKm: 18, price: 2300, previousPrice: 2300, trend: "Stable" as const },
        { name: "Shahabad Mandi", distanceKm: 22, price: 2240, previousPrice: 2260, trend: "Falling" as const },
        { name: "Karnal Mandi", distanceKm: 35, price: 2350, previousPrice: 2310, trend: "Rising" as const },
    ];

    return (
        <div className="min-h-screen bg-background pb-32">

            {/* Soft Modern Header */}
            <div className="pt-4 pb-4 px-6 sticky top-0 bg-background/80 backdrop-blur-xl z-20 border-b border-border/50">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Market Prices</h1>
                        <p className="text-muted-foreground text-sm font-medium">Live nearby mandi rates</p>
                    </div>
                    <button className="bg-white dark:bg-zinc-800 p-2.5 rounded-full shadow-sm border border-border text-foreground hover:bg-muted transition-colors">
                        <Search size={18} />
                    </button>
                </div>

                {/* Sleek Pill Selectors */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                    <button className="snap-start flex-shrink-0 bg-primary text-primary-foreground py-2 px-5 rounded-full font-bold shadow-md shadow-primary/20 text-sm">Wheat (Gehu)</button>
                    <button className="snap-start flex-shrink-0 bg-white dark:bg-zinc-800 border border-border text-foreground py-2 px-5 rounded-full font-medium shadow-sm text-sm hover:bg-muted transition-colors">Paddy</button>
                    <button className="snap-start flex-shrink-0 bg-white dark:bg-zinc-800 border border-border text-foreground py-2 px-5 rounded-full font-medium shadow-sm text-sm hover:bg-muted transition-colors">Mustard</button>
                    <button className="snap-start flex-shrink-0 bg-white dark:bg-zinc-800 border border-border text-foreground py-2 px-5 rounded-full font-medium shadow-sm text-sm hover:bg-muted transition-colors">Cotton</button>
                </div>
            </div>

            {/* List of Mandis */}
            <div className="px-5 mt-6 max-w-lg mx-auto space-y-4">
                <div className="flex justify-between items-center mb-3 px-1">
                    <h2 className="font-bold text-foreground text-lg tracking-tight">Nearest Deals</h2>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rate / Quintal</span>
                </div>

                {mandiData.map((mandi, idx) => (
                    <MandiPriceCard
                        key={idx}
                        mandiName={mandi.name}
                        distanceKm={mandi.distanceKm}
                        price={mandi.price}
                        previousPrice={mandi.previousPrice}
                        trend={mandi.trend}
                    />
                ))}

                {/* Small explainer note with trust markers */}
                <div className="flex items-start gap-2 bg-secondary/30 p-3 rounded-xl mt-6">
                    <div className="text-primary mt-0.5"><Filter size={16} /></div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        Trends shown are calculated based on the local 7-day price movement for this specific crop, to help you make informed decisions without absolute commands.
                    </p>
                </div>

            </div>
        </div>
    );
}
