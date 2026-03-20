import { AlertTriangle, Info, BellRing, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "danger" | "warning" | "info" | "success";

interface AlertCardProps {
    type?: AlertType;
    title: string;
    description: string;
    date?: string;
    className?: string;
}

export function AlertCard({ type = "info", title, description, date, className }: AlertCardProps) {
    const getAlertConfig = (type: AlertType) => {
        switch (type) {
            case "danger":
                return {
                    icon: AlertTriangle,
                    iconBg: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
                    border: "border-red-100 dark:border-red-900/30",
                    indicator: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                };
            case "warning":
                return {
                    icon: AlertTriangle,
                    iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    border: "border-amber-100 dark:border-amber-900/30",
                    indicator: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                };
            case "success":
                return {
                    icon: ShieldCheck,
                    iconBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    border: "border-emerald-100 dark:border-emerald-900/30",
                    indicator: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                };
            default:
                return {
                    icon: Info,
                    iconBg: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
                    border: "border-blue-100 dark:border-blue-900/30",
                    indicator: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                };
        }
    };

    const config = getAlertConfig(type);
    const Icon = config.icon;

    return (
        <div className={cn(
            "group flex items-center gap-3 bg-white dark:bg-zinc-900 border shadow-sm rounded-full p-2 pr-4 transition-all hover:shadow-md cursor-pointer",
            config.border,
            className
        )}>
            <div className={cn("flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center", config.iconBg)}>
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm md:text-base font-bold text-foreground leading-tight truncate">{title}</h4>
                    {date && <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap ml-2">{date}</span>}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-tight truncate">{description}</p>
            </div>
            <div className="flex-shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-foreground transition-colors ml-1">
                <ChevronRight size={18} />
            </div>
        </div>
    );
}
