"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Home, Bell, MessageSquare, Camera, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/herd", label: "Herd", icon: Map },
  { href: "/alerts", label: "Alerts", icon: Bell, badge: 3 },
  { href: "/hardware", label: "Tag", icon: Cpu },
  { href: "/scan", label: "Scan", icon: Camera },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-[400px] z-50">
      <nav className="w-full bg-white/90 backdrop-blur-xl rounded-full shadow-[0_20px_50px_rgba(17,58,40,0.18)] p-1.5 flex justify-around items-center border border-white/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-2 px-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 shrink-0 active:scale-95 group"
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-[#184F35] rounded-full shadow-md z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive ? "text-white" : "text-[#8DA697] group-hover:text-[#184F35]"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span
                  className={cn(
                    "text-[9px] font-extrabold mt-0.5 tracking-tight transition-colors duration-200",
                    isActive ? "text-white" : "text-[#8DA697] group-hover:text-[#184F35]"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {item.badge && !isActive && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
