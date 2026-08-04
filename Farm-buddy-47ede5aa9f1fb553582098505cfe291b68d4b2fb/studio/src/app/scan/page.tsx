"use client";

import { useState } from "react";
import { Camera, CheckCircle2, ArrowLeft, RefreshCw, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ScanPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<null | {
        bcsScore: number;
        locomotionScore: number;
        rumenFill: number;
        confidence: number;
        cowTag: string;
    }>(null);

    const handleRunCVAnalysis = () => {
        setIsScanning(true);
        setScanResult(null);
        setTimeout(() => {
            setIsScanning(false);
            setScanResult({
                bcsScore: 3.25,
                locomotionScore: 1,
                rumenFill: 4.2,
                confidence: 94.8,
                cowTag: "COW-014",
            });
        }, 1800);
    };

    return (
        <div className="min-h-screen bg-[#111A15] text-white relative font-sans flex flex-col justify-between pb-32">
            {/* Top Bar Header */}
            <div className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10 z-20">
                <Link
                    href="/"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div className="text-center">
                    <h2 className="text-[15px] font-black tracking-wide">Vision AI Scanner</h2>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                        BCS & Lameness Check
                    </p>
                </div>
                <div className="w-10" />
            </div>

            {/* Viewfinder Area */}
            <div className="relative flex-1 m-4 rounded-[32px] overflow-hidden border-2 border-white/20 bg-emerald-950/30 flex items-center justify-center min-h-[360px]">
                {/* Background Cow Mock Image */}
                <img
                    src="https://images.unsplash.com/photo-1546445317-29f4545f9d52?q=80&w=800&auto=format&fit=crop"
                    alt="Holstein Dairy Cow"
                    className="absolute inset-0 w-full h-full object-cover opacity-75"
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Bounding Box Frame */}
                <div className="relative w-[80%] h-[65%] border-2 border-emerald-400/80 rounded-2xl flex flex-col justify-between p-3 bg-emerald-500/10 backdrop-blur-[1px]">
                    <div className="flex justify-between items-start">
                        <span className="bg-emerald-500/90 text-black font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Target: COW-014
                        </span>
                        <span className="text-[9px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            YOLOv8-Cattle 60 FPS
                        </span>
                    </div>

                    {/* Scanning Animation line */}
                    {isScanning && (
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: [0, 200, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399]"
                        />
                    )}

                    <div className="flex justify-between items-end text-[10px] font-mono text-emerald-300">
                        <span>Spine Angle: 174°</span>
                        <span>Hook-Pin Width: 42cm</span>
                    </div>
                </div>
            </div>

            {/* Inference Result Drawer */}
            <div className="px-4 z-20">
                <AnimatePresence mode="wait">
                    {scanResult ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white text-[#113A28] rounded-[28px] p-5 shadow-2xl border border-emerald-100"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={20} className="text-[#3FA65A]" />
                                    <h3 className="text-[16px] font-black">AI Assessment Complete</h3>
                                </div>
                                <span className="bg-[#F4F9F4] text-[#184F35] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#E9F4EC]">
                                    {scanResult.confidence}% Conf.
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                <div className="bg-[#F8FBF8] p-2.5 rounded-[16px] border border-[#E9F4EC]">
                                    <span className="text-[9px] font-bold text-[#8DA697] uppercase">BCS Score</span>
                                    <div className="text-[18px] font-black text-[#113A28] mt-0.5">{scanResult.bcsScore}</div>
                                    <span className="text-[8px] font-bold text-[#3FA65A]">Optimal (3.25)</span>
                                </div>

                                <div className="bg-[#F8FBF8] p-2.5 rounded-[16px] border border-[#E9F4EC]">
                                    <span className="text-[9px] font-bold text-[#8DA697] uppercase">Lameness</span>
                                    <div className="text-[18px] font-black text-[#113A28] mt-0.5">Gait 1/5</div>
                                    <span className="text-[8px] font-bold text-[#3FA65A]">Normal / Sound</span>
                                </div>

                                <div className="bg-[#F8FBF8] p-2.5 rounded-[16px] border border-[#E9F4EC]">
                                    <span className="text-[9px] font-bold text-[#8DA697] uppercase">Rumen Fill</span>
                                    <div className="text-[18px] font-black text-[#113A28] mt-0.5">{scanResult.rumenFill} / 5</div>
                                    <span className="text-[8px] font-bold text-[#3FA65A]">Good Intake</span>
                                </div>
                            </div>

                            <button
                                onClick={handleRunCVAnalysis}
                                className="w-full py-3 rounded-[16px] bg-[#F4F9F4] text-[#184F35] font-extrabold text-[13px] border border-[#E9F4EC] flex items-center justify-center gap-2 hover:bg-[#E9F4EC] transition-colors"
                            >
                                <RefreshCw size={14} /> Scan Next Cow
                            </button>
                        </motion.div>
                    ) : (
                        <div className="bg-white/10 backdrop-blur-md rounded-[28px] p-4 text-center border border-white/10">
                            <button
                                onClick={handleRunCVAnalysis}
                                disabled={isScanning}
                                className="w-full py-4 rounded-[20px] bg-[#3FA65A] hover:bg-[#348e4d] active:scale-95 transition-all text-white font-black text-[15px] shadow-lg flex items-center justify-center gap-2"
                            >
                                {isScanning ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" /> Running Computer Vision Model...
                                    </>
                                ) : (
                                    <>
                                        <Camera size={20} /> Capture & Score Cow (BCS / Gait)
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
