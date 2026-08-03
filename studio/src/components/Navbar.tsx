"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Activity, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/field", label: "Live Herd", icon: Activity },
  { href: "/scan", label: "Camera", icon: Camera },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] z-50 flex items-center justify-center gap-3">
      {/* Floating small circular avatar badge on the left */}
      <Link
        href="/"
        className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-white shadow-[0_12px_24px_rgba(24,79,53,0.15)] shrink-0 hover:scale-105 active:scale-95 transition-transform bg-white flex items-center justify-center"
        title="Profile / Herd Manager"
      >
        <img
          src="https://i.pravatar.cc/150?img=33"
          alt="Krishna Profile"
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Main floating pill bottom nav */}
      <nav className="w-full bg-white rounded-full shadow-[0_20px_40px_rgba(24,79,53,0.12)] p-1.5 flex justify-around items-center border border-[#E9F4EC]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "w-[48px] h-[48px] rounded-full flex flex-col items-center justify-center transition-all duration-200 shrink-0 active:scale-95",
                isActive
                  ? "bg-[#184F35] shadow-md scale-105"
                  : "hover:bg-[#F4F9F4]"
              )}
            >
              <Icon
                className={cn(
                  isActive ? "w-5 h-5 text-white" : "w-[22px] h-[22px] text-[#A0B8AA]"
                )}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
