"use client";

import { motion } from "framer-motion";
import { X, Copy, ExternalLink, ShieldCheck, Clock, Users, Hash, Box } from "lucide-react";
import { TradeTransaction } from "@/lib/mandi-data";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  trade: TradeTransaction;
  isOpen: boolean;
  onClose: () => void;
};

export function BlockchainExplorer({ trade, isOpen, onClose }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  if (!isOpen) return null;

  const logEntries = [
    { time: "00:00:00", event: "Smart Contract Deployed", hash: trade.smartContractId.slice(0, 18) + "...", type: "contract" },
    { time: "00:00:02", event: "Escrow Funded by Buyer", hash: trade.txHash.slice(0, 18) + "...", type: "transaction" },
    { time: "00:00:05", event: "Trade Terms Locked", hash: "0x" + Math.random().toString(16).slice(2, 14) + "...", type: "event" },
    { time: "00:01:30", event: "Pickup Confirmation", hash: "0x" + Math.random().toString(16).slice(2, 14) + "...", type: "event" },
    { time: "00:15:00", event: "GPS Checkpoint Verified", hash: "0x" + Math.random().toString(16).slice(2, 14) + "...", type: "verification" },
    { time: "00:45:00", event: "Delivery Confirmed", hash: "0x" + Math.random().toString(16).slice(2, 14) + "...", type: "event" },
    { time: "00:45:03", event: "Payment Auto-Released", hash: "0x" + Math.random().toString(16).slice(2, 14) + "...", type: "transaction" },
  ];

  const typeColors: Record<string, string> = {
    contract: "bg-purple-100 text-purple-700",
    transaction: "bg-emerald-100 text-emerald-700",
    event: "bg-blue-100 text-blue-700",
    verification: "bg-amber-100 text-amber-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-[#0D1117] text-white rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0D1117]/95 backdrop-blur-xl p-5 pb-4 border-b border-white/10 z-10 rounded-t-[32px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-emerald-500/20 flex items-center justify-center">
                <Box size={20} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-[16px] font-black text-white">Blockchain Explorer</h2>
                <p className="text-[11px] font-mono text-white/40">{trade.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Key Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-[16px] p-3 border border-white/10">
              <div className="flex items-center gap-1.5 mb-2">
                <Hash size={12} className="text-emerald-400" />
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Block</span>
              </div>
              <p className="text-[14px] font-black text-white">{trade.blockId}</p>
            </div>
            <div className="bg-white/5 rounded-[16px] p-3 border border-white/10">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-blue-400" />
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Timestamp</span>
              </div>
              <p className="text-[12px] font-bold text-white">{new Date(trade.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="bg-white/5 rounded-[16px] p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Transaction Hash</span>
              <button onClick={() => copyToClipboard(trade.txHash, "tx")} className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300">
                <Copy size={10} /> {copiedField === "tx" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] font-mono text-emerald-400 break-all leading-relaxed">{trade.txHash}</p>
          </div>

          {/* Smart Contract */}
          <div className="bg-white/5 rounded-[16px] p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Smart Contract</span>
              <button onClick={() => copyToClipboard(trade.smartContractId, "sc")} className="text-[10px] font-bold text-purple-400 flex items-center gap-1 hover:text-purple-300">
                <Copy size={10} /> {copiedField === "sc" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] font-mono text-purple-400 break-all leading-relaxed">{trade.smartContractId}</p>
          </div>

          {/* Participants */}
          <div className="bg-white/5 rounded-[16px] p-4 border border-white/10">
            <div className="flex items-center gap-1.5 mb-3">
              <Users size={12} className="text-blue-400" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Participants</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">🧑‍🌾</span>
                  <span className="text-[12px] font-bold text-white/80">Farmer</span>
                </div>
                <span className="text-[11px] font-mono text-white/50">{trade.farmer.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">🏪</span>
                  <span className="text-[12px] font-bold text-white/80">Buyer</span>
                </div>
                <span className="text-[11px] font-mono text-white/50">{trade.buyer.name}</span>
              </div>
              {trade.transporter && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">🚛</span>
                    <span className="text-[12px] font-bold text-white/80">Transporter</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/50">{trade.transporter.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Log */}
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Transaction Log</p>
            <div className="space-y-1.5">
              {logEntries.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 bg-white/5 rounded-[12px] p-2.5 border border-white/5"
                >
                  <span className="text-[9px] font-mono text-white/30 w-[60px] shrink-0">{entry.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white/80 truncate">{entry.event}</p>
                    <p className="text-[9px] font-mono text-white/30 truncate">{entry.hash}</p>
                  </div>
                  <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full uppercase", typeColors[entry.type])}>{entry.type}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[16px] p-4 flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-emerald-400">Blockchain Verified</p>
              <p className="text-[10px] text-emerald-400/60 font-medium">This transaction is immutably recorded and cryptographically verified.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
