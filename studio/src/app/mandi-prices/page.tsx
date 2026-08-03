"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, Activity, TrendingUp, ArrowLeft, Box, Store, BarChart3, CheckCircle2 } from "lucide-react";
import { CROPS, CROP_CATEGORIES, CropPrice, TradeTransaction, TradeStatus } from "@/lib/mandi-data";
import { CropPriceCard } from "@/components/mandi/CropPriceCard";
import { TradeModal } from "@/components/mandi/TradeModal";
import { EscrowTracker } from "@/components/mandi/EscrowTracker";
import { BlockchainExplorer } from "@/components/mandi/BlockchainExplorer";
import { SupplyChainTimeline } from "@/components/mandi/SupplyChainTimeline";
import { BuyerPanel } from "@/components/mandi/BuyerPanel";
import { RentalMarketplace } from "@/components/mandi/RentalMarketplace";
import { PostListingModal } from "@/components/mandi/PostListingModal";
import Link from "next/link";

type PageTab = "prices" | "marketplace";

export default function MandiPricesPage() {
    // Tab state
    const [activeTab, setActiveTab] = useState<PageTab>("prices");

    // Modal states
    const [selectedCrop, setSelectedCrop] = useState<CropPrice | null>(null);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [isBuyerPanelOpen, setIsBuyerPanelOpen] = useState(false);
    const [buyerCropName, setBuyerCropName] = useState("");
    
    const [isPostListingOpen, setIsPostListingOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Active trade state
    const [activeTrade, setActiveTrade] = useState<TradeTransaction | null>(null);
    const [isBlockchainOpen, setIsBlockchainOpen] = useState(false);

    // Filter state
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const handleSell = (crop: CropPrice) => {
        setSelectedCrop(crop);
        setIsTradeModalOpen(true);
    };

    const handleViewBuyers = (crop: CropPrice) => {
        setBuyerCropName(crop.name);
        setIsBuyerPanelOpen(true);
    };

    const handleTradeConfirm = (trade: TradeTransaction) => {
        setActiveTrade(trade);
    };

    const handleStatusChange = useCallback((status: TradeStatus) => {
        setActiveTrade(prev => prev ? { ...prev, status } : null);
    }, []);

    const filteredCrops = CROPS.filter(c => {
        const matchesSearch = !searchQuery ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.nameHi.includes(searchQuery) ||
            c.id.includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (selectedCategory === "all") return true;
        if (selectedCategory === "rising") return c.trend === "Rising";
        if (selectedCategory === "above_msp") return c.msp > 0 && c.currentPrice >= c.msp;
        return c.category === selectedCategory;
    });

    const risingCount = CROPS.filter(c => c.trend === "Rising").length;
    const aboveMspCount = CROPS.filter(c => c.msp > 0 && c.currentPrice >= c.msp).length;

    return (
        <div className="min-h-screen bg-[#DBEDD9] text-[#1B4332] pb-32 relative font-sans overflow-x-hidden selection:bg-[#B7D8C6]">

            {/* Header */}
            <div className="bg-gradient-to-b from-[#184F35] to-[#1D6840] pt-12 pb-8 px-5 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/20" />
                    <div className="absolute bottom-0 left-10 w-24 h-24 rounded-full border border-white/10" />
                    <div className="absolute top-20 left-1/2 w-48 h-48 rounded-full border border-white/5" />
                </div>

                <div className="max-w-md mx-auto relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Link href="/" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10">
                            <ArrowLeft size={18} className="text-white" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Mandi Hub</h1>
                            <p className="text-white/60 text-[12px] font-bold mt-0.5">Trade · Rent · Grow</p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-white/10 backdrop-blur-sm rounded-[16px] p-1 border border-white/10 mt-3">
                        <button
                            onClick={() => setActiveTab("prices")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold transition-all ${
                                activeTab === "prices"
                                    ? "bg-white text-[#184F35] shadow-md"
                                    : "text-white/70 hover:text-white"
                            }`}
                        >
                            <BarChart3 size={16} /> Crop Prices
                        </button>
                        <button
                            onClick={() => setActiveTab("marketplace")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold transition-all ${
                                activeTab === "marketplace"
                                    ? "bg-white text-[#184F35] shadow-md"
                                    : "text-white/70 hover:text-white"
                            }`}
                        >
                            <Store size={16} /> Rent & Hire
                        </button>
                    </div>

                    {/* Stats Bar (only for prices tab) */}
                    <AnimatePresence mode="wait">
                        {activeTab === "prices" && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-3 mt-4"
                            >
                                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-[16px] p-3 border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Activity size={14} className="text-emerald-400" />
                                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Live Prices</span>
                                    </div>
                                    <span className="text-[20px] font-black text-white">{CROPS.length}</span>
                                </div>
                                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-[16px] p-3 border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size={14} className="text-emerald-400" />
                                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Rising</span>
                                    </div>
                                    <span className="text-[20px] font-black text-white">{risingCount}</span>
                                </div>
                                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-[16px] p-3 border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ShieldCheck size={14} className="text-emerald-400" />
                                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">≥ MSP</span>
                                    </div>
                                    <span className="text-[20px] font-black text-white">{aboveMspCount}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="max-w-md mx-auto relative px-5 -mt-4 z-10">
                <AnimatePresence mode="wait">
                    {/* ============ PRICES TAB ============ */}
                    {activeTab === "prices" && (
                        <motion.div
                            key="prices"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8DA697]" />
                                <input
                                    type="text"
                                    placeholder="Search crops... (e.g. Wheat, टमाटर, Cumin)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3.5 rounded-[16px] bg-white border border-[#E9F4EC] shadow-[0_8px_24px_rgba(0,0,0,0.04)] text-[14px] font-semibold text-[#113A28] placeholder-[#8DA697] outline-none focus:border-[#184F35] focus:shadow-[0_8px_24px_rgba(24,79,53,0.08)] transition-all"
                                />
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
                                {CROP_CATEGORIES.map((f) => (
                                    <button
                                        key={f.key}
                                        onClick={() => setSelectedCategory(f.key)}
                                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                            selectedCategory === f.key
                                                ? "bg-[#184F35] text-white shadow-md"
                                                : "bg-white text-[#6C8576] border border-[#E9F4EC] hover:bg-[#F4F9F4]"
                                        }`}
                                    >
                                        <span>{f.emoji}</span> {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Active Trade Tracking */}
                            <AnimatePresence>
                                {activeTrade && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 mb-6"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-gradient-to-r from-[#184F35] to-[#2D7A53] rounded-[20px] p-4 text-white flex items-center gap-3 shadow-lg"
                                        >
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0"
                                            >
                                                <Box size={20} />
                                            </motion.div>
                                            <div className="flex-1">
                                                <p className="text-[14px] font-extrabold">Active Trade</p>
                                                <p className="text-[11px] font-medium text-white/70">{activeTrade.crop.emoji} {activeTrade.quantity} {activeTrade.crop.unit}s → {activeTrade.buyer.name}</p>
                                            </div>
                                            <span className="text-[16px] font-black">₹{activeTrade.totalAmount.toLocaleString("en-IN")}</span>
                                        </motion.div>

                                        <EscrowTracker
                                            trade={activeTrade}
                                            onStatusChange={handleStatusChange}
                                            onViewBlockchain={() => setIsBlockchainOpen(true)}
                                        />

                                        <SupplyChainTimeline trade={activeTrade} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Crop Price Cards */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <h2 className="text-[15px] font-extrabold text-[#113A28]">
                                        {searchQuery ? `Results for "${searchQuery}"` : selectedCategory === "all" ? "All Crops" : CROP_CATEGORIES.find(c => c.key === selectedCategory)?.label || "Crops"}
                                        <span className="ml-2 text-[12px] font-bold text-[#8DA697]">({filteredCrops.length})</span>
                                    </h2>
                                    <span className="text-[9px] font-bold text-[#8DA697] uppercase tracking-wider">Rate / Unit</span>
                                </div>

                                {filteredCrops.map((crop, i) => (
                                    <CropPriceCard
                                        key={crop.id}
                                        crop={crop}
                                        onSell={handleSell}
                                        onViewBuyers={handleViewBuyers}
                                        index={i}
                                    />
                                ))}

                                {filteredCrops.length === 0 && (
                                    <div className="text-center py-12 bg-white rounded-[24px] border border-[#E9F4EC]">
                                        <p className="text-[32px] mb-2">🔍</p>
                                        <p className="text-[14px] font-bold text-[#113A28]">No crops found</p>
                                        <p className="text-[12px] text-[#8DA697] mt-1">Try searching by name in English or Hindi</p>
                                    </div>
                                )}
                            </div>

                            {/* Blockchain Trust Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 bg-white/80 backdrop-blur-sm rounded-[20px] p-4 border border-[#E9F4EC] flex items-start gap-3"
                            >
                                <ShieldCheck size={20} className="text-[#184F35] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[12px] font-bold text-[#113A28]">Blockchain-Secured Trading</p>
                                    <p className="text-[10px] font-medium text-[#8DA697] leading-relaxed mt-0.5">
                                        All trades on Khetsetu are secured via smart contract escrow. Payments are locked until delivery is verified, protecting both farmers and buyers.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* ============ MARKETPLACE TAB ============ */}
                    {activeTab === "marketplace" && (
                        <motion.div
                            key="marketplace"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Marketplace Header */}
                            <div className="bg-white rounded-[20px] p-4 border border-[#E9F4EC] shadow-[0_8px_24px_rgba(0,0,0,0.04)] mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-[24px] border border-amber-200/50">
                                        🤝
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-extrabold text-[#113A28]">Farm Marketplace</h3>
                                        <p className="text-[11px] font-medium text-[#8DA697] mt-0.5">Rent equipment, hire workers, lease land & storage</p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-4 gap-2 mt-3">
                                    {[
                                        { label: "Tractors", count: "7+", emoji: "🚜" },
                                        { label: "Workers", count: "15+", emoji: "👷" },
                                        { label: "Land", count: "3+", emoji: "🏞️" },
                                        { label: "Storage", count: "4+", emoji: "❄️" },
                                    ].map(s => (
                                        <div key={s.label} className="text-center bg-[#F8FBF8] rounded-[12px] py-2 border border-[#E9F4EC]">
                                            <p className="text-[16px]">{s.emoji}</p>
                                            <p className="text-[12px] font-black text-[#184F35]">{s.count}</p>
                                            <p className="text-[8px] font-bold text-[#8DA697] uppercase tracking-wider">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <RentalMarketplace />

                            {/* Post Listing CTA */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 bg-gradient-to-r from-[#184F35] to-[#2D7A53] rounded-[20px] p-5 text-white shadow-lg"
                            >
                                <h4 className="text-[16px] font-black">Have something to rent out?</h4>
                                <p className="text-[12px] font-medium text-white/70 mt-1 leading-relaxed">
                                    List your tractor, equipment, land, or services. Reach farmers in your area.
                                </p>
                                <button 
                                    onClick={() => setIsPostListingOpen(true)}
                                    className="mt-3 bg-white text-[#184F35] font-bold text-[13px] px-5 py-3 rounded-[14px] shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                >
                                    + Post a Listing
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            {selectedCrop && (
                <TradeModal
                    crop={selectedCrop}
                    isOpen={isTradeModalOpen}
                    onClose={() => setIsTradeModalOpen(false)}
                    onTradeConfirm={handleTradeConfirm}
                />
            )}

            <BuyerPanel
                isOpen={isBuyerPanelOpen}
                onClose={() => setIsBuyerPanelOpen(false)}
                cropName={buyerCropName}
            />

            <PostListingModal
                isOpen={isPostListingOpen}
                onClose={() => setIsPostListingOpen(false)}
                onSuccess={() => {
                    setShowSuccessToast(true);
                    setTimeout(() => setShowSuccessToast(false), 3000);
                }}
            />

            {activeTrade && (
                <BlockchainExplorer
                    trade={activeTrade}
                    isOpen={isBlockchainOpen}
                    onClose={() => setIsBlockchainOpen(false)}
                />
            )}

            {/* Success Toast for Posting Listing */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-5 right-5 z-[500] bg-[#184F35] text-white rounded-[16px] p-4 flex items-center gap-3 shadow-2xl border border-white/20"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[14px] font-extrabold text-white">Listing Published!</p>
                            <p className="text-[11px] font-medium text-emerald-200 mt-0.5">Secured on blockchain & live on marketplace</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scrollbar hide */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
