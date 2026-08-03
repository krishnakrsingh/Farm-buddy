"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, RefreshCw, Clock, Sparkles, Shield, Search } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_SCHEMES, DEFAULT_PROFILE, type UserProfile, type Scheme } from "@/lib/schemes-data";
import { getEligibleSchemes } from "@/lib/schemes-engine";

import { MoneyMissingHero } from "@/components/schemes/MoneyMissingHero";
import { ProfileSelector } from "@/components/schemes/ProfileSelector";
import { SchemeCard } from "@/components/schemes/SchemeCard";
import { ApplicationGuideModal } from "@/components/schemes/ApplicationGuideModal";
import { AiExplainerModal } from "@/components/schemes/AiExplainerModal";

export default function SchemesPage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [guideScheme, setGuideScheme] = useState<Scheme | null>(null);
  const [aiScheme, setAiScheme] = useState<Scheme | null>(null);

  // Compute eligible schemes
  const eligibleResults = useMemo(() => {
    return getEligibleSchemes(profile, ALL_SCHEMES, 5);
  }, [profile]);

  // Simulate refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  // Simulate periodic updates
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 120_000); // every 2 minutes
    return () => clearInterval(timer);
  }, []);

  const formattedLastUpdated = lastUpdated.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">
      {/* ─── Header ─── */}
      <div className="relative z-20">
        <div className="bg-gradient-to-br from-[#184F35] via-[#1B5E3E] to-[#0F3D28] text-white px-5 pt-10 pb-7 rounded-b-[32px] shadow-xl shadow-[#184F35]/15 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-emerald-400/8 blur-2xl" />

          <div className="max-w-lg mx-auto relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/"
                className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </Link>

              <button
                onClick={handleRefresh}
                className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <RefreshCw
                  size={18}
                  className={`text-white ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield size={20} className="text-emerald-300" />
                <h1 className="text-[22px] font-extrabold">Government Schemes</h1>
              </div>
              <p className="text-emerald-200/70 text-[13px] font-medium leading-relaxed">
                Personalized benefits matched to your farm. Claim what&apos;s yours.
              </p>
            </motion.div>

            {/* Last updated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 mt-3"
            >
              <Clock size={11} className="text-emerald-300/50" />
              <span className="text-[10px] font-semibold text-emerald-200/40">
                Updated {formattedLastUpdated}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-lg mx-auto relative px-4 mt-5 space-y-4 z-10">
        {/* Profile Selector */}
        <ProfileSelector profile={profile} onProfileChange={setProfile} />

        {/* Money Missing Hero */}
        {eligibleResults.length > 0 && (
          <MoneyMissingHero results={eligibleResults} />
        )}

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-between pt-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600" />
            <h2 className="text-[16px] font-extrabold text-[#113A28]">
              You&apos;re Eligible For
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#6C8576] bg-white px-2.5 py-1 rounded-full border border-[#E2EDE5]">
            {eligibleResults.length} scheme{eligibleResults.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* Scheme Cards */}
        <AnimatePresence mode="wait">
          {eligibleResults.length > 0 ? (
            <motion.div
              key={`${profile.state}-${profile.cropType}-${profile.landSizeAcres}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {eligibleResults.map((result, i) => (
                <SchemeCard
                  key={result.scheme.id}
                  result={result}
                  index={i}
                  onViewSteps={() => setGuideScheme(result.scheme)}
                  onAskAI={() => setAiScheme(result.scheme)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white rounded-[22px] border border-[#E6EEE8]"
            >
              <Search size={32} className="text-[#C0D0C6] mx-auto mb-3" />
              <p className="text-[14px] font-bold text-[#6C8576]">No matching schemes found</p>
              <p className="text-[12px] text-[#8DA697] mt-1">Try adjusting your state, crop, or land size above</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4 pb-6"
        >
          <p className="text-[11px] text-[#8DA697] font-medium">
            Data sourced from government portals • Last synced {formattedLastUpdated}
          </p>
          <p className="text-[10px] text-[#A0B8AA] mt-1">
            Benefit amounts are estimates. Actual amounts may vary.
          </p>
        </motion.div>
      </div>

      {/* ─── Modals ─── */}
      <ApplicationGuideModal
        scheme={guideScheme}
        isOpen={!!guideScheme}
        onClose={() => setGuideScheme(null)}
      />
      <AiExplainerModal
        scheme={aiScheme}
        profile={profile}
        isOpen={!!aiScheme}
        onClose={() => setAiScheme(null)}
      />
    </div>
  );
}
