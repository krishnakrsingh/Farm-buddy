"use client";

import { motion } from "framer-motion";
import { X, ShieldCheck, Star, CheckCircle2, TrendingUp } from "lucide-react";
import { Buyer, BUYERS } from "@/lib/mandi-data";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cropName: string;
};

function TrustBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-emerald-500" : value >= 75 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full h-1.5 bg-[#E9F4EC] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}

export function BuyerPanel({ isOpen, onClose, cropName }: Props) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 pb-3 border-b border-[#E9F4EC] z-10 rounded-t-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-black text-[#113A28]">Verified Buyers</h2>
              <p className="text-[12px] font-bold text-[#8DA697] mt-0.5">For {cropName} · Sorted by trust score</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#F4F9F4] flex items-center justify-center hover:bg-[#E8EEEA]">
              <X size={18} className="text-[#6C8576]" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {BUYERS.sort((a, b) => b.trustScore - a.trustScore).map((buyer, i) => (
            <motion.div
              key={buyer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#F8FBF8] rounded-[24px] p-4 border border-[#E9F4EC] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <img src={buyer.avatar} className="w-14 h-14 rounded-[18px] object-cover border-2 border-white shadow-sm" alt={buyer.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-extrabold text-[#113A28] truncate">{buyer.name}</h3>
                    <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                      buyer.badge === "High Trust Buyer" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      buyer.badge === "Verified Buyer" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      "bg-gray-50 text-gray-600 border-gray-200"
                    )}>{buyer.badge}</span>
                  </div>
                  <p className="text-[11px] font-medium text-[#8DA697] mt-0.5">{buyer.company}</p>
                  <p className="text-[10px] font-bold text-[#B7D8C6] mt-0.5">{buyer.location} · {buyer.distance} km away</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[18px] font-black text-[#184F35]">₹{buyer.offerPrice}</p>
                  <p className="text-[9px] font-bold text-[#8DA697]">per Quintal</p>
                </div>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white rounded-[12px] p-2 text-center border border-[#E9F4EC]">
                  <p className="text-[16px] font-black text-[#184F35]">{buyer.trustScore}%</p>
                  <p className="text-[8px] font-bold text-[#8DA697] uppercase tracking-wider">Trust</p>
                </div>
                <div className="bg-white rounded-[12px] p-2 text-center border border-[#E9F4EC]">
                  <p className="text-[16px] font-black text-[#113A28]">{buyer.completedTrades}</p>
                  <p className="text-[8px] font-bold text-[#8DA697] uppercase tracking-wider">Trades</p>
                </div>
                <div className="bg-white rounded-[12px] p-2 text-center border border-[#E9F4EC]">
                  <p className="text-[16px] font-black text-emerald-600">{buyer.paymentSuccessRate}%</p>
                  <p className="text-[8px] font-bold text-[#8DA697] uppercase tracking-wider">Pay Rate</p>
                </div>
              </div>

              {/* Reliability Bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold text-[#6C8576] uppercase tracking-wider">Reliability</span>
                  <span className="text-[10px] font-black text-[#184F35]">{buyer.trustScore}%</span>
                </div>
                <TrustBar value={buyer.trustScore} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
