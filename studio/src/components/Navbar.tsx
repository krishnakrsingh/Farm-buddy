"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Users, Map, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/field", label: "Field", icon: Map },
  { href: "/scan", label: "Scan C.", icon: Camera, main: true },
  { href: "/community", label: "Chaupal", icon: Users },
  { href: "/mandi-prices", label: "Prices", icon: Activity },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="flex items-center justify-between gap-1 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2.5rem] pointer-events-auto w-full max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isMain = item.main;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center transition-all duration-300",
                isMain
                  ? "w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 -mt-6 ring-4 ring-white dark:ring-zinc-900"
                  : "w-12 h-12 rounded-2xl",
                !isMain && isActive ? "text-primary" : "",
                !isMain && !isActive ? "text-muted-foreground hover:text-foreground" : ""
              )}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <Icon
                  size={isMain ? 24 : 20}
                  strokeWidth={isActive || isMain ? 2.5 : 2}
                  className={cn(
                    "transition-transform duration-300",
                    isActive && !isMain ? "scale-110 mb-0.5" : "scale-100"
                  )}
                />

                {!isMain && (
                  <span className={cn(
                    "text-[9px] font-bold tracking-tight transition-all duration-300",
                    isActive ? "opacity-100 text-primary" : "opacity-70 group-hover:opacity-100"
                  )}>
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
