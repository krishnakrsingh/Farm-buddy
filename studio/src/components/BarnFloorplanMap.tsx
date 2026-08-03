"use client";

import { motion } from "framer-motion";
import { CowReading } from "@/hooks/useHerdData";
import { Radio } from "lucide-react";

interface BarnFloorplanMapProps {
  cows: CowReading[];
  activeShed: string;
  selectedCowId: string | null;
  onSelectCow: (cowId: string) => void;
}

export function BarnFloorplanMap({
  cows,
  activeShed,
  selectedCowId,
  onSelectCow,
}: BarnFloorplanMapProps) {
  // Filter cows for current active shed (e.g. Shed A)
  const shedCows = cows.filter((c) => c.shed === activeShed);

  // Take a representative sample of cows to display on the schematic barn map (e.g., 18 cows spread across 6 pens)
  const displayCows = shedCows.slice(0, 18);

  // Ensure key cows like COW-014 or COW-042 are included if in shed
  const targetCows = shedCows.filter(
    (c) => c.cowId === "COW-014" || c.cowId === "COW-042" || c.cowId === "COW-108"
  );
  targetCows.forEach((target) => {
    if (!displayCows.find((c) => c.cowId === target.cowId)) {
      displayCows.push(target);
    }
  });

  return (
    <div className="relative h-[250px] w-full rounded-[24px] overflow-hidden border-[2px] border-[#E9F4EC] bg-[#F4F9F4] p-3 shadow-inner">
      {/* Schematic Barn Floorplan Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#184F35_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Barn Layout Labels */}
      <div className="absolute top-2 left-3 flex items-center gap-2 z-10 pointer-events-none">
        <span className="text-[10px] font-black uppercase text-[#184F35] tracking-widest bg-white/90 px-2 py-0.5 rounded-full shadow-xs border border-[#E9F4EC]">
          {activeShed} Floorplan
        </span>
      </div>

      {/* Gateway Signal Badge */}
      <div className="absolute top-2 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#E9F4EC] shadow-xs z-10 pointer-events-none">
        <Radio size={12} className="text-[#3FA65A] animate-pulse" />
        <span className="text-[9px] uppercase font-black tracking-widest text-[#184F35]">
          LoRaWAN Gate #1
        </span>
      </div>

      {/* Pens / Stalls Grid layout */}
      <div className="w-full h-full pt-8 pb-2 px-1 grid grid-cols-3 gap-2 relative z-0">
        {[1, 2, 3, 4, 5, 6].map((penNum) => {
          // Filter cows assigned to this pen
          const penCows = displayCows.filter((_, idx) => idx % 6 === penNum - 1);

          return (
            <div
              key={penNum}
              className="border border-[#184F35]/20 bg-white/60 rounded-[16px] p-2 relative flex flex-wrap content-start gap-1.5 shadow-xs"
            >
              <span className="absolute bottom-1 right-2 text-[8px] font-extrabold text-[#6C8576]/60 uppercase">
                Pen 0{penNum}
              </span>

              {penCows.map((cow) => {
                const isCrit = cow.statusTier === "critical";
                const isWarn = cow.statusTier === "attention";
                const isSelected = cow.cowId === selectedCowId;

                const nodeColor = isCrit
                  ? "bg-[#E8514A] text-white shadow-red-300"
                  : isWarn
                  ? "bg-[#F5A524] text-white shadow-amber-300"
                  : "bg-[#3FA65A] text-white shadow-green-200";

                return (
                  <motion.button
                    key={cow.cowId}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelectCow(cow.cowId)}
                    className={`relative px-2 py-1 rounded-full text-[9px] font-black tracking-tight shadow-md flex items-center gap-1 transition-all border ${nodeColor} ${
                      isSelected ? "ring-2 ring-[#113A28] ring-offset-1 scale-105 z-20" : ""
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCrit ? "bg-white animate-ping" : "bg-white/80"
                      }`}
                    />
                    {cow.cowId.replace("COW-", "Cow ")}
                  </motion.button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
