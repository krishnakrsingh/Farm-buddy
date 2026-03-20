"use client";

import { motion } from "framer-motion";
import {
  IndianRupee, Clock, Sparkles, ArrowRight,
  CheckCircle2, AlertTriangle, Tag, Shield, Users
} from "lucide-react";
import type { EligibilityResult, ImpactLevel, SchemeStatus } from "@/lib/schemes-data";

interface SchemeCardProps {
  result: EligibilityResult;
  index: number;
  onViewSteps: () => void;
  onAskAI: () => void;
}

function ImpactBadge({ level }: { level: ImpactLevel }) {
  const config = {
    HIGH: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", label: "HIGH IMPACT" },
    MEDIUM: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "MEDIUM IMPACT" },
    LOW: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", label: "LOW IMPACT" },
  };
  const c = config[level];
  return (
    <span className={`${c.bg} ${c.text} ${c.border} border text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider`}>
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: SchemeStatus }) {
  if (status === "Closing Soon") {
    return (
      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
        <Clock size={10} /> Closing Soon
      </span>
    );
  }
  return (
    <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
      <CheckCircle2 size={10} /> Active
    </span>
  );
}

export function SchemeCard({ result, index, onViewSteps, onAskAI }: SchemeCardProps) {
  const { scheme } = result;

  const deadlineText = scheme.deadline
    ? `Apply by ${new Date(scheme.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : "Open — No deadline";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08, ease: "easeOut" }}
      className="bg-white rounded-[22px] border border-[#E6EEE8] shadow-[0_6px_24px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-shadow duration-300"
    >
      <div className="p-4 pb-3">
        {/* Top Row: Badges */}
        <div className="flex items-center justify-between mb-2.5">
          <ImpactBadge level={scheme.impactLevel} />
          <StatusBadge status={scheme.status} />
        </div>

        {/* Scheme Name */}
        <h3 className="text-[15px] font-extrabold text-[#113A28] leading-snug mb-1.5">
          {scheme.shortName}
        </h3>
        <p className="text-[12px] font-medium text-[#6C8576] leading-relaxed mb-3">
          {scheme.description.length > 120 ? scheme.description.slice(0, 120) + "…" : scheme.description}
        </p>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 gap-2 mb-3">
          {/* What you get */}
          <div className="flex items-start gap-2.5 bg-emerald-50/60 rounded-xl p-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <IndianRupee size={14} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">What you get</p>
              <p className="text-[13px] font-extrabold text-[#113A28]">{scheme.benefitLabel}</p>
            </div>
          </div>

          {/* Who it's for */}
          <div className="flex items-start gap-2.5 bg-blue-50/50 rounded-xl p-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <Users size={14} className="text-blue-700" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Who it&apos;s for</p>
              <p className="text-[12px] font-semibold text-[#2A4A3A]">{scheme.eligibility.description}</p>
            </div>
          </div>

          {/* Why it matters */}
          <div className="flex items-start gap-2.5 bg-amber-50/50 rounded-xl p-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <Shield size={14} className="text-amber-700" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Why it matters</p>
              <p className="text-[12px] font-semibold text-[#2A4A3A]">{scheme.whyItMatters}</p>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-1.5 mb-3">
          <Clock size={12} className="text-[#8DA697]" />
          <span className="text-[11px] font-semibold text-[#6C8576]">{deadlineText}</span>
        </div>

        {/* Match reasons */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {result.matchReasons.slice(0, 3).map((reason, i) => (
            <span
              key={i}
              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              <CheckCircle2 size={9} /> {reason}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-[#EDF3EF]">
        <button
          onClick={onViewSteps}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-[#184F35] hover:bg-emerald-50/50 transition-colors"
        >
          <ArrowRight size={14} /> View Steps
        </button>
        <div className="w-px bg-[#EDF3EF]" />
        <button
          onClick={onAskAI}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-purple-700 hover:bg-purple-50/50 transition-colors"
        >
          <Sparkles size={14} /> Ask AI
        </button>
      </div>
    </motion.div>
  );
}
