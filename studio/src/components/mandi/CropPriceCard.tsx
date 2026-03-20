"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ShieldCheck } from "lucide-react";
import { CropPrice } from "@/lib/mandi-data";
import { cn } from "@/lib/utils";

// Mini sparkline chart component
function Sparkline({ data, trend }: { data: number[]; trend: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  const color = trend === "Rising" ? "#10B981" : trend === "Falling" ? "#EF4444" : "#6B7280";

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${trend}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#grad-${trend})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last dot */}
      {(() => {
        const lastX = w;
        const lastY = h - ((data[data.length - 1] - min) / range) * h;
        return <circle cx={lastX} cy={lastY} r={3} fill={color} />;
      })()}
    </svg>
  );
}

type Props = {
  crop: CropPrice;
  onSell: (crop: CropPrice) => void;
  onViewBuyers: (crop: CropPrice) => void;
  index: number;
};

export function CropPriceCard({ crop, onSell, onViewBuyers, index }: Props) {
  const [livePrice, setLivePrice] = useState(crop.currentPrice);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  // Live real-time simulation tick
  useEffect(() => {
    const tick = () => {
      // 30% chance to tick price within +/- 0.5%
      if (Math.random() > 0.7) {
        const change = Math.round(livePrice * (Math.random() * 0.01 - 0.005));
        if (change !== 0) {
          setLivePrice(prev => prev + change);
          setFlash(change > 0 ? "up" : "down");
          setTimeout(() => setFlash(null), 1000);
        }
      }
      setTimeout(tick, 3000 + Math.random() * 7000); // Check every 3-10s
    };
    const timer = setTimeout(tick, 2000 + Math.random() * 5000);
    return () => clearTimeout(timer);
  }, [livePrice]);

  const change24h = (livePrice - crop.previousPrice);
  const changePercent = (change24h / crop.previousPrice) * 100;

  const isUp = change24h > 0;
  const isDown = change24h < 0;
  const aboveMSP = livePrice >= crop.msp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="bg-white rounded-[24px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-[#E9F4EC] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] bg-[#F4F9F4] border border-[#E9F4EC] flex items-center justify-center text-2xl relative overflow-hidden">
            {crop.emoji}
            {/* Live Indicator pulse */}
            <motion.div
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-[#113A28] leading-tight">{crop.name}</h3>
            <p className="text-[11px] font-bold text-[#8DA697] mt-0.5">{crop.nameHi} · per {crop.unit}</p>
          </div>
        </div>

        <Sparkline data={crop.priceHistory} trend={crop.trend} />
      </div>

      {/* Price Section */}
      <div className="flex items-end justify-between mb-3">
        <motion.div
          animate={{
            backgroundColor: flash === "up" ? "#D1FAE5" : flash === "down" ? "#FEE2E2" : "transparent"
          }}
          transition={{ duration: 0.8 }}
          className="rounded-lg -ml-2 px-2 py-1"
        >
          <div className="text-[28px] font-black text-[#113A28] leading-none tracking-tight">
            ₹{livePrice.toLocaleString("en-IN")}
          </div>
          <div className={cn("flex items-center gap-1 mt-1 text-[12px] font-bold",
            isUp ? "text-emerald-600" : isDown ? "text-red-500" : "text-gray-500"
          )}>
            {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
            <span>{isUp ? "+" : ""}{change24h}</span>
            <span className="text-[10px] opacity-70">({isUp ? "+" : ""}{changePercent.toFixed(2)}%)</span>
          </div>
        </motion.div>

        {aboveMSP && (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold">≥ MSP</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onSell(crop)}
          className="flex-1 py-3 rounded-[14px] bg-[#184F35] text-white font-bold text-[13px] hover:bg-[#123926] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
        >
          <span className="text-[15px]">💰</span> Sell Now
        </button>
        <button
          onClick={() => onViewBuyers(crop)}
          className="flex-1 py-3 rounded-[14px] bg-[#F4F9F4] text-[#184F35] font-bold text-[13px] border border-[#E9F4EC] hover:bg-[#E8EEEA] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
        >
          <span className="text-[15px]">👥</span> View Buyers
        </button>
      </div>
    </motion.div>
  );
}
