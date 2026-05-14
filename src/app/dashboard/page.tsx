"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchSurahs, fetchRandomVerse, fetchCurrentStreak, fetchTodaysGoalPlan,
  fetchTafsirByAyah,
} from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import SurahCard from "@/components/features/SurahCard";
import {
  Search, Sparkles, Flame, Target, BookOpen, Headphones,
  Bookmark, Users, ChevronRight, Star, Activity, ScrollText, ChevronDown,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import Link from "next/link";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return { text: "Good night", sub: "May Allah grant you peaceful rest." };
  if (h < 12) return { text: "Good morning", sub: "Start your day with the words of Allah." };
  if (h < 17) return { text: "Good afternoon", sub: "Take a moment to read a few verses." };
  if (h < 20) return { text: "Good evening", sub: "Reflect on what you've read today." };
  return { text: "Good night", sub: "End your day with the remembrance of Allah." };
}

const QUICK_ACTIONS = [
  {
    icon: BookOpen, label: "Continue\nReading", href: "/reading",
    img: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&q=80&fit=crop",
    overlay: "from-emerald-900/70 to-emerald-600/40",
  },
  {
    icon: Headphones, label: "Listen", href: "/reciters",
    img: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&q=80&fit=crop",
    overlay: "from-blue-900/70 to-blue-600/40",
  },
  {
    icon: Target, label: "My Goals", href: "/goals",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&fit=crop",
    overlay: "from-amber-900/70 to-amber-600/40",
  },
  {
    icon: Users, label: "Reading\nRooms", href: "/rooms",
    img: "/mosque-bg.png",
    overlay: "from-violet-900/70 to-violet-600/40",
  },
  {
    icon: Bookmark, label: "Bookmarks", href: "/bookmarks",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80&fit=crop",
    overlay: "from-rose-900/70 to-rose-600/40",
  },
  {
    icon: Activity, label: "Activities", href: "/activities",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80&fit=crop",
    overlay: "from-cyan-900/70 to-cyan-600/40",
  },
];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState("");
  const [greeting, setGreeting] = useState<{ text: string; sub: string } | null>(null);
  const [timezone, setTimezone] = useState("UTC");
  const [showTafsir, setShowTafsir] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const { data: surahs, isLoading: surahsLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: () => fetchSurahs(),
  });

  const { data: verseData } = useQuery({
    queryKey: ["random-verse"],
    queryFn: () => fetchRandomVerse(),
    staleTime: 1000 * 60 * 30,
  });

  const { data: tafsirData, isLoading: tafsirLoading } = useQuery({
    queryKey: ["votd-tafsir", verseData?.verse_key],
    queryFn: () => fetchTafsirByAyah("169", verseData!.verse_key),
    enabled: !!verseData?.verse_key && showTafsir,
    staleTime: 1000 * 60 * 60,
  });

  const { data: streakData } = useQuery({
    queryKey: ["dashboard-streak"],
    queryFn: () => fetchCurrentStreak("QURAN", timezone),
    enabled: isAuthenticated,
  });

  const { data: todaysPlan } = useQuery({
    queryKey: ["dashboard-plan"],
    queryFn: () => fetchTodaysGoalPlan({ type: "QURAN_TIME", mushafId: 4 }, timezone),
    enabled: isAuthenticated,
  });

  const filteredSurahs = useMemo(
    () => surahs?.filter((s: any) =>
      s.name_simple.toLowerCase().includes(search.toLowerCase()) ||
      s.name_arabic.includes(search) ||
      String(s.id).includes(search)
    ) ?? [],
    [surahs, search],
  );

  const streakDays = streakData?.data?.days ?? streakData?.days ?? 0;
  const goals: any[] = todaysPlan?.goals ?? todaysPlan?.data ?? [];
  const completedGoals = goals.filter((g: any) => g.isCompleted).length;

  const verse = verseData;
  const verseArabic = verse?.text_uthmani ?? verse?.text_arabic ?? "";
  const verseTranslation = verse?.translations?.[0]?.text ?? "";
  const verseKey = verse?.verse_key ?? "";
  const tafsirText: string = tafsirData?.tafsir?.text ?? tafsirData?.tafsirs?.[0]?.text ?? tafsirData?.text ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-10">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-[280px] p-4 lg:p-8 max-w-7xl">

        {/* ─── WELCOME HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-emerald-900/40"
        >
          {/* Background image */}
          <img
            src="/mosque-bg.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/90 via-emerald-900/75 to-emerald-950/60 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24 animate-pulse-slow pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-brand-gold/15 rounded-full blur-2xl -mb-16 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/4 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />

          <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-black tracking-[0.35em] uppercase mb-5 backdrop-blur-sm"
              >
                {/* <Sparkles className="w-3 h-3" />
                The Noble Quran */}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-3xl lg:text-5xl font-black text-white mb-2 leading-tight"
              >
                {greeting ? (
                  <>
                    {greeting.text}
                    {isAuthenticated && user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
                  </>
                ) : (
                  <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse" />
                )}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-white/60 text-base font-medium"
              >
                {greeting?.sub ?? ""}
              </motion.p>

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="relative group max-w-lg mt-7"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-amber-300 transition-colors" />
                <input
                  type="text"
                  placeholder="Search Surah by name or number…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-amber-300/40 transition-all"
                />
              </motion.div>
            </div>

            {/* Stats */}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex lg:flex-col gap-4 shrink-0"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[140px]">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white leading-none">{streakDays}</p>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-wide mt-0.5">Day streak</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[140px]">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white leading-none">{completedGoals}/{goals.length}</p>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-wide mt-0.5">Goals today</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* ─── VERSE OF THE DAY ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="xl:col-span-2 relative overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 p-8"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-amber-400 mb-6">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-[10px] font-black tracking-[0.35em] uppercase">Verse of the Day</span>
              </div>
              {verseArabic ? (
                <>
                  {/* Arabic */}
                  <motion.p
                    key={verseArabic}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="arabic-text text-3xl lg:text-4xl text-slate-800 dark:text-white/90 leading-loose mb-6 text-right font-medium"
                    dir="rtl"
                  >
                    {verseArabic}
                  </motion.p>

                  {/* Translation */}
                  {verseTranslation && (
                    <p className="text-slate-700 dark:text-white/55 text-sm leading-relaxed italic mb-5"
                      dangerouslySetInnerHTML={{ __html: verseTranslation.replace(/<[^>]+>/g, "") }} />
                  )}

                  {/* Tafsir toggle */}
                  <button
                    type="button"
                    onClick={() => setShowTafsir(s => !s)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/60 hover:text-amber-400 transition-colors mb-3 group"
                  >
                    <ScrollText className="w-3.5 h-3.5" />
                    {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
                    <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", showTafsir && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {showTafsir && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-200 dark:border-white/10 pt-4 mb-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/25 mb-3">
                            Tafsir Ibn Kathir
                          </p>
                          {tafsirLoading ? (
                            <div className="space-y-2">
                              {(["w-4/5", "w-3/4", "w-2/3", "w-1/2"] as const).map((w) => (
                                <div key={w} className={cn("h-3.5 bg-slate-200 dark:bg-white/5 rounded-full animate-pulse", w)} />
                              ))}
                            </div>
                          ) : tafsirText ? (
                            <div
                              className="text-slate-800 dark:text-white/45 text-sm leading-relaxed prose prose-slate dark:prose-invert prose-sm max-w-none
                                [&_p]:mb-3 [&_h1]:hidden [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mb-2 line-clamp-10"
                              dangerouslySetInnerHTML={{ __html: tafsirText }}
                            />
                          ) : (
                            <p className="text-slate-400 dark:text-white/30 text-sm italic">No tafsir available for this verse.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer row */}
                  {verseKey && (
                    <div className="flex items-center justify-between pt-1">
                      <Link href={`/surah/${verseKey.split(":")[0]}`}
                        className="inline-flex items-center gap-1.5 text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors font-bold uppercase tracking-wider">
                        {verseKey} <ChevronRight className="w-3 h-3" />
                      </Link>
                      <Link href={`/surah/${verseKey.split(":")[0]}`}
                        className="text-[10px] text-slate-400 hover:text-slate-600 dark:text-white/20 dark:hover:text-white/50 transition-colors font-medium">
                        Read full surah →
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="h-8 bg-slate-200 dark:bg-white/5 rounded-xl animate-pulse w-3/4 ml-auto" />
                  <div className="h-8 bg-slate-200 dark:bg-white/5 rounded-xl animate-pulse w-1/2 ml-auto" />
                  <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-lg animate-pulse w-full mt-6" />
                  <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-lg animate-pulse w-4/5" />
                </div>
              )}
            </div>
          </motion.div>

          {/* ─── QUICK STATS SIDE ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4"
          >
            <h3 className="font-bold text-sm text-slate-400 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-emerald-light" /> Quick Access
            </h3>
            {[
              { icon: BookOpen, label: "Read Quran", sub: "All 114 Surahs", href: "/chapters", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Headphones, label: "Audio Player", sub: "100+ Reciters", href: "/reciters", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Search, label: "Search Verses", sub: "Full-text search", href: "/search", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: Bookmark, label: "My Bookmarks", sub: "Saved verses", href: "/bookmarks", color: "text-rose-400", bg: "bg-rose-500/10" },
            ].map(({ icon: Icon, label, sub, href, color, bg }) => (
              <Link key={href} href={href}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm group-hover:text-brand-emerald-light transition-colors">{label}</p>
                  <p className="text-[10px] text-slate-500">{sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </motion.div>
        </div>

        {/* ─── QUICK ACTIONS ─── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-10"
        >
          {QUICK_ACTIONS.map(({ icon: Icon, label, href, img, overlay }) => (
            <motion.div key={href} variants={fadeUp} whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link href={href} className="relative flex flex-col items-center justify-end overflow-hidden rounded-2xl shadow-lg h-28 group">
                {/* Background image */}
                <img
                  src={img}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className={cn("absolute inset-0 bg-linear-to-t", overlay)} />
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-1.5 pb-3 px-2 text-center">
                  <Icon className="w-5 h-5 text-white drop-shadow" />
                  <span className="text-white font-bold text-[11px] leading-tight drop-shadow whitespace-pre-line">
                    {label}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── SURAH BROWSER ─── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2">
              All Surahs
              {search && (
                <AnimatePresence>
                  <motion.span
                    key="count"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-sm font-normal text-slate-400"
                  >
                    — {filteredSurahs.length} result{filteredSurahs.length !== 1 ? "s" : ""}
                  </motion.span>
                </AnimatePresence>
              )}
            </h2>
            <span className="text-sm text-slate-500">{surahs?.length ?? 0} total</span>
          </motion.div>

          {surahsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08 }}
                  className="h-44 rounded-3xl bg-white/5"
                />
              ))}
            </div>
          ) : filteredSurahs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10"
            >
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No surahs found for &ldquo;{search}&rdquo;</p>
            </motion.div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filteredSurahs.map((surah: any, i: number) => (
                <motion.div key={surah.id} variants={fadeUp}>
                  <SurahCard surah={surah} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
