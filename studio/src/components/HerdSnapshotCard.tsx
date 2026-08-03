"use client";

import { Activity, Radio, AlertTriangle, CloudUpload } from "lucide-react";
import { motion } from "framer-motion";

interface HerdSnapshotProps {
  stats: {
    cowsMonitored: number;
    devicesOnline: number;
    flaggedToday: number;
    escalatedToCloud: number;
  };
  onTriggerDemo?: () => void;
}

export function HerdSnapshotCard({ stats, onTriggerDemo }: HerdSnapshotProps) {
  const statItems = [
    {
      label: "Cows Monitored",
      value: stats.cowsMonitored,
      icon: Activity,
      iconBg: "bg-[#F4F9F4] text-[#184F35]",
      valueColor: "text-[#113A28]",
    },
    {
      label: "Devices Online",
      value: stats.devicesOnline,
      icon: Radio,
      iconBg: "bg-blue-50 text-blue-600",
      valueColor: "text-[#113A28]",
    },
    {
      label: "Flagged Today",
      value: stats.flaggedToday,
      icon: AlertTriangle,
      iconBg: "bg-[#FFF8DF] text-[#E7A600]",
      valueColor: "text-[#E7A600]",
    },
    {
      label: "Cloud Escalated",
      value: stats.escalatedToCloud,
      icon: CloudUpload,
      iconBg: "bg-red-50 text-red-600",
      valueColor: "text-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-[32px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[17px] font-extrabold text-[#113A28]">Herd Snapshot</h3>
        {onTriggerDemo && (
          <button
            onClick={onTriggerDemo}
            className="text-[10px] font-bold bg-[#184F35] text-white px-2.5 py-1 rounded-full shadow-sm hover:bg-[#113A28] transition-all"
            title="Simulate COW-014 Anomaly Escalation"
          >
            ⚡ Demo Trigger
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#F8FBF8] p-3.5 rounded-[20px] border border-[#E9F4EC] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#6C8576] leading-tight">
                  {item.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${item.iconBg} border border-white shadow-xs shrink-0`}
                >
                  <Icon size={14} strokeWidth={2.2} />
                </div>
              </div>
              <div className={`text-[22px] font-black leading-none ${item.valueColor}`}>
                {item.value.toLocaleString()}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
