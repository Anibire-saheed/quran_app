"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, BookOpen, Music, Heart, Search, Settings, User, LogOut,
  Activity, FolderOpen, Bookmark, LayoutGrid, Users, Target,
  FileText, Sparkles, Sun, Moon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/store/useThemeStore";

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

// Islamic geometric quatrefoil frame — pointed arches top/bottom, rounded lobes left/right
const FRAME = "M50 4Q62 6 66 22L78 22L78 34A16 16 0 0 0 78 66L78 78L66 78Q62 94 50 96Q38 94 34 78L22 78L22 66A16 16 0 0 0 22 34L22 22L34 22Q38 6 50 4Z";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { mode, setMode } = useThemeStore();

  const toggleTheme = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const initial = user?.name?.[0]?.toUpperCase() ?? "G";

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex flex-col w-64 fixed left-3 top-3 z-50
        h-[calc(100vh-1.5rem)] rounded-2xl overflow-hidden
        bg-white dark:bg-[#07101f]
        border border-slate-200/80 dark:border-white/[0.07]
        shadow-xl shadow-black/[0.07] dark:shadow-black/40"
    >
      {/* ── Header ── */}
      <div className="relative px-5 pt-5 pb-4 overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-emerald-400/10 dark:bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -top-4 right-0 w-24 h-24 rounded-full bg-amber-400/10 dark:bg-amber-600/8 blur-2xl pointer-events-none" />

        <Link href="/dashboard" className="flex items-center gap-3 group relative z-10">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-lg shadow-emerald-900/20 ring-1 ring-white/10"
          >
            <img src="/logo.svg" alt="Kashaf" className="w-full h-full object-contain" />
          </motion.div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Kashaf
            </h1>
            <p className="text-[10px] mt-0.5 font-medium text-slate-400 dark:text-white/30 tracking-wide">
              كَشَّاف
            </p>
          </div>
        </Link>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-5 right-5 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-white/8 to-transparent" />
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-3">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && "mt-4")}>
            {/* Group label */}
            <div className="flex items-center gap-2 px-2 mb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-white/20">
                {group.label}
              </span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
            </div>

            <div className="space-y-0.5">
              {group.items.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gi * 0.05 + i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 group",
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-700 dark:text-white/40 dark:hover:text-white/75"
                      )}
                    >
                      {/* Active background */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="active-bg"
                            className="absolute inset-0 rounded-xl bg-slate-50 dark:bg-white/6 border border-slate-200 dark:border-white/8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Icon badge — Islamic frame shape */}
                      <div className="relative z-10 w-8 h-8 shrink-0 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
                          <path
                            d={FRAME}
                            strokeWidth="5"
                            className={cn(
                              "transition-colors duration-200",
                              isActive
                                ? "fill-emerald-100 stroke-emerald-400/70 dark:fill-emerald-500/20 dark:stroke-emerald-400/50"
                                : "fill-slate-100 stroke-slate-200 dark:fill-white/6 dark:stroke-white/10 group-hover:fill-slate-200 group-hover:stroke-slate-300 dark:group-hover:fill-white/10 dark:group-hover:stroke-white/20"
                            )}
                          />
                        </svg>
                        <item.icon className={cn(
                          "relative z-10 w-3.5 h-3.5 transition-colors",
                          isActive
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-slate-400 dark:text-white/35 group-hover:text-slate-600 dark:group-hover:text-white/60"
                        )} />
                      </div>

                      <span className="relative z-10 flex-1 leading-none">{item.label}</span>

                      {/* Active dot */}
                      {isActive && (
                        <motion.div
                          layoutId="active-dot"
                          className="relative z-10 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
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
      <div className="px-3 pb-4 pt-2">
        {/* Gradient divider */}
        <div className="h-px bg-linear-to-r from-transparent via-slate-200 dark:via-white/8 to-transparent mb-2" />

        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all mb-2 group",
            pathname === "/settings"
              ? "text-slate-900 bg-slate-50 border border-slate-200 dark:text-white dark:bg-white/6 dark:border-white/8"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/5"
          )}
        >
          <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
              <path
                d={FRAME}
                strokeWidth="5"
                className={cn(
                  "transition-colors duration-200",
                  pathname === "/settings"
                    ? "fill-slate-200 stroke-slate-400/60 dark:fill-white/15 dark:stroke-white/30"
                    : "fill-slate-100 stroke-slate-200 dark:fill-white/6 dark:stroke-white/10 group-hover:fill-slate-200 group-hover:stroke-slate-300 dark:group-hover:fill-white/10 dark:group-hover:stroke-white/20"
                )}
              />
            </svg>
            <Settings className={cn(
              "relative z-10 w-3.5 h-3.5 transition-all duration-300 group-hover:rotate-45",
              pathname === "/settings" ? "text-slate-700 dark:text-white/80" : "text-slate-400 dark:text-white/40"
            )} />
          </div>
          Settings
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/5 transition-all mb-2 group"
        >
          <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
              <path
                d={FRAME}
                strokeWidth="5"
                className="fill-slate-100 stroke-slate-200 dark:fill-white/6 dark:stroke-white/10 group-hover:fill-slate-200 group-hover:stroke-slate-300 dark:group-hover:fill-white/10 dark:group-hover:stroke-white/20 transition-colors duration-200"
              />
            </svg>
            {mode === 'dark' ? (
              <Sun className="relative z-10 w-3.5 h-3.5 text-slate-400 dark:text-white/40 group-hover:text-amber-500 transition-colors" />
            ) : (
              <Moon className="relative z-10 w-3.5 h-3.5 text-slate-400 dark:text-white/40 group-hover:text-slate-700 transition-colors" />
            )}
          </div>
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User card */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl islamic-gradient flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-900/25">
              {initial}
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#07101f]" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate leading-tight text-slate-800 dark:text-white/85">
              {user?.name ?? "Guest"}
            </p>
            <p className="text-[10px] truncate text-slate-400 dark:text-white/30 leading-tight mt-0.5">
              {user?.email ?? "Not signed in"}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/profile"
              title="Profile"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:text-white/30 dark:hover:text-white/70 dark:hover:bg-white/10 transition-all"
            >
              <User className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              aria-label="Log out"
              onClick={logout}
              title="Log out"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:text-white/30 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
