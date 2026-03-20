"use client";

import LiveAnalysis from "@/components/live-analysis";

export default function ScanPage() {
    return (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-100 w-full h-[100dvh] overflow-hidden flex flex-col">
            <LiveAnalysis />
        </div>
    );
}
