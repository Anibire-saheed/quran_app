"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, Music, Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: BookOpen, label: "Read", href: "/reading" },
  { icon: Music, label: "Audio", href: "/reciters" },
  { icon: Heart, label: "Saved", href: "/favorites" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-white/10 glass-effect flex items-center justify-around px-2 z-50"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-1 p-2 min-w-[64px]"
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-pill"
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-brand-emerald-light"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div
              animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-brand-emerald-light" : "text-slate-400"
                )}
              />
            </motion.div>
            <motion.span
              animate={{ color: isActive ? "#059669" : "#94a3b8" }}
              className="text-[10px] font-semibold"
            >
              {item.label}
            </motion.span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
