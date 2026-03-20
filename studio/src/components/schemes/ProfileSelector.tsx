"use client";

import { motion } from "framer-motion";
import { MapPin, Wheat, Ruler } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDIAN_STATES, CROP_TYPES, LAND_SIZE_OPTIONS, type UserProfile } from "@/lib/schemes-data";

interface ProfileSelectorProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
}

export function ProfileSelector({ profile, onProfileChange }: ProfileSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-[22px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E9F4EC]"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <Wheat size={13} className="text-emerald-700" />
        </div>
        <p className="text-[13px] font-bold text-[#113A28]">Your Farm Profile</p>
        <span className="text-[10px] font-medium text-[#8DA697] ml-auto bg-[#F0F7F2] px-2 py-0.5 rounded-full">Personalizes results</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {/* State */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[10px] font-bold text-[#6C8576] uppercase tracking-wider">
            <MapPin size={10} /> State
          </label>
          <Select
            value={profile.state}
            onValueChange={(v) => onProfileChange({ ...profile, state: v })}
          >
            <SelectTrigger className="h-9 text-[12px] font-semibold rounded-xl border-[#E2EDE5] bg-[#F8FBF9] focus:ring-emerald-500 focus:border-emerald-500">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {INDIAN_STATES.map((s) => (
                <SelectItem key={s} value={s} className="text-[12px] font-medium">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Crop */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[10px] font-bold text-[#6C8576] uppercase tracking-wider">
            <Wheat size={10} /> Crop
          </label>
          <Select
            value={profile.cropType}
            onValueChange={(v) => onProfileChange({ ...profile, cropType: v })}
          >
            <SelectTrigger className="h-9 text-[12px] font-semibold rounded-xl border-[#E2EDE5] bg-[#F8FBF9] focus:ring-emerald-500 focus:border-emerald-500">
              <SelectValue placeholder="Crop" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {CROP_TYPES.map((c) => (
                <SelectItem key={c} value={c} className="text-[12px] font-medium">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Land Size */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[10px] font-bold text-[#6C8576] uppercase tracking-wider">
            <Ruler size={10} /> Land
          </label>
          <Select
            value={String(profile.landSizeAcres)}
            onValueChange={(v) => onProfileChange({ ...profile, landSizeAcres: Number(v) })}
          >
            <SelectTrigger className="h-9 text-[12px] font-semibold rounded-xl border-[#E2EDE5] bg-[#F8FBF9] focus:ring-emerald-500 focus:border-emerald-500">
              <SelectValue placeholder="Land" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {LAND_SIZE_OPTIONS.map((l) => (
                <SelectItem key={l.value} value={String(l.value)} className="text-[12px] font-medium">
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
