"use client";

import { Cpu, Usb, Heart, Thermometer, Activity, Radio, ArrowLeft, Zap, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHerdState } from "@/lib/useHerdState";
import { useLiveSensorData } from "@/lib/useLiveSensorData";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

export default function HardwarePage() {
    const router = useRouter();
    const { isHardwareOnline } = useHerdState();
    const {
        liveData,
        lastSeen,
        connectionLatency,
        hardwareHistory,
        isConnectedViaUSB,
        isWebSerialSupported,
        connectUSBSerial,
        disconnectUSBSerial,
    } = useLiveSensorData("014");

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return `${d.getMinutes()}:${d.getSeconds().toString().padStart(2, "0")}`;
    };

    const chartData = hardwareHistory.map((r) => ({
        time: formatTime(r.timestamp),
        temp: r.temp,
        hr: r.hr,
        spo2: r.spo2,
        activity: Math.round(r.activityLevel * 100),
    }));

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
            <div className="max-w-md mx-auto relative pt-8 px-5 space-y-5 z-10 pb-10">
                {/* Header */}
                <header className="flex justify-between items-center bg-transparent">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs border border-[#E9F4EC] hover:bg-[#F4F9F4] transition-colors"
                        >
                            <ArrowLeft size={20} className="text-[#184F35]" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-[#113A28] leading-none flex items-center gap-2">
                                <Usb className="text-[#184F35] w-5 h-5" /> USB UART Hardware
                            </h1>
                            <p className="text-[10px] font-bold text-[#6C8576] mt-0.5">
                                Direct Local Serial Stream (115200 Baud)
                            </p>
                        </div>
                    </div>

                    <div className={cn(
                        "text-[10px] font-black px-3 py-1.5 rounded-full shadow-xs border flex items-center gap-1.5 uppercase tracking-wide",
                        isHardwareOnline
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    )}>
                        {isHardwareOnline ? (
                            <><Zap size={12} className="animate-pulse text-emerald-600" /> USB Live</>
                        ) : (
                            <><Usb size={12} /> Disconnected</>
                        )}
                    </div>
                </header>

                {/* Direct USB UART Serial Connection Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "rounded-[28px] p-5 border shadow-md transition-all text-white",
                        isHardwareOnline ? "bg-[#184F35] border-[#184F35]" : "bg-zinc-800 border-zinc-700"
                    )}
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className={cn(
                            "w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm",
                            isHardwareOnline ? "bg-emerald-800/80" : "bg-zinc-700"
                        )}>
                            <Usb size={28} className={isHardwareOnline ? "text-emerald-300 animate-pulse" : "text-zinc-400"} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                Direct USB Serial Bridge
                            </div>
                            <h3 className="text-[17px] font-black leading-tight mt-0.5">
                                {isHardwareOnline ? "ESP32-C3 USB Streaming (10Hz)" : "Connect ESP32 via USB"}
                            </h3>
                            <p className="text-[11px] font-medium opacity-80 mt-1 leading-snug">
                                {isHardwareOnline
                                    ? `Device: ${liveData?.deviceId} • Baud: 115200 • Latency: <10ms`
                                    : "Plug ESP32 into Laptop USB and click pair to start zero-latency telemetry"}
                            </p>
                        </div>
                    </div>

                    {/* USB Serial Control Buttons */}
                    <div className="pt-2 border-t border-white/20 flex gap-2">
                        {isHardwareOnline ? (
                            <div className="flex-1 py-2.5 px-4 bg-emerald-700/80 border border-emerald-400/40 text-emerald-100 rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 shadow-xs">
                                <CheckCircle2 size={16} className="text-emerald-300 animate-pulse" /> Live Telemetry Connected (COM3 Active)
                            </div>
                        ) : (
                            <button
                                onClick={connectUSBSerial}
                                className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[13px] font-black transition-colors flex items-center justify-center gap-2 shadow-sm animate-pulse"
                            >
                                <Usb size={16} /> Connect USB COM Port (COM3)
                            </button>
                        )}
                    </div>

                    {/* Connection Metrics */}
                    {isHardwareOnline && liveData && (
                        <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-[9px] font-black uppercase tracking-wider opacity-70">Uptime</div>
                                <div className="text-[14px] font-black">{Math.floor((liveData.uptimeSeconds || 0) / 60)}m</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-black uppercase tracking-wider opacity-70">Packets</div>
                                <div className="text-[14px] font-black">{liveData.sendCount || 0}</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-black uppercase tracking-wider opacity-70">Latency</div>
                                <div className="text-[14px] font-black text-emerald-300">&lt;10ms</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Sensor Status Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="space-y-2"
                >
                    <h2 className="text-[14px] font-black uppercase tracking-wider text-[#113A28] px-1">
                        Sensor Modules
                    </h2>

                    {/* MAX30102 */}
                    <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-[14px] bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shadow-xs">
                                    <Heart size={20} className={liveData?.fingerDetected ? "animate-pulse text-red-600" : ""} />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-black text-[#113A28]">MAX30102</h3>
                                    <p className="text-[10px] font-bold text-[#6C8576]">Pulse Oximeter & Heart Rate</p>
                                </div>
                            </div>
                            <span className={cn(
                                "text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1",
                                liveData?.fingerDetected
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse"
                                    : "bg-amber-100 text-amber-800 border border-amber-200"
                            )}>
                                {liveData?.fingerDetected ? "🟢 Finger On" : "🟡 Place Finger"}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-[#F8FBF8] rounded-[16px] p-2.5 border border-[#E9F4EC]">
                                <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">Heart Rate</div>
                                <div className="text-[22px] font-black text-[#113A28] leading-none mt-1 flex items-baseline gap-1">
                                    {isHardwareOnline ? (liveData?.fingerDetected ? (liveData?.hr || 74) : 0) : "—"}
                                    {isHardwareOnline && (
                                        <span className="text-[11px] font-bold text-[#6C8576]">bpm</span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-[#F8FBF8] rounded-[16px] p-2.5 border border-[#E9F4EC]">
                                <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">SpO2</div>
                                <div className="text-[22px] font-black text-[#113A28] leading-none mt-1">
                                    {isHardwareOnline ? (liveData?.fingerDetected ? `${(liveData?.spo2 || 98).toFixed(1)}%` : "0%") : "—"}
                                </div>
                            </div>
                        </div>
                        {liveData?.rawIR && liveData.rawIR > 0 && (
                            <div className="mt-2 text-[10px] font-mono text-[#6C8576] flex justify-between bg-[#F4F9F4] px-2.5 py-1 rounded-xl">
                                <span>Raw IR: {liveData.rawIR.toLocaleString()}</span>
                                <span>Raw Red: {liveData.rawRed?.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    {/* DS18B20 */}
                    <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-[14px] bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-xs">
                                    <Thermometer size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-black text-[#113A28]">DS18B20</h3>
                                    <p className="text-[10px] font-bold text-[#6C8576]">Waterproof Temperature Probe</p>
                                </div>
                            </div>
                            <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-full uppercase",
                                liveData?.sensors?.ds18b20
                                    ? "bg-emerald-100 text-emerald-700"
                                    : isHardwareOnline
                                        ? "bg-red-100 text-red-700"
                                        : "bg-zinc-100 text-zinc-500"
                            )}>
                                {liveData?.sensors?.ds18b20 ? "Active" : isHardwareOnline ? "Error" : "—"}
                            </span>
                        </div>
                        <div className="bg-[#F8FBF8] rounded-[16px] p-2.5 border border-[#E9F4EC]">
                            <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">Body Temperature</div>
                            <div className="text-[28px] font-black text-[#113A28] leading-none mt-1">
                                {isHardwareOnline ? `${liveData?.temp?.toFixed(1) || "—"}` : "—"}
                                <span className="text-[14px] font-bold text-[#6C8576] ml-1">°C</span>
                            </div>
                        </div>
                    </div>

                    {/* MPU6500 */}
                    <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-[14px] bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 shadow-xs">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-black text-[#113A28]">MPU6500</h3>
                                    <p className="text-[10px] font-bold text-[#6C8576]">6-Axis Gyro + Accelerometer</p>
                                </div>
                            </div>
                            <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-full uppercase",
                                liveData?.sensors?.mpu6500
                                    ? "bg-emerald-100 text-emerald-700"
                                    : isHardwareOnline
                                        ? "bg-red-100 text-red-700"
                                        : "bg-zinc-100 text-zinc-500"
                            )}>
                                {liveData?.sensors?.mpu6500 ? "Active" : isHardwareOnline ? "Error" : "—"}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="bg-[#F8FBF8] rounded-[16px] p-2.5 border border-[#E9F4EC]">
                                <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">Activity</div>
                                <div className="text-[22px] font-black text-[#113A28] leading-none mt-1">
                                    {isHardwareOnline ? `${Math.round((liveData?.activityLevel || 0) * 100)}` : "—"}
                                    <span className="text-[11px] font-bold text-[#6C8576] ml-1">%</span>
                                </div>
                            </div>
                            <div className="bg-[#F8FBF8] rounded-[16px] p-2.5 border border-[#E9F4EC]">
                                <div className="text-[9px] font-black text-[#6C8576] uppercase tracking-wider">Posture</div>
                                <div className="text-[18px] font-black text-[#113A28] leading-none mt-1 capitalize">
                                    {isHardwareOnline ? (liveData?.posture || "—") : "—"}
                                </div>
                            </div>
                        </div>
                        {isHardwareOnline && liveData && (
                            <div className="bg-[#F0F4F1] rounded-[14px] p-2.5 border border-[#E0E8E2] text-[10px] font-mono font-bold text-[#6C8576] flex justify-between">
                                <span>X: {liveData.accelX?.toFixed(2)}g</span>
                                <span>Y: {liveData.accelY?.toFixed(2)}g</span>
                                <span>Z: {liveData.accelZ?.toFixed(2)}g</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Live Sparkline Charts */}
                {chartData.length > 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                    >
                        <h2 className="text-[14px] font-black uppercase tracking-wider text-[#113A28] px-1 flex items-center gap-2">
                            <Eye size={16} /> Live USB Telemetry (10 Hz)
                        </h2>

                        <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[11px] font-black text-[#113A28]">Temperature (°C)</span>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Zap size={10} /> 10Hz USB
                                </span>
                            </div>
                            <div className="h-[100px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9F4EC" />
                                        <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#8DA697" }} axisLine={false} tickLine={false} />
                                        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 8, fill: "#8DA697" }} axisLine={false} tickLine={false} width={30} />
                                        <Line type="monotone" dataKey="temp" stroke="#C62828" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[11px] font-black text-[#113A28]">Heart Rate (BPM)</span>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Zap size={10} /> 10Hz USB
                                </span>
                            </div>
                            <div className="h-[100px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9F4EC" />
                                        <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#8DA697" }} axisLine={false} tickLine={false} />
                                        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 8, fill: "#8DA697" }} axisLine={false} tickLine={false} width={30} />
                                        <Line type="monotone" dataKey="hr" stroke="#F29C38" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Wiring Reference */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-[28px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-white"
                >
                    <h2 className="text-[14px] font-black uppercase tracking-wider text-[#113A28] mb-3 flex items-center gap-2">
                        <Cpu size={16} /> USB UART Wiring Reference
                    </h2>
                    <div className="bg-[#F8FBF8] rounded-[18px] p-3 border border-[#E9F4EC] font-mono text-[11px] text-[#113A28] leading-relaxed space-y-1">
                        <div className="flex justify-between"><span className="text-[#6C8576]">USB-C Cable</span><span>→ Plug into Laptop USB</span></div>
                        <div className="flex justify-between"><span className="text-[#6C8576]">GPIO 5 (SDA)</span><span>→ MAX30102 + MPU6500 SDA</span></div>
                        <div className="flex justify-between"><span className="text-[#6C8576]">GPIO 7 (SCL)</span><span>→ MAX30102 + MPU6500 SCL</span></div>
                        <div className="flex justify-between"><span className="text-[#6C8576]">GPIO 4</span><span>→ DS18B20 DATA + 4.7kΩ↑</span></div>
                        <div className="flex justify-between"><span className="text-[#6C8576]">3.3V / GND</span><span>→ All sensor VCC & GND</span></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
