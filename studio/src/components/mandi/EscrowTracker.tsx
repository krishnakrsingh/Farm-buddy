"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Truck, Package, CheckCircle2, Clock, ArrowRight, Fingerprint, Eye } from "lucide-react";
import { TradeTransaction, TradeStatus, generateTxHash } from "@/lib/mandi-data";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<TradeStatus, { label: string; icon: any; color: string; bgColor: string; description: string }> = {
  idle: { label: "Idle", icon: Clock, color: "text-gray-500", bgColor: "bg-gray-50", description: "" },
  initiated: { label: "Trade Initiated", icon: Fingerprint, color: "text-blue-600", bgColor: "bg-blue-50", description: "Smart contract deployed on blockchain" },
  payment_locked: { label: "Payment Locked", icon: Lock, color: "text-amber-600", bgColor: "bg-amber-50", description: "₹{amount} secured in escrow smart contract" },
  awaiting_pickup: { label: "Awaiting Pickup", icon: Package, color: "text-purple-600", bgColor: "bg-purple-50", description: "Waiting for transporter to collect goods" },
  in_transit: { label: "In Transit", icon: Truck, color: "text-indigo-600", bgColor: "bg-indigo-50", description: "Goods are being transported to {mandi}" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-50", description: "Delivery confirmed at {mandi}" },
  payment_released: { label: "Payment Released", icon: ShieldCheck, color: "text-emerald-600", bgColor: "bg-emerald-50", description: "₹{amount} transferred to your account" },
};

const STATUS_ORDER: TradeStatus[] = ["payment_locked", "awaiting_pickup", "in_transit", "delivered", "payment_released"];

type Props = {
  trade: TradeTransaction;
  onStatusChange: (status: TradeStatus) => void;
  onViewBlockchain: () => void;
};

export function EscrowTracker({ trade, onStatusChange, onViewBlockchain }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-progress through statuses
  useEffect(() => {
    const idx = STATUS_ORDER.indexOf(trade.status);
    setCurrentIndex(idx >= 0 ? idx : 0);

    if (trade.status === "payment_released") return;

    const timer = setTimeout(() => {
      const nextIdx = STATUS_ORDER.indexOf(trade.status) + 1;
      if (nextIdx < STATUS_ORDER.length) {
        onStatusChange(STATUS_ORDER[nextIdx]);
      }
    }, 4000 + Math.random() * 2000); // 4–6 seconds between transitions

    return () => clearTimeout(timer);
  }, [trade.status, onStatusChange]);

  const config = STATUS_CONFIG[trade.status];
  const Icon = config.icon;
  const description = config.description
    .replace("{amount}", trade.totalAmount.toLocaleString("en-IN"))
    .replace("{mandi}", trade.mandi.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-[#E9F4EC]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[16px] font-black text-[#113A28] flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#184F35]" />
            Escrow Tracking
          </h3>
          <p className="text-[11px] font-medium text-[#8DA697] mt-0.5 font-mono">{trade.id}</p>
        </div>
        <button onClick={onViewBlockchain} className="px-3 py-1.5 rounded-full bg-[#F4F9F4] border border-[#E9F4EC] text-[10px] font-bold text-[#184F35] hover:bg-[#E8EEEA] transition-colors flex items-center gap-1">
          <Eye size={12} /> View on Chain
        </button>
      </div>

      {/* Current Status */}
      <AnimatePresence mode="wait">
        <motion.div
          key={trade.status}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn("rounded-[20px] p-4 mb-4 border", config.bgColor,
            trade.status === "payment_released" ? "border-emerald-200" : "border-white"
          )}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={trade.status !== "payment_released" ? { scale: [1, 1.15, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={cn("w-12 h-12 rounded-[16px] flex items-center justify-center", config.bgColor, config.color)}
            >
              <Icon size={24} />
            </motion.div>
            <div>
              <h4 className="text-[16px] font-extrabold text-[#113A28]">{config.label}</h4>
              <p className="text-[12px] font-medium text-[#6C8576] mt-0.5">{description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Status Timeline */}
      <div className="flex items-center justify-between px-2">
        {STATUS_ORDER.map((s, i) => {
          const sConf = STATUS_CONFIG[s];
          const SIcon = sConf.icon;
          const isCurrent = trade.status === s;
          const isPast = STATUS_ORDER.indexOf(trade.status) > i;

          return (
            <div key={s} className="flex items-center">
              <motion.div
                animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all border-2",
                  isPast ? "bg-emerald-500 border-emerald-500 text-white" :
                  isCurrent ? "bg-white border-[#184F35] text-[#184F35] shadow-md" :
                  "bg-[#F4F9F4] border-[#E9F4EC] text-[#8DA697]"
                )}
              >
                {isPast ? <CheckCircle2 size={16} /> : <SIcon size={14} />}
              </motion.div>
              {i < STATUS_ORDER.length - 1 && (
                <div className={cn("w-4 sm:w-6 h-0.5 mx-0.5",
                  isPast ? "bg-emerald-500" : "bg-[#E9F4EC]"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Amount Info */}
      <div className="mt-4 bg-[#F8FBF8] rounded-[16px] p-3 border border-[#E9F4EC] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-[#8DA697] uppercase tracking-wider">Locked Amount</p>
          <p className="text-[18px] font-black text-[#184F35]">₹{trade.totalAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-[#8DA697] uppercase tracking-wider">{trade.crop.emoji} {trade.crop.name}</p>
          <p className="text-[14px] font-extrabold text-[#113A28]">{trade.quantity} {trade.crop.unit}s</p>
        </div>
      </div>
    </motion.div>
  );
}
