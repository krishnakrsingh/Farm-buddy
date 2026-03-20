"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { TradeTransaction, TradeStatus, generateTxHash } from "@/lib/mandi-data";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const STATUS_TO_SUPPLY_INDEX: Record<TradeStatus, number> = {
  idle: -1,
  initiated: -1,
  payment_locked: 0,
  awaiting_pickup: 1,
  in_transit: 3,
  delivered: 4,
  payment_released: 5,
};

type Props = {
  trade: TradeTransaction;
};

export function SupplyChainTimeline({ trade }: Props) {
  const [steps, setSteps] = useState(trade.supplyChain);

  // Update steps based on trade status
  useEffect(() => {
    const activeIndex = STATUS_TO_SUPPLY_INDEX[trade.status] ?? -1;
    const updated = trade.supplyChain.map((step, i) => ({
      ...step,
      status: i < activeIndex ? "completed" as const :
              i === activeIndex ? "active" as const : "pending" as const,
      verified: i < activeIndex,
      timestamp: i <= activeIndex ? new Date(Date.now() - (activeIndex - i) * 300000).toLocaleTimeString() : null,
      verificationHash: i < activeIndex ? generateTxHash().slice(0, 18) + "..." : null,
    }));
    setSteps(updated);
  }, [trade.status, trade.supplyChain]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-[#E9F4EC]"
    >
      <h3 className="text-[16px] font-black text-[#113A28] mb-4 flex items-center gap-2">
        <span className="text-[18px]">📦</span> Supply Chain Traceability
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[22px] top-3 bottom-3 w-[2px] bg-[#E9F4EC]" />

        <div className="space-y-1">
          {steps.map((step, i) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "relative flex items-start gap-4 p-3 rounded-[16px] transition-all",
                  isActive && "bg-[#F4F9F4] border border-[#E9F4EC]",
                )}
              >
                {/* Timeline dot */}
                <div className="relative z-10 shrink-0">
                  {isCompleted ? (
                    <div className="w-[44px] h-[44px] rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-[44px] h-[44px] rounded-full bg-[#184F35] flex items-center justify-center shadow-md"
                    >
                      <Loader2 size={18} className="text-white animate-spin" />
                    </motion.div>
                  ) : (
                    <div className="w-[44px] h-[44px] rounded-full bg-[#F4F9F4] border-2 border-[#E9F4EC] flex items-center justify-center text-[18px]">
                      {step.icon}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[13px] font-extrabold",
                      isCompleted ? "text-emerald-700" : isActive ? "text-[#113A28]" : "text-[#8DA697]"
                    )}>
                      {step.label}
                    </span>
                    {step.verified && (
                      <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck size={9} />
                        <span className="text-[8px] font-bold">Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    {step.timestamp && (
                      <span className="text-[10px] font-bold text-[#8DA697] flex items-center gap-1">
                        <Clock size={10} /> {step.timestamp}
                      </span>
                    )}
                    {step.verificationHash && (
                      <span className="text-[9px] font-mono text-[#B7D8C6]">{step.verificationHash}</span>
                    )}
                  </div>

                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] font-medium text-[#184F35] mt-1.5 bg-white/60 rounded-lg px-2 py-1 inline-block"
                    >
                      Processing on blockchain...
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
