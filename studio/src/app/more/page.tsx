"use client";

import Link from "next/link";
import { FileText, BookOpen, ShoppingBag, Newspaper, User, ChevronRight, HelpCircle } from "lucide-react";

export default function MoreServicesPage() {
    const serviceCategories = [
        {
            title: "Utility",
            items: [
                { name: "Farm Records", desc: "Track crops, fertilizer, and yield", icon: BookOpen, href: "/records", iconStyle: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" },
                { name: "Gov Schemes", desc: "Find PM-Kisan & subsidies", icon: FileText, href: "/schemes", iconStyle: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" },
            ]
        },
        {
            title: "Community",
            items: [
                { name: "Marketplace", desc: "Buy or sell equipment", icon: ShoppingBag, href: "/marketplace", iconStyle: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" },
                { name: "Agri News", desc: "Latest farming updates", icon: Newspaper, href: "/news", iconStyle: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" },
            ]
        },
        {
            title: "Account",
            items: [
                { name: "My Profile", desc: "Settings and personal details", icon: User, href: "/profile", iconStyle: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300" },
                { name: "Help & Support", desc: "Contact doctor or admin", icon: HelpCircle, href: "#", iconStyle: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-32">

            {/* Premium Airy Header */}
            <div className="pt-4 pb-6 px-6 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
                <h1 className="text-3xl font-black text-foreground tracking-tight mb-1">More Services</h1>
                <p className="text-muted-foreground text-sm font-medium">Tools, news, and your account</p>
            </div>

            <div className="px-5 mt-2 max-w-xl mx-auto space-y-8">

                {serviceCategories.map((category, idx) => (
                    <div key={idx}>
                        <h2 className="text-lg font-black text-foreground tracking-tight mb-4 pl-1">
                            {category.title}
                        </h2>

                        <div className="grid gap-3">
                            {category.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={itemIdx} href={item.href} className="group relative bg-white dark:bg-zinc-900 border border-border/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all rounded-3xl p-4 flex items-center">
                                        <div className={`p-3 rounded-2xl ${item.iconStyle} mr-4 transition-transform group-hover:scale-110 shadow-sm`}>
                                            <Icon size={22} className="stroke-2" />
                                        </div>
                                        <div className="flex-1 pr-4">
                                            <h3 className="font-bold text-foreground text-[15px]">{item.name}</h3>
                                            <p className="text-[13px] font-medium text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
                                        </div>
                                        <div className="bg-muted group-hover:bg-primary group-hover:text-primary-foreground p-2 rounded-full transition-colors text-muted-foreground shrink-0">
                                            <ChevronRight size={18} strokeWidth={3} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
