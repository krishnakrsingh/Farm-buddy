"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function RecordsPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pb-24">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 pt-6 pb-6 rounded-b-3xl shadow-sm relative z-20">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/" className="p-2 -ml-2 hover:bg-white/20 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-white" />
                    </Link>
                    <h1 className="text-xl font-bold">Farm Records</h1>
                </div>
                <p className="text-blue-100 font-medium px-1 text-sm">Keep track of your planting and yield history.</p>
            </div>

            <div className="flex-1 w-full max-w-lg mx-auto relative px-4 mt-6">

                <button className="w-full mb-6 bg-blue-50 text-blue-700 border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-colors p-4 rounded-xl flex items-center justify-center gap-2 group font-bold">
                    <Plus size={20} />
                    <span>Add New Record</span>
                </button>

                <div className="space-y-3">
                    <h2 className="font-bold text-foreground text-lg pl-1 mb-2">History</h2>

                    <div className="bg-card border rounded-lg p-4 shadow-sm flex justify-between items-center">
                        <div>
                            <div className="font-bold text-base mb-1">Wheat (Kharif 2023)</div>
                            <div className="text-sm text-muted-foreground font-medium">12 Acres • Nov 2023 - Apr 2024</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg text-foreground">240q</div>
                            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Yield</div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-4 shadow-sm flex justify-between items-center">
                        <div>
                            <div className="font-bold text-base mb-1">Paddy (Rabi 2023)</div>
                            <div className="text-sm text-muted-foreground font-medium">12 Acres • Jun 2023 - Oct 2023</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg text-foreground">310q</div>
                            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Yield</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
