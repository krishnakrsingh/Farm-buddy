"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Map, Activity, Home, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/field", label: "Field", icon: Map },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/schemes", label: "Schemes", icon: Landmark },
  { href: "/mandi-prices", label: "Prices", icon: Activity },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[380px] z-50">
      <nav className="w-full bg-white rounded-full shadow-[0_20px_40px_rgba(24,79,53,0.12)] p-2 flex justify-between items-center border border-[#E9F4EC]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] rounded-full flex flex-col items-center justify-center transition-colors duration-200 shrink-0",
                isActive
                  ? "bg-[#184F35] shadow-md"
                  : "hover:bg-[#F4F9F4]"
              )}
            >
              <Icon
                className={cn(
                  isActive ? "w-6 h-6 text-white" : "w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] text-[#A0B8AA]"
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
