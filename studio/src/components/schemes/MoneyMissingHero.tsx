"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, Sparkles, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import type { EligibilityResult } from "@/lib/schemes-data";
import { calculateTotalBenefit, getBenefitBreakdown } from "@/lib/schemes-engine";

interface MoneyMissingHeroProps {
  results: EligibilityResult[];
}

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("en-IN"));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return <span>{display}</span>;
}

export function MoneyMissingHero({ results }: MoneyMissingHeroProps) {
  const total = calculateTotalBenefit(results);
  const breakdown = getBenefitBreakdown(results);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] p-[1px]"
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 opacity-80" />

      {/* Card body */}
      <div className="relative rounded-[27px] bg-gradient-to-br from-[#0C2D1B] via-[#133D26] to-[#0A3A20] p-5 overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-teal-400/15 blur-2xl" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5 mb-4"
        >
          <div className="flex items-center gap-1.5 bg-amber-400/15 backdrop-blur-sm border border-amber-400/25 px-3 py-1 rounded-full">
            <Sparkles size={12} className="text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300 tracking-wide uppercase">Recommended for your farm</span>
          </div>
        </motion.div>

        {/* Title */}
        <p className="text-emerald-300/80 text-[13px] font-semibold mb-1">
          You&apos;re missing out on
        </p>

        {/* Main amount */}
        <motion.div
          className="flex items-baseline gap-1 mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <IndianRupee size={28} className="text-white/90 mr-[-2px]" strokeWidth={2.5} />
          <span className="text-[42px] font-black text-white leading-none tracking-tight">
            <AnimatedCounter value={total} />
          </span>
          <span className="text-emerald-300/60 text-sm font-bold ml-1 self-end mb-1.5">/year</span>
        </motion.div>

        <p className="text-emerald-200/50 text-[12px] font-medium mb-4">
          in unclaimed government benefits
        </p>

        {/* Breakdown toggle */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-1.5 text-emerald-300/70 hover:text-emerald-200 transition-colors text-[12px] font-bold mb-2"
        >
          {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showBreakdown ? "Hide" : "See"} benefit breakdown ({breakdown.length} schemes)
        </button>

        {/* Breakdown list */}
        <motion.div
          initial={false}
          animate={{ height: showBreakdown ? "auto" : 0, opacity: showBreakdown ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="space-y-2 pt-2 border-t border-emerald-500/20">
            {breakdown.map((item, i) => (
              <motion.div
                key={item.schemeName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: showBreakdown ? 1 : 0, x: showBreakdown ? 0 : -10 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[12px] font-semibold text-emerald-100/70">{item.schemeName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[12px] font-bold text-white/90">₹{item.amount.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-emerald-300/40">/yr</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-500/15"
        >
          <div className="flex items-center gap-1 text-emerald-400">
            <TrendingUp size={14} />
            <span className="text-[11px] font-bold">Claim these benefits to boost your income</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
