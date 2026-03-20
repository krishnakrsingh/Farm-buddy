"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Loader2, RefreshCw, Settings, Bot, User, Smartphone, Monitor, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

type Mode = "pc" | "phone";

export default function ChatPage() {
    const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
    const [input, setInput] = useState("");
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingModels, setIsFetchingModels] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("pc");
    const [phoneOllamaUrl, setPhoneOllamaUrl] = useState("http://127.0.0.1:11434");
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        if (isMobile) setMode("phone");
    }, []);

    const fetchModels = async () => {
        setIsFetchingModels(true);
        setConnectionError(null);

        if (mode === "pc") {
            try {
                const res = await fetch("/api/ollama");
                const data = await res.json();
                if (!res.ok) { setConnectionError(data.error || "Cannot connect to Ollama via server"); setModels([]); return; }
                const modelNames: string[] = data.models?.map((m: any) => m.name) || [];
                setModels(modelNames);
                if (modelNames.includes("gemma3:270m")) setSelectedModel("gemma3:270m");
                else if (modelNames.length > 0) setSelectedModel(modelNames[0]);
                else setSelectedModel("");
            } catch (err) { setConnectionError("Cannot reach the app server."); setModels([]); }
            finally { setIsFetchingModels(false); }
        } else {
            try {
                const res = await fetch(`${phoneOllamaUrl}/api/tags`);
                if (!res.ok) {
                    if (res.status === 403) setConnectionError("CORS blocked (403). Restart Ollama with: OLLAMA_ORIGINS=\"*\" ollama serve");
                    else setConnectionError(`Ollama error: ${res.status}`);
                    setModels([]); return;
                }
                const data = await res.json();
                const modelNames: string[] = data.models?.map((m: any) => m.name) || [];
                if (modelNames.length > 0) {
                    setModels(modelNames);
                    if (modelNames.includes("gemma3:270m")) setSelectedModel("gemma3:270m");
                    else setSelectedModel(modelNames[0]);
                } else { setModels([]); setConnectionError("Ollama running but no models. Run: ollama pull gemma3:270m"); }
            } catch (err) { setConnectionError("Cannot connect to Ollama. Make sure it's running with:\nOLLAMA_ORIGINS=\"*\" ollama serve"); setModels([]); }
            finally { setIsFetchingModels(false); }
        }
    };

    useEffect(() => { fetchModels(); }, [mode]);
    useEffect(() => { if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
    useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px"; } }, [input]);

    const handleSend = async () => {
        if (!input.trim() || models.length === 0 || isLoading) return;
        const userMsg = input.trim();
        const newMessages = [...messages, { role: "user", content: userMsg }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            let assistantContent = "";
            if (mode === "pc") {
                const res = await fetch("/api/ollama", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: selectedModel, messages: newMessages.map(m => ({ role: m.role, content: m.content })), stream: false }) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Server error");
                assistantContent = data.message?.content || "No response.";
            } else {
                const res = await fetch(`${phoneOllamaUrl}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: selectedModel, messages: newMessages.map(m => ({ role: m.role, content: m.content })), stream: false }) });
                if (res.status === 403) throw new Error("CORS blocked! Restart Ollama: OLLAMA_ORIGINS=\"*\" ollama serve");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Ollama error");
                assistantContent = data.message?.content || "No response.";
            }
            setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
        } catch (err: any) {
            console.error(err);
            setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${err.message || "Could not get a response."}` }]);
        } finally { setIsLoading(false); }
    };

    const clearChat = () => setMessages([]);

    return (
        <div className="flex flex-col h-[100dvh] bg-[#F4F9F4] text-[#1B4332] font-sans">
            <header className="flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md border-b border-[#E9F4EC] z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-10 h-10 rounded-full bg-[#F4F9F4] flex items-center justify-center hover:bg-[#E8EEEA] transition-colors active:scale-95">
                        <ArrowLeft className="w-5 h-5 text-[#113A28]" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#DBEDD9] flex items-center justify-center border border-[#B7D8C6] overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=drfarm3&backgroundColor=transparent" alt="AI" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[17px] font-extrabold text-[#113A28] leading-none">{t("dr_farm_ai")}</h1>
                            <div className="text-[11px] font-bold text-[#6C8576] flex items-center gap-1 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${models.length > 0 ? "bg-[#4CAF50] animate-pulse" : "bg-red-500"}`}></span>
                                {isFetchingModels ? t("connecting") : models.length > 0
                                    ? <>{mode === "phone" ? "📱" : "🖥️"} {selectedModel}</>
                                    : t("disconnected")
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                        <button onClick={clearChat} className="w-10 h-10 rounded-full bg-white border border-[#E9F4EC] shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors active:scale-95">
                            <Trash2 className="w-4 h-4 text-[#6C8576]" />
                        </button>
                    )}
                    <button onClick={fetchModels} disabled={isFetchingModels} className="w-10 h-10 rounded-full bg-white border border-[#E9F4EC] shadow-sm flex items-center justify-center hover:bg-[#F4F9F4] transition-colors active:scale-95">
                        <RefreshCw className={`w-4 h-4 text-[#6C8576] ${isFetchingModels ? "animate-spin" : ""}`} />
                    </button>
                    <button onClick={() => setShowSettings(!showSettings)} className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center transition-colors active:scale-95 ${showSettings ? "bg-[#184F35] border-[#184F35]" : "bg-white border-[#E9F4EC] hover:bg-[#F4F9F4]"}`}>
                        <Settings className={`w-5 h-5 ${showSettings ? "text-white" : "text-[#6C8576]"}`} />
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white border-b border-[#E9F4EC] px-5 py-4 shadow-inner overflow-hidden">
                        <div className="space-y-4 max-w-md mx-auto">
                            <div>
                                <label className="block text-[12px] font-bold text-[#6C8576] mb-2">{t("ollama_location")}</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setMode("pc")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[13px] font-bold border transition-all active:scale-[0.98] ${mode === "pc" ? "bg-[#184F35] text-white border-[#184F35] shadow-md" : "bg-[#F4F9F4] text-[#6C8576] border-[#E9F4EC]"}`}>
                                        <Monitor className="w-4 h-4" /> {t("pc_server")}
                                    </button>
                                    <button onClick={() => setMode("phone")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[13px] font-bold border transition-all active:scale-[0.98] ${mode === "phone" ? "bg-[#184F35] text-white border-[#184F35] shadow-md" : "bg-[#F4F9F4] text-[#6C8576] border-[#E9F4EC]"}`}>
                                        <Smartphone className="w-4 h-4" /> {t("on_phone")}
                                    </button>
                                </div>
                            </div>

                            {mode === "phone" && (
                                <div>
                                    <label className="block text-[12px] font-bold text-[#6C8576] mb-1.5">Ollama URL</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={phoneOllamaUrl} onChange={(e) => setPhoneOllamaUrl(e.target.value)} className="flex-1 rounded-[12px] bg-[#F4F9F4] border border-[#E9F4EC] px-3 py-2 text-[14px] font-semibold text-[#113A28] focus:outline-none focus:border-[#4CAF50]" />
                                        <button onClick={fetchModels} className="rounded-[12px] bg-[#184F35] text-white px-4 py-2 font-bold hover:bg-[#123926] transition-colors disabled:opacity-50" disabled={isFetchingModels}>
                                            {isFetchingModels ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="bg-[#FFF8DF] rounded-[10px] p-3 mt-3 border border-[#FBE6A2]">
                                        <p className="text-[11px] font-bold text-[#B07D00] leading-relaxed">⚠️ In Termux you MUST run:</p>
                                        <code className="block bg-white/60 px-2 py-1.5 rounded-[6px] font-mono text-[10px] text-[#B07D00] mt-1.5">OLLAMA_ORIGINS=&quot;*&quot; ollama serve</code>
                                    </div>
                                </div>
                            )}

                            {models.length > 0 && (
                                <div>
                                    <label className="block text-[12px] font-bold text-[#6C8576] mb-1.5">{t("model")}</label>
                                    <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full rounded-[12px] bg-[#F4F9F4] border border-[#E9F4EC] px-3 py-2.5 text-[14px] font-semibold text-[#113A28] focus:outline-none focus:border-[#4CAF50]">
                                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            )}

                            {connectionError && (
                                <div className="text-[12px] font-bold text-red-500 bg-red-50 p-3 rounded-[12px] border border-red-100 whitespace-pre-wrap">{connectionError}</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto px-5 py-6">
                <div className="max-w-md mx-auto space-y-5">
                    {messages.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                            <div className="w-20 h-20 bg-[#DBEDD9] rounded-full flex items-center justify-center mb-2 shadow-sm">
                                <Bot className="w-10 h-10 text-[#184F35]" />
                            </div>
                            <h2 className="text-[20px] font-black text-[#113A28]">
                                {mode === "phone" ? t("on_phone_ai") : t("local_ai_assistant")}
                            </h2>
                            <p className="text-[14px] font-medium text-[#6C8576] max-w-[260px]">
                                {mode === "phone" ? t("private_ai_phone") : t("private_ai_pc")}
                            </p>

                            {models.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                    {[t("what_crops"), t("soil_tips"), t("pest_control")].map(q => (
                                        <button key={q} onClick={() => setInput(q)} className="bg-white border border-[#E9F4EC] rounded-full px-4 py-2 text-[13px] font-bold text-[#184F35] hover:bg-[#DBEDD9] transition-colors shadow-sm active:scale-95">
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {models.length === 0 && !isFetchingModels && (
                                <div className="bg-[#FFF8DF] border border-[#FBE6A2] text-[#B07D00] p-4 rounded-[16px] text-[12px] font-bold max-w-[300px] mt-4 shadow-sm text-left whitespace-pre-wrap">
                                    <p className="mb-2">⚠️ {connectionError || "Not connected"}</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }} key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-[#184F35]" : "bg-[#DBEDD9] border border-[#B7D8C6]"}`}>
                                {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[#184F35]" />}
                            </div>
                            <div className={`max-w-[78%] px-4 py-3 rounded-[20px] whitespace-pre-wrap ${msg.role === "user" ? "bg-[#184F35] text-white rounded-tr-[4px] shadow-sm" : "bg-white text-[#113A28] border border-[#E9F4EC] rounded-tl-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]"}`}>
                                <p className="text-[14.5px] font-medium leading-[1.6]">{msg.content}</p>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#DBEDD9] border border-[#B7D8C6] flex items-center justify-center shrink-0 mt-1"><Bot className="w-4 h-4 text-[#184F35]" /></div>
                            <div className="bg-white border border-[#E9F4EC] rounded-[20px] rounded-tl-[4px] px-5 py-4 shadow-sm flex items-center gap-1.5 h-[50px]">
                                <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:0}} className="w-2 h-2 rounded-full bg-[#B7D8C6]" />
                                <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.2}} className="w-2 h-2 rounded-full bg-[#B7D8C6]" />
                                <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.4}} className="w-2 h-2 rounded-full bg-[#B7D8C6]" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={bottomRef} className="h-4" />
                </div>
            </div>

            <div className="bg-white px-4 py-3 pb-6 border-t border-[#E9F4EC] z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <div className="max-w-md mx-auto relative flex items-end bg-[#F4F9F4] rounded-[24px] pr-2 pl-4 py-1.5 border border-[#E9F4EC] shadow-inner focus-within:border-[#B7D8C6] focus-within:ring-2 focus-within:ring-[#B7D8C6]/20 transition-all">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={models.length > 0 ? t("ask_placeholder") : t("connect_first")}
                        className="flex-1 max-h-[120px] min-h-[44px] bg-transparent resize-none outline-none py-3 text-[15px] font-medium text-[#113A28] placeholder-[#8DA697]"
                        rows={1}
                        disabled={models.length === 0 || isLoading}
                    />
                    <button onClick={handleSend} disabled={!input.trim() || models.length === 0 || isLoading} className="w-[44px] h-[44px] shrink-0 rounded-[18px] bg-[#184F35] flex items-center justify-center ml-2 text-white disabled:opacity-50 disabled:bg-[#B7D8C6] hover:bg-[#123926] transition-colors shadow-sm mb-0.5 active:scale-95">
                        {isLoading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Send className="w-[18px] h-[18px] ml-0.5" />}
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] font-bold text-[#8DA697] uppercase tracking-wider">
                        {mode === "phone" ? "📱 Phone Ollama" : "🖥️ PC Ollama"} · {selectedModel || "not connected"}
                    </p>
                </div>
            </div>
        </div>
    );
}
