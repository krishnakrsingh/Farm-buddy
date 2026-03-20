"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ChevronRight, Tractor, Users, Map as MapIcon, Box, Camera, Loader2, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { RentalCategory } from "@/lib/mandi-data";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const CATEGORIES: { id: RentalCategory; label: string; icon: any; color: string }[] = [
  { id: "equipment", label: "Equipment & Tractors", icon: Tractor, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "labor", label: "Farm Workers", icon: Users, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "land", label: "Land for Lease", icon: MapIcon, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "storage", label: "Storage Space", icon: Box, color: "text-purple-600 bg-purple-50 border-purple-200" },
];

export function PostListingModal({ isOpen, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"category" | "details" | "pricing" | "publishing">("category");
  const [selectedCategory, setSelectedCategory] = useState<RentalCategory | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("per hour");

  const closeAndReset = () => {
    onClose();
    setTimeout(() => {
      setStep("category");
      setSelectedCategory(null);
      setTitle("");
      setPrice("");
      setUnit("per hour");
    }, 300);
  };

  const handlePublish = () => {
    setStep("publishing");
    setTimeout(() => {
      onSuccess();
      closeAndReset();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={closeAndReset}
      >
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 pb-3 border-b border-[#E9F4EC] z-10 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-[#113A28]">Post a Listing</h2>
                <p className="text-[12px] font-bold text-[#8DA697] mt-0.5">Offer your resources to fellow farmers</p>
              </div>
              <button onClick={closeAndReset} className="w-10 h-10 rounded-full bg-[#F4F9F4] flex items-center justify-center hover:bg-[#E8EEEA] transition-colors">
                <X size={18} className="text-[#6C8576]" />
              </button>
            </div>

            {/* Step Progress */}
            {step !== "publishing" && (
              <div className="flex gap-1.5 mt-4">
                {["category", "details", "pricing"].map((s, i) => {
                  const currentIdx = ["category", "details", "pricing"].indexOf(step);
                  return (
                    <div key={s} className={cn("flex-1 h-1.5 rounded-full transition-colors",
                      currentIdx >= i ? "bg-[#184F35]" : "bg-[#E9F4EC]"
                    )} />
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-5 flex-1 pb-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Category Selection */}
              {step === "category" && (
                <motion.div key="category" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h3 className="text-[14px] font-extrabold text-[#113A28] mb-2">What are you offering?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            if (cat.id === "labor") setUnit("per day");
                            else if (cat.id === "land") setUnit("per acre/season");
                            else setUnit("per hour");
                            setStep("details");
                          }}
                          className="w-full p-4 rounded-[20px] border border-[#E9F4EC] hover:border-[#184F35] bg-white text-left transition-all hover:shadow-md flex items-center justify-between group active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("w-12 h-12 rounded-[14px] border flex items-center justify-center transition-colors", cat.color, "group-hover:bg-opacity-80")}>
                              <Icon size={20} />
                            </div>
                            <span className="text-[15px] font-extrabold text-[#113A28]">{cat.label}</span>
                          </div>
                          <ChevronRight size={18} className="text-[#8DA697] group-hover:text-[#184F35] transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === "details" && selectedCategory && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div>
                    <label className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-2 block">Title</label>
                    <input
                      type="text"
                      placeholder={
                        selectedCategory === "equipment" ? "e.g. Mahindra 575 DI Tractor" :
                        selectedCategory === "labor" ? "e.g. Experienced Harvester Team" :
                        selectedCategory === "land" ? "e.g. 5 Acres Irrigated Farmland" : "e.g. 50MT Cold Storage"
                      }
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-[#F8FBF8] border border-[#E9F4EC] rounded-[16px] px-4 py-3.5 text-[15px] font-bold text-[#113A28] outline-none focus:border-[#184F35] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-2 block">Photo (Optional)</label>
                    <button className="w-full h-24 rounded-[16px] border-2 border-dashed border-[#B7D8C6] bg-[#F4F9F4] flex flex-col items-center justify-center text-[#6C8576] hover:bg-[#E8EEEA] hover:border-[#8DA697] transition-all">
                      <Camera size={24} className="mb-1 text-[#8DA697]" />
                      <span className="text-[12px] font-bold">Tap to upload photo</span>
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-[16px] p-4 flex gap-3">
                    <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-bold text-blue-800">Why Add Details?</p>
                      <p className="text-[11px] font-medium text-blue-700 leading-relaxed mt-0.5">Listings with clear titles and photos receive 3x more inquiries from other farmers.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep("category")} className="w-14 py-3.5 rounded-[14px] bg-[#F4F9F4] text-[#8DA697] font-bold flex items-center justify-center hover:bg-[#E8EEEA] transition-colors">
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <button
                      disabled={!title.trim()}
                      onClick={() => setStep("pricing")}
                      className="flex-1 py-3.5 rounded-[16px] bg-[#184F35] text-white font-bold text-[15px] hover:bg-[#123926] disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      Next Step <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Pricing */}
              {step === "pricing" && (
                <motion.div key="pricing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-2 block">Set Your Price</label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-black text-[#113A28]">₹</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                          className="w-full bg-[#F8FBF8] border border-[#E9F4EC] rounded-[16px] pl-9 pr-4 py-4 text-[24px] font-black text-[#113A28] outline-none focus:border-[#184F35] transition-colors"
                        />
                      </div>
                      <select
                        value={unit}
                        onChange={e => setUnit(e.target.value)}
                        className="bg-[#F4F9F4] border border-[#E9F4EC] rounded-[16px] px-4 py-4.5 h-[64px] text-[13px] font-bold text-[#113A28] outline-none focus:border-[#184F35] cursor-pointer"
                      >
                        <option value="per hour">per hour</option>
                        <option value="per day">per day</option>
                        <option value="per acre">per acre</option>
                        <option value="per season">per acre/season</option>
                        <option value="per quintal/day">per quintal/day</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#F8FBF8] border border-[#E9F4EC] rounded-[20px] p-4 text-center">
                    <p className="text-[11px] font-bold text-[#8DA697] uppercase tracking-wider">Preview</p>
                    <p className="text-[16px] font-extrabold text-[#113A28] mt-1">{title}</p>
                    <p className="text-[20px] font-black text-[#184F35] mt-1">₹{price || "0"} <span className="text-[12px] font-bold text-[#6C8576]">{unit}</span></p>
                  </div>

                  {/* Blockchain Secured Notice */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-[16px] p-4 flex gap-3">
                    <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-emerald-800">Secured via Smart Contract</p>
                      <p className="text-[11px] font-medium text-emerald-700 leading-relaxed mt-0.5">When someone books your listing, their payment will be held securely in escrow and released automatically upon service completion.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep("details")} className="w-14 py-4 rounded-[14px] bg-[#F4F9F4] text-[#8DA697] font-bold flex items-center justify-center hover:bg-[#E8EEEA] transition-colors">
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <button
                      disabled={!price}
                      onClick={handlePublish}
                      className="flex-1 py-4 rounded-[16px] bg-gradient-to-r from-[#184F35] to-[#2D7A53] text-white font-bold text-[15px] hover:from-[#123926] hover:to-[#1D6840] disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <ShieldCheck size={18} /> Publish Listing
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Publishing Animation */}
              {step === "publishing" && (
                <motion.div key="publishing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-[3px] border-[#E9F4EC] border-t-[#184F35]"
                  />
                  <div className="text-center">
                    <h3 className="text-[18px] font-black text-[#113A28]">Publishing to Network...</h3>
                    <p className="text-[13px] font-medium text-[#8DA697] mt-1">Generating smart contract & securing your listing</p>
                  </div>
                  <div className="bg-[#F8FBF8] rounded-full px-4 py-1.5 border border-[#E9F4EC] flex items-center gap-2 mt-4">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-mono text-[#6C8576]">Hash: 0x{Array.from({length:10},()=>Math.random().toString(16).charAt(2)).join('')}...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
