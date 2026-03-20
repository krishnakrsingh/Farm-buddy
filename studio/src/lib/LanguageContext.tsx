"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations } from "./translations";

export type Language = {
    code: string;
    name: string;
    native: string;
};

export const LANGUAGES: Language[] = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "as", name: "Assamese", native: "অসমীয়া" },
    { code: "mai", name: "Maithili", native: "मैथिली" },
    { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
    { code: "ur", name: "Urdu", native: "اردو" },
    { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
    { code: "doi", name: "Dogri", native: "डोगरी" },
    { code: "kok", name: "Konkani", native: "कोंकणी" },
    { code: "mni", name: "Manipuri", native: "মৈতৈলোন্" },
    { code: "brx", name: "Bodo", native: "बड़ो" },
    { code: "sd", name: "Sindhi", native: "سنڌي" },
    { code: "ks", name: "Kashmiri", native: "कॉशुर" },
    { code: "ne", name: "Nepali", native: "नेपाली" },
];

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);

    useEffect(() => {
        const saved = localStorage.getItem("drfarm-language");
        if (saved) {
            const found = LANGUAGES.find((l) => l.code === saved);
            if (found) setLanguageState(found);
        }
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("drfarm-language", lang.code);
    }, []);

    const t = useCallback(
        (key: string): string => {
            const langTranslations = translations[language.code];
            if (langTranslations && langTranslations[key]) {
                return langTranslations[key];
            }
            // Fallback to English
            if (translations["en"] && translations["en"][key]) {
                return translations["en"][key];
            }
            return key;
        },
        [language]
    );

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
