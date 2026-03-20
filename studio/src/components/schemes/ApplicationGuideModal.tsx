"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle2, FileText, Globe, CreditCard, Building,
  Phone, Upload, Banknote, Search, Wallet, AlertTriangle,
  Map, Zap, Users, GraduationCap, Gift, FlaskConical, Sprout,
  UserPlus, PackageCheck, Store, Droplets, IdCard, HardHat
} from "lucide-react";
import type { Scheme, ApplicationStep } from "@/lib/schemes-data";

interface ApplicationGuideModalProps {
  scheme: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Globe, CreditCard, FileCheck: CheckCircle2, Banknote, Building, FileText,
  Wallet, AlertTriangle, Search, Map, Zap, Phone, FlaskConical, Sprout,
  UserPlus, PackageCheck, Store, Droplets, Users, GraduationCap, Gift,
  IdCard, HardHat, Upload, Tractor: Zap,
};

function StepIcon({ iconName }: { iconName: string }) {
  const IconComponent = iconMap[iconName] || FileText;
  return <IconComponent size={18} />;
}

export function ApplicationGuideModal({ scheme, isOpen, onClose }: ApplicationGuideModalProps) {
  if (!scheme) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-2 pb-4">
              <div className="flex-1">
                <h2 className="text-[18px] font-extrabold text-[#113A28] leading-snug">
                  How to Apply
                </h2>
                <p className="text-[13px] font-semibold text-[#6C8576] mt-0.5">
                  {scheme.shortName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#F0F3F1] flex items-center justify-center hover:bg-[#E4E9E5] transition-colors"
              >
                <X size={16} className="text-[#6C8576]" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(88vh-100px)] px-5 pb-8">
              {/* Steps */}
              <div className="space-y-0 mb-6">
                {scheme.applicationSteps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex gap-3"
                  >
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-200/50">
                        <StepIcon iconName={step.icon} />
                      </div>
                      {i < scheme.applicationSteps.length - 1 && (
                        <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-emerald-300 to-emerald-100 my-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          STEP {step.step}
                        </span>
                      </div>
                      <h4 className="text-[14px] font-bold text-[#113A28] mb-0.5">{step.title}</h4>
                      <p className="text-[12px] font-medium text-[#6C8576] leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Required Documents */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#F8FBF9] rounded-2xl p-4 border border-[#E6EEE8]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={15} className="text-[#184F35]" />
                  <h4 className="text-[13px] font-extrabold text-[#113A28]">Documents Required</h4>
                </div>
                <div className="space-y-2">
                  {scheme.requiredDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span className="text-[12px] font-semibold text-[#2A4A3A]">{doc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {scheme.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold text-[#6C8576] bg-[#F0F7F2] border border-[#E2EDE5] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
