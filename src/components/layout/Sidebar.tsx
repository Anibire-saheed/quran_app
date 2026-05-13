"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, BookOpen, Music, Heart, Search, Settings, User, LogOut,
  Activity, FolderOpen, Bookmark, LayoutGrid, Users, Target,
  FileText, Sparkles, ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const NAV_GROUPS = [
  {
    label: "Discover",
    items: [
      { icon: Home,       label: "Home",       href: "/dashboard" },
      { icon: LayoutGrid, label: "Chapters",   href: "/chapters"  },
      { icon: Search,     label: "Search",     href: "/search"    },
      { icon: BookOpen,   label: "Reading",    href: "/reading"   },
      { icon: Music,      label: "Reciters",   href: "/reciters"  },
    ],
  },
  {
    label: "Community",
    items: [
      { icon: Users,    label: "Rooms",      href: "/rooms"      },
      { icon: Sparkles, label: "Reflect",    href: "/reflect"    },
      { icon: Activity, label: "Activities", href: "/activities" },
    ],
  },
  {
    label: "Personal",
    items: [
      { icon: Target,     label: "Goals",       href: "/goals"       },
      { icon: FileText,   label: "Notes",       href: "/notes"       },
      { icon: FolderOpen, label: "Collections", href: "/collections" },
      { icon: Bookmark,   label: "Bookmarks",   href: "/bookmarks"   },
      { icon: Heart,      label: "Favorites",   href: "/favorites"   },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-50
        bg-white border-r border-slate-200
        dark:bg-[#080f1e] dark:border-white/6"
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-200 dark:border-white/6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-9 h-9 shrink-0"
          >
            <div className="absolute inset-0 islamic-gradient-light dark:islamic-gradient rounded-xl opacity-40 blur-sm animate-pulse-slow" />
            <div className="relative w-9 h-9 islamic-gradient-light dark:islamic-gradient rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-900/40">
              Q
            </div>
          </motion.div>
          <div>
            <p className="text-sm font-black tracking-tight leading-none text-slate-800 dark:text-white">
              Quran Majeed
            </p>
            <p className="text-[10px] font-semibold mt-0.5 text-slate-400 dark:text-white/30">
              Premium
            </p>
          </div>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] px-3 mb-1.5 text-slate-400 dark:text-white/20">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group",
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/4"
                      )}
                    >
                      {/* Active pill bg */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl bg-slate-100 border border-slate-200 dark:bg-white/7 dark:border-white/9"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}

                      {/* Active left bar */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-bar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full islamic-gradient-light dark:islamic-gradient"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}

                      <item.icon
                        className={cn(
                          "w-4 h-4 relative z-10 shrink-0 transition-colors",
                          isActive ? "text-brand-gold dark:text-brand-emerald-light" : "group-hover:text-slate-700 dark:group-hover:text-white/70"
                        )}
                      />
                      <span className="relative z-10 flex-1">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-3 h-3 relative z-10 text-slate-400 dark:text-white/30" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div className="border-t border-slate-200 dark:border-white/6 p-3 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
            pathname === "/settings"
              ? "text-slate-900 bg-slate-100 dark:text-white dark:bg-white/7"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/4"
          )}
        >
          <Settings className="w-4 h-4 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          Settings
        </Link>

        {/* User card */}
        <div className="mt-1 flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-white/3 dark:border-white/5">
          <div className="w-8 h-8 rounded-full islamic-gradient-light dark:islamic-gradient flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-emerald-900/30">
            {user?.name?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate leading-none text-slate-700 dark:text-white/80">
              {user?.name ?? "Guest"}
            </p>
            <p className="text-[10px] mt-0.5 truncate text-slate-400 dark:text-white/30">
              {user?.email ?? ""}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Link
              href="/profile"
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 dark:hover:bg-white/10 dark:text-white/30 dark:hover:text-white transition-colors"
            >
              <User className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              aria-label="Log out"
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 dark:hover:bg-red-500/10 dark:text-white/30 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
