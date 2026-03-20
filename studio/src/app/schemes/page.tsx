"use client";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/LanguageContext";

export default function SchemesPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pb-24">
            <div className="bg-amber-600 text-white p-4 pt-6 pb-6 rounded-b-3xl shadow-sm relative z-20">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/more" className="p-2 -ml-2 hover:bg-white/20 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-white" />
                    </Link>
                    <h1 className="text-xl font-bold">{t("government_schemes")}</h1>
                </div>
                <p className="text-amber-100 font-medium px-1 text-sm">{t("find_support")}</p>
            </div>

            <div className="flex-1 w-full max-w-lg mx-auto relative px-4 mt-6">
                <div className="space-y-4">
                    <Card className="border-border shadow-sm bg-card overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-foreground text-lg w-3/4">{t("pm_kisan")}</h3>
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{t("active_status")}</span>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground leading-snug">{t("pm_kisan_desc")}</p>
                            <div className="flex items-center gap-2 pt-2 text-sm">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span className="font-medium">{t("you_are_eligible")}</span>
                            </div>
                            <button className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg transition-colors">
                                {t("apply_now")}
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm bg-card overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-foreground text-lg w-3/4">{t("tractor_subsidy")}</h3>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{t("closes_soon")}</span>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground leading-snug">{t("tractor_subsidy_desc")}</p>
                            <button className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg transition-colors">
                                {t("check_eligibility")}
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
