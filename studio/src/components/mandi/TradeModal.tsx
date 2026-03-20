"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ShieldCheck, Truck, Package, MapPin } from "lucide-react";
import { CropPrice, Buyer, Transporter, MandiLocation, BUYERS, TRANSPORTERS, MANDIS, generateTxHash, generateBlockId, generateContractId, createSupplyChainSteps, TradeTransaction } from "@/lib/mandi-data";
import { cn } from "@/lib/utils";

type Props = {
  crop: CropPrice;
  isOpen: boolean;
  onClose: () => void;
  onTradeConfirm: (trade: TradeTransaction) => void;
};

export function TradeModal({ crop, isOpen, onClose, onTradeConfirm }: Props) {
  const [step, setStep] = useState<"details" | "buyer" | "transport" | "confirm">("details");
  const [quantity, setQuantity] = useState(10);
  const [selectedMandi, setSelectedMandi] = useState<MandiLocation>(MANDIS[0]);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [selectedTransporter, setSelectedTransporter] = useState<Transporter | null>(null);

  const totalAmount = quantity * crop.currentPrice;

  const handleConfirm = () => {
    const trade: TradeTransaction = {
      id: `TRD-${Date.now()}`,
      txHash: generateTxHash(),
      smartContractId: generateContractId(),
      blockId: generateBlockId(),
      timestamp: new Date().toISOString(),
      crop,
      quantity,
      totalAmount,
      buyer: selectedBuyer!,
      transporter: selectedTransporter,
      mandi: selectedMandi,
      status: "payment_locked",
      supplyChain: createSupplyChainSteps(),
      farmer: { name: "Krishna Singh", id: "FRM-2024-00891", location: "Pipli, Haryana" },
    };
    onTradeConfirm(trade);
    onClose();
    // Reset state
    setStep("details");
    setSelectedBuyer(null);
    setSelectedTransporter(null);
    setQuantity(10);
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes("High Trust") || badge.includes("Premium")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (badge.includes("Verified")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 pb-3 border-b border-[#E9F4EC] z-10 rounded-t-[32px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{crop.emoji}</span>
                <div>
                  <h2 className="text-[18px] font-black text-[#113A28]">Sell {crop.name}</h2>
                  <p className="text-[12px] font-bold text-[#8DA697]">₹{crop.currentPrice}/{crop.unit}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#F4F9F4] flex items-center justify-center hover:bg-[#E8EEEA] transition-colors">
                <X size={18} className="text-[#6C8576]" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex gap-1.5 mt-4">
              {["details", "buyer", "transport", "confirm"].map((s, i) => (
                <div key={s} className={cn("flex-1 h-1 rounded-full transition-colors",
                  ["details", "buyer", "transport", "confirm"].indexOf(step) >= i ? "bg-[#184F35]" : "bg-[#E9F4EC]"
                )} />
              ))}
            </div>
          </div>

          <div className="p-5 space-y-5">
            <AnimatePresence mode="wait">
              {/* Step 1: Trade Details */}
              {step === "details" && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-2 block">Quantity ({crop.unit}s)</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 5))} className="w-12 h-12 rounded-[14px] bg-[#F4F9F4] border border-[#E9F4EC] text-[#184F35] font-black text-xl hover:bg-[#E8EEEA] transition-colors">−</button>
                      <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="flex-1 text-center text-[28px] font-black text-[#113A28] bg-[#F8FBF8] rounded-[14px] border border-[#E9F4EC] py-2 outline-none focus:border-[#184F35]" />
                      <button onClick={() => setQuantity(quantity + 5)} className="w-12 h-12 rounded-[14px] bg-[#F4F9F4] border border-[#E9F4EC] text-[#184F35] font-black text-xl hover:bg-[#E8EEEA] transition-colors">+</button>
                    </div>
                  </div>

                  {/* Mandi Selection */}
                  <div>
                    <label className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-2 block">Select Mandi</label>
                    <div className="space-y-2">
                      {MANDIS.slice(0, 3).map((m) => (
                        <button key={m.id} onClick={() => setSelectedMandi(m)} className={cn(
                          "w-full p-3 rounded-[16px] border flex items-center justify-between transition-all",
                          selectedMandi.id === m.id ? "bg-[#184F35] text-white border-[#184F35]" : "bg-[#F8FBF8] border-[#E9F4EC] hover:bg-[#F4F9F4]"
                        )}>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span className="text-[13px] font-bold">{m.name}</span>
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                              selectedMandi.id === m.id ? "bg-white/20" : "bg-[#E9F4EC]"
                            )}>{m.distance} km</span>
                          </div>
                          <span className="text-[13px] font-black">₹{m.currentPrice}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-[#F4F9F4] rounded-[20px] p-4 border border-[#E9F4EC]">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-[#6C8576]">Estimated Total</span>
                      <span className="text-[24px] font-black text-[#184F35]">₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button onClick={() => setStep("buyer")} className="w-full py-4 rounded-[16px] bg-[#184F35] text-white font-bold text-[15px] hover:bg-[#123926] transition-all shadow-md flex items-center justify-center gap-2">
                    Select Buyer <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Select Buyer */}
              {step === "buyer" && (
                <motion.div key="buyer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <p className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider">Suggested Buyers</p>
                  {BUYERS.map((b) => (
                    <button key={b.id} onClick={() => { setSelectedBuyer(b); setStep("transport"); }}
                      className={cn("w-full p-4 rounded-[20px] border text-left transition-all hover:shadow-md",
                        selectedBuyer?.id === b.id ? "bg-[#184F35] text-white border-[#184F35]" : "bg-white border-[#E9F4EC]"
                      )}>
                      <div className="flex items-center gap-3">
                        <img src={b.avatar} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" alt={b.name} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-extrabold truncate">{b.name}</span>
                            <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border",
                              selectedBuyer?.id === b.id ? "bg-white/20 border-white/30 text-white" : getBadgeColor(b.badge)
                            )}>{b.badge}</span>
                          </div>
                          <p className={cn("text-[11px] font-medium mt-0.5", selectedBuyer?.id === b.id ? "text-white/70" : "text-[#8DA697]")}>
                            {b.company} · {b.location} ({b.distance} km)
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[16px] font-black">₹{b.offerPrice}</div>
                          <div className={cn("text-[10px] font-bold", selectedBuyer?.id === b.id ? "text-white/70" : "text-emerald-600")}>{b.trustScore}% trust</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setStep("details")} className="w-full py-3 text-[13px] font-bold text-[#6C8576] hover:text-[#184F35]">← Back</button>
                </motion.div>
              )}

              {/* Step 3: Select Transport */}
              {step === "transport" && (
                <motion.div key="transport" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <p className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider">Available Transporters</p>
                  {TRANSPORTERS.map((t) => (
                    <button key={t.id} onClick={() => { setSelectedTransporter(t); setStep("confirm"); }}
                      className="w-full p-4 rounded-[20px] border border-[#E9F4EC] bg-white text-left transition-all hover:shadow-md hover:border-[#B7D8C6]">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#F4F9F4] border border-[#E9F4EC] flex items-center justify-center">
                          <Truck size={20} className="text-[#184F35]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-extrabold text-[#113A28]">{t.name}</span>
                            <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", getBadgeColor(t.badge))}>{t.badge}</span>
                          </div>
                          <p className="text-[11px] font-medium text-[#8DA697] mt-0.5">{t.vehicleType} · {t.vehicleNumber}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[14px] font-black text-[#113A28]">₹{t.costEstimate}</div>
                          <div className="text-[10px] font-bold text-[#8DA697]">ETA {t.eta}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setStep("buyer")} className="w-full py-3 text-[13px] font-bold text-[#6C8576] hover:text-[#184F35]">← Back</button>
                </motion.div>
              )}

              {/* Step 4: Confirm */}
              {step === "confirm" && selectedBuyer && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="bg-[#F8FBF8] rounded-[20px] p-4 border border-[#E9F4EC] space-y-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6C8576] font-medium">Crop</span>
                      <span className="font-bold text-[#113A28]">{crop.emoji} {crop.name} × {quantity} {crop.unit}s</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6C8576] font-medium">Buyer</span>
                      <span className="font-bold text-[#113A28]">{selectedBuyer.name}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6C8576] font-medium">Mandi</span>
                      <span className="font-bold text-[#113A28]">{selectedMandi.name}</span>
                    </div>
                    {selectedTransporter && (
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#6C8576] font-medium">Transport</span>
                        <span className="font-bold text-[#113A28]">{selectedTransporter.name} (₹{selectedTransporter.costEstimate})</span>
                      </div>
                    )}
                    <div className="border-t border-[#E9F4EC] pt-3 flex justify-between">
                      <span className="text-[14px] font-bold text-[#6C8576]">Total Payout</span>
                      <span className="text-[22px] font-black text-[#184F35]">₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-[16px] p-3 flex items-start gap-2">
                    <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-blue-800 leading-relaxed">
                      Payment will be secured in a blockchain smart contract escrow. Funds are released automatically upon delivery confirmation.
                    </p>
                  </div>

                  <button onClick={handleConfirm} className="w-full py-4 rounded-[16px] bg-gradient-to-r from-[#184F35] to-[#2D7A53] text-white font-bold text-[15px] hover:from-[#123926] hover:to-[#1D6840] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
                    <ShieldCheck size={18} /> Secure Trade via Smart Contract
                  </button>
                  <button onClick={() => setStep("transport")} className="w-full py-3 text-[13px] font-bold text-[#6C8576] hover:text-[#184F35]">← Back</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
