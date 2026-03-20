"use client";

import { MapPin, Bell, User, ChevronRight, Activity, Droplet, Leaf } from "lucide-react";
import { ScannerCTA } from "@/components/ScannerCTA";
import { AlertCard } from "@/components/AlertCard";
import { motion, useScroll, useTransform } from "framer-motion";
import { AdvancedWeatherWidget } from "@/components/AdvancedWeatherWidget";

export default function HomePage() {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 relative overflow-hidden font-body selection:bg-emerald-500/30">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-normal"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-yellow-500/10 blur-[120px] mix-blend-normal"
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[10px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Sticky Glass Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 pt-4 pb-3 px-5 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-emerald-500" />
          <span className="font-bold text-sm tracking-wide">Pipli Village</span>
        </div>
        <div className="relative bg-white/5 p-2 rounded-full border border-white/10">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full"></span>
        </div>
      </motion.header>

      <main className="relative z-10 px-5 pt-4 max-w-xl mx-auto space-y-8">
        {/* Superior Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pb-2"
        >
          <p className="text-muted-foreground text-sm font-bold tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-500" />
            Pipli Village
          </p>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-foreground tracking-tight leading-none mb-2">
                Good Morning.
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Updated today at 07:15 AM</p>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-12 h-12 rounded-full overflow-hidden border border-border bg-background shadow-sm flex items-center justify-center relative cursor-pointer group"
            >
              <User className="text-muted-foreground w-6 h-6 group-hover:text-foreground transition-colors" />
            </motion.div>
          </div>
        </motion.div>

        {/* Dynamic Weather & Crop Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AdvancedWeatherWidget />
        </motion.div>

        {/* Market Intelligence Hologram Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative group overflow-hidden bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px] group-hover:bg-yellow-500/20 transition-colors duration-700" />

          <div className="flex justify-between items-center relative z-10 mb-2">
            <h3 className="text-xs font-bold py-1 px-3 rounded-full bg-background/50 border border-border/50 uppercase tracking-widest text-muted-foreground inline-flex items-center gap-2">
              <Activity size={12} className="text-emerald-500" />
              Market Intelligence
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
              Details <ChevronRight size={14} />
            </span>
          </div>

          <div className="flex items-end justify-between mt-4 relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Local Wheat (A-Grade)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter">₹2,275</span>
                <span className="text-sm font-bold text-muted-foreground">/q</span>
              </div>
            </div>

            {/* Miniature Sparkline (CSS only representation) */}
            <div className="flex items-end gap-1 h-10">
              {[40, 50, 45, 60, 55, 70, 85].map((h, i) => (
                <div key={i} className="w-2 bg-emerald-500/20 rounded-t-sm" style={{ height: `${h}%` }}>
                  {i === 6 && <div className="w-full h-full bg-emerald-500 rounded-t-sm animate-pulse" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Focus & Insights Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-tight">Today's Focus</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Action Card 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-[1.5rem] p-4 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <Droplet size={24} className="text-indigo-500 mb-3" />
              <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">Irrigation</h4>
              <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70 font-medium mt-1">Check Field B</p>
            </div>

            {/* Action Card 2 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-100 dark:border-orange-900/50 rounded-[1.5rem] p-4 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <Leaf size={24} className="text-orange-500 mb-3" />
              <h4 className="font-bold text-sm text-orange-950 dark:text-orange-200">Crop Health</h4>
              <p className="text-xs text-orange-700/70 dark:text-orange-400/70 font-medium mt-1">Rust risk is moderate</p>
            </div>
          </div>
        </motion.div>

        {/* Magically Floating Scanner Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2"
        >
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <ScannerCTA />
          </div>
        </motion.div>

        {/* Cinematic Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 relative"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold tracking-tight">Intelligence</h2>
            <span className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors">View Timeline</span>
          </div>

          <AlertCard
            type="warning"
            title="Yellow Rust Risk Detected"
            description="Optimal conditions for fungus spreading. Prepare fungicide application for next 48 hrs."
            date="2 hrs ago"
          />

          <AlertCard
            type="info"
            title="Satellite Imagery Updated"
            description="Latest NDVI data is available for all fields. Biomass looks excellent in North block."
            date="5 hrs ago"
          />
        </motion.div>

      </main>
    </div>
  );
}
