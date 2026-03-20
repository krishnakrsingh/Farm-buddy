"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Loader2, Bot, User as UserIcon } from "lucide-react";
import type { Scheme, UserProfile } from "@/lib/schemes-data";

interface AiExplainerModalProps {
  scheme: Scheme | null;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "How much will I get?",
  "Am I fully eligible?",
  "What documents do I need?",
  "When is the deadline?",
];

export function AiExplainerModal({ scheme, profile, isOpen, onClose }: AiExplainerModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset messages when scheme changes
  useEffect(() => {
    if (scheme) {
      setMessages([]);
      setInput("");
    }
  }, [scheme?.id]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const askQuestion = async (question: string) => {
    if (!scheme || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/schemes-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId: scheme.id,
          question,
          userProfile: profile,
          schemeContext: {
            name: scheme.name,
            shortName: scheme.shortName,
            description: scheme.description,
            benefitLabel: scheme.benefitLabel,
            benefitAmount: scheme.benefitAmount,
            eligibility: scheme.eligibility,
            whyItMatters: scheme.whyItMatters,
            requiredDocuments: scheme.requiredDocuments,
            deadline: scheme.deadline,
            status: scheme.status,
          },
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      // Fallback: generate a contextual response locally
      const fallback = generateFallbackAnswer(scheme, profile, question);
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      askQuestion(input.trim());
    }
  };

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

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] rounded-t-[28px] bg-white shadow-2xl flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-1 pb-3 border-b border-[#EDF3EF] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#113A28]">AI Assistant</h2>
                  <p className="text-[11px] font-medium text-[#8DA697]">{scheme.shortName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#F0F3F1] flex items-center justify-center hover:bg-[#E4E9E5] transition-colors"
              >
                <X size={16} className="text-[#6C8576]" />
              </button>
            </div>

            {/* Chat area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mx-auto mb-3">
                    <Bot size={24} className="text-purple-600" />
                  </div>
                  <p className="text-[14px] font-bold text-[#113A28] mb-1">Ask me anything about</p>
                  <p className="text-[13px] font-semibold text-purple-600 mb-4">{scheme.shortName}</p>
                  <p className="text-[12px] text-[#8DA697] mb-4">I&apos;ll give you simple, clear answers about eligibility, benefits, and how to apply.</p>

                  {/* Quick questions */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => askQuestion(q)}
                        className="text-[12px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] font-medium leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#184F35] text-white rounded-br-md"
                        : "bg-[#F4F7F5] text-[#1B3A2A] rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-[#184F35] flex items-center justify-center shrink-0 mt-0.5">
                      <UserIcon size={14} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-[#F4F7F5] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="text-purple-500 animate-spin" />
                    <span className="text-[12px] text-[#8DA697] font-medium">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 pb-5 pt-3 border-t border-[#EDF3EF] shrink-0"
            >
              <div className="flex items-center gap-2 bg-[#F4F7F5] rounded-2xl px-3 py-1.5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this scheme..."
                  className="flex-1 bg-transparent outline-none text-[13px] font-medium text-[#113A28] placeholder:text-[#A0B0A8] py-2"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-[#184F35] flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-[#123926] transition-colors"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Fallback answer generator (when API is unavailable) ──────

function generateFallbackAnswer(scheme: Scheme, profile: UserProfile, question: string): string {
  const q = question.toLowerCase();

  if (q.includes("how much") || q.includes("benefit") || q.includes("get")) {
    return `Under ${scheme.shortName}, you can receive ${scheme.benefitLabel}. For your ${profile.landSizeAcres} acre farm in ${profile.state}, the estimated annual benefit is ₹${scheme.benefitAmount.toLocaleString("en-IN")}. This is directly provided by the government with no middlemen involved.`;
  }

  if (q.includes("eligible") || q.includes("qualify")) {
    const eligible = scheme.eligibility.states.length === 0 || scheme.eligibility.states.includes(profile.state);
    if (eligible) {
      return `Yes! Based on your profile — ${profile.state}, ${profile.cropType} farming, ${profile.landSizeAcres} acres — you appear to be eligible for ${scheme.shortName}. The scheme is for: ${scheme.eligibility.description}. I recommend applying at your earliest convenience.`;
    }
    return `Based on your current state (${profile.state}), you may not be eligible for ${scheme.shortName}. This scheme is currently available in: ${scheme.eligibility.states.join(", ")}. Please check if your state has a similar scheme.`;
  }

  if (q.includes("document") || q.includes("paper") || q.includes("need")) {
    return `To apply for ${scheme.shortName}, you'll need these documents:\n\n${scheme.requiredDocuments.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nMake sure all documents are valid and up-to-date before applying.`;
  }

  if (q.includes("deadline") || q.includes("when") || q.includes("date") || q.includes("last")) {
    if (scheme.deadline) {
      return `The deadline for ${scheme.shortName} is ${new Date(scheme.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. I suggest applying well before this date to avoid any last-minute issues.`;
    }
    return `${scheme.shortName} is an ongoing scheme with no fixed deadline. You can apply anytime. However, it's best to apply soon to start receiving benefits at the earliest.`;
  }

  // Generic response
  return `${scheme.shortName} provides ${scheme.benefitLabel} to eligible farmers. ${scheme.whyItMatters} The scheme is currently ${scheme.status.toLowerCase()}. To apply, visit your nearest Common Service Centre or the official portal with your Aadhaar and land documents.`;
}
