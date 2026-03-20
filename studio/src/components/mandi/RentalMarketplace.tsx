"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, ShieldCheck, Clock, CheckCircle2, Phone, MessageSquare, ChevronRight, AlertCircle } from "lucide-react";
import { RentalListing, RENTAL_LISTINGS, RENTAL_CATEGORIES, RentalCategory } from "@/lib/mandi-data";
import { cn } from "@/lib/utils";

// Detail Modal
function ListingDetail({ listing, isOpen, onClose }: { listing: RentalListing; isOpen: boolean; onClose: () => void }) {
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const handleBook = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBooked(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Emoji */}
        <div className="relative bg-gradient-to-br from-[#184F35] to-[#2D7A53] rounded-t-[32px] sm:rounded-t-[32px] p-6 pb-8">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={18} className="text-white" />
          </button>
          <div className="text-[48px] mb-3">{listing.emoji}</div>
          <h2 className="text-[20px] font-black text-white leading-tight">{listing.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">{listing.subCategory}</span>
            {listing.verified && (
              <span className="bg-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-200 flex items-center gap-1 border border-emerald-400/20">
                <ShieldCheck size={10} /> Verified
              </span>
            )}
            {!listing.available && (
              <span className="bg-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-red-200 border border-red-400/20">Unavailable</span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-5 -mt-3">
          {/* Price Card */}
          <div className="bg-[#F8FBF8] rounded-[20px] p-4 border border-[#E9F4EC] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#8DA697] uppercase tracking-wider">Rental Price</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[28px] font-black text-[#184F35]">₹{listing.price.toLocaleString("en-IN")}</span>
                <span className="text-[13px] font-bold text-[#6C8576]">{listing.priceUnit}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[#184F35]">
                <MapPin size={12} />
                <span className="text-[12px] font-bold">{listing.location}</span>
              </div>
              <span className="text-[10px] font-medium text-[#8DA697]">{listing.distance} km away</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-2">Description</h4>
            <p className="text-[14px] font-medium text-[#113A28] leading-relaxed">{listing.description}</p>
          </div>

          {/* Specs */}
          {listing.specs && (
            <div>
              <h4 className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-2">Specifications</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(listing.specs).map(([key, value]) => (
                  <div key={key} className="bg-[#F4F9F4] rounded-[12px] p-2.5 border border-[#E9F4EC]">
                    <p className="text-[9px] font-bold text-[#8DA697] uppercase tracking-wider">{key}</p>
                    <p className="text-[13px] font-extrabold text-[#113A28] mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner */}
          <div className="bg-[#F8FBF8] rounded-[20px] p-4 border border-[#E9F4EC]">
            <h4 className="text-[12px] font-bold text-[#6C8576] uppercase tracking-wider mb-3">Owner</h4>
            <div className="flex items-center gap-3">
              <img src={listing.ownerAvatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt={listing.ownerName} />
              <div className="flex-1">
                <p className="text-[14px] font-extrabold text-[#113A28]">{listing.ownerName}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600">
                    <Star size={11} className="fill-amber-500 text-amber-500" /> {listing.ownerRating}
                  </span>
                  <span className="text-[11px] font-medium text-[#8DA697]">{listing.ownerTotalRentals} rentals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {listing.available ? (
            <div className="space-y-2">
              {booked ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-[16px] p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                  <div>
                    <p className="text-[14px] font-extrabold text-emerald-800">Booking Confirmed!</p>
                    <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                      {listing.ownerName} will contact you shortly.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full py-4 rounded-[16px] bg-[#184F35] text-white font-bold text-[15px] hover:bg-[#123926] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                >
                  {isBooking ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Processing...</>
                  ) : (
                    <>📞 Book Now</>
                  )}
                </button>
              )}
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-[14px] bg-[#F4F9F4] border border-[#E9F4EC] text-[#184F35] font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#E8EEEA] transition-colors">
                  <Phone size={14} /> Call
                </button>
                <button className="flex-1 py-3 rounded-[14px] bg-[#F4F9F4] border border-[#E9F4EC] text-[#184F35] font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#E8EEEA] transition-colors">
                  <MessageSquare size={14} /> Chat
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-4 flex items-center gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-[13px] font-bold text-amber-800">Currently Unavailable</p>
                <p className="text-[11px] font-medium text-amber-700">Contact the owner for next availability.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Marketplace Component
export function RentalMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<RentalCategory | "all">("all");
  const [selectedListing, setSelectedListing] = useState<RentalListing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = RENTAL_LISTINGS.filter(l => {
    const matchesCategory = selectedCategory === "all" || l.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {RENTAL_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[12px] font-bold transition-all whitespace-nowrap shrink-0",
              selectedCategory === cat.key
                ? "bg-[#184F35] text-white shadow-md"
                : "bg-white text-[#6C8576] border border-[#E9F4EC] hover:bg-[#F4F9F4]"
            )}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search tractors, workers, land..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-3 rounded-[14px] bg-white border border-[#E9F4EC] text-[13px] font-semibold text-[#113A28] placeholder-[#8DA697] outline-none focus:border-[#184F35] transition-all shadow-sm"
        />
      </div>

      {/* Listings Grid */}
      <div className="space-y-3">
        {filtered.map((listing, i) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedListing(listing)}
            className={cn(
              "bg-white rounded-[20px] p-4 border border-[#E9F4EC] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer active:scale-[0.99]",
              !listing.available && "opacity-60"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Emoji Avatar */}
              <div className="w-14 h-14 rounded-[16px] bg-[#F4F9F4] border border-[#E9F4EC] flex items-center justify-center text-[28px] shrink-0">
                {listing.emoji}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-extrabold text-[#113A28] leading-tight truncate">{listing.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-[#F4F9F4] text-[#6C8576] px-2 py-0.5 rounded-full text-[9px] font-bold border border-[#E9F4EC]">{listing.subCategory}</span>
                      {listing.verified && (
                        <span className="flex items-center gap-0.5 text-emerald-600">
                          <ShieldCheck size={10} />
                          <span className="text-[9px] font-bold">Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[16px] font-black text-[#184F35]">₹{listing.price.toLocaleString("en-IN")}</div>
                    <div className="text-[9px] font-bold text-[#8DA697]">{listing.priceUnit}</div>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#6C8576]">
                      <img src={listing.ownerAvatar} className="w-4 h-4 rounded-full object-cover" alt="" />
                      {listing.ownerName}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                      <Star size={10} className="fill-amber-500 text-amber-500" /> {listing.ownerRating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8DA697]">
                    <MapPin size={10} /> {listing.distance} km
                    <ChevronRight size={12} className="text-[#B7D8C6]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 bg-white rounded-[24px] border border-[#E9F4EC]">
            <p className="text-[28px] mb-2">🔍</p>
            <p className="text-[14px] font-bold text-[#113A28]">No listings found</p>
            <p className="text-[12px] text-[#8DA697] mt-1">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedListing && (
          <ListingDetail
            listing={selectedListing}
            isOpen={!!selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
