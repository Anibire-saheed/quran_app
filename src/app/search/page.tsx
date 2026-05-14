"use client";

import { useQuery } from "@tanstack/react-query";
import { searchQuran } from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import {
  Search, X, ChevronRight, BookOpen, Layers,
  SlidersHorizontal, Hash, FileText, ToggleLeft, ToggleRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

// ── Types ──────────────────────────────────────────────────────────────────────
interface NavResult {
  key: string | number;
  name: string;
  resultType: "surah" | "juz" | "page" | string;
}

interface VerseResult {
  // quick mode fields
  key?: string;
  name?: string;
  arabic?: string;
  // advanced mode fields
  verse_key?: string;
  text?: string;
  highlighted?: string;
  text_uthmani?: string;
}

interface SearchResult {
  result?: {
    navigation?: NavResult[];
    verses?: VerseResult[];
  };
  pagination?: {
    current_page: number;
    total_pages: number;
    total_records: number;
    per_page: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const NAV_TYPE_ICON: Record<string, React.ElementType> = {
  surah: BookOpen,
  juz:   Layers,
  page:  FileText,
};

const NAV_TYPE_HREF = (nav: NavResult) => {
  if (nav.resultType === "surah") return `/surah/${nav.key}`;
  if (nav.resultType === "juz")   return `/reading?juz=${nav.key}`;
  return `/reading?page=${nav.key}`;
};

const verseKey  = (v: VerseResult) => v.key       ?? v.verse_key ?? "";
const verseText = (v: VerseResult) => v.highlighted ?? v.name ?? v.text ?? "";
const surahId   = (v: VerseResult) => (verseKey(v).split(":")[0]);

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={cn("bg-white/5 animate-pulse rounded-2xl", className)} />;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [query, setQuery]               = useState("");
  const [debouncedQuery, setDebounced]  = useState("");
  const [mode, setMode]                 = useState<"quick" | "advanced">("quick");
  const [showFilters, setShowFilters]   = useState(false);
  const [exactMatch, setExactMatch]     = useState(false);
  const [translationId, setTranslation] = useState("131");
  const [page, setPage]                 = useState(1);

  // Debounce input
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(query); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const enabled = debouncedQuery.trim().length > 1;

  const { data, isLoading, isFetching } = useQuery<SearchResult>({
    queryKey: ["search", debouncedQuery, mode, exactMatch, translationId, page],
    queryFn: () =>
      searchQuran(
        mode === "quick"
          ? {
              mode: "quick",
              query: debouncedQuery,
              get_text: "1",
              highlight: "1",
              navigationalResultsNumber: 6,
              versesResultsNumber: 20,
              indexes: "quran,translations",
              translation_ids: translationId,
            }
          : {
              mode: "advanced",
              query: debouncedQuery,
              get_text: "1",
              highlight: "1",
              translation_ids: translationId,
              exact_matches_only: exactMatch ? "1" : "0",
            }
      ),
    enabled,
    staleTime: 30_000,
  });

  const navResults   = data?.result?.navigation ?? [];
  const verseResults = data?.result?.verses ?? [];
  const pagination   = data?.pagination;
  const loading      = isLoading || isFetching;
  const hasResults   = navResults.length > 0 || verseResults.length > 0;
  const noResults    = enabled && !loading && !hasResults;

  const clearQuery = useCallback(() => { setQuery(""); setDebounced(""); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-[280px] p-6 lg:p-10">
        <div className="max-w-3xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black mb-2">Search the Quran</h1>
            <p className="text-slate-400 text-sm">
              Find any surah, verse, juz, or page by name, number, or keyword.
            </p>
          </div>

          {/* ── Search Bar ── */}
          <div className="relative mb-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-emerald-light pointer-events-none" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "Al-Baqarah", "mercy", "2:255" or Arabic…'
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-24 text-base focus:outline-none focus:ring-2 focus:ring-brand-emerald/40 focus:bg-white/8 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && (
                <button type="button" onClick={clearQuery}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="button" aria-label="Toggle filters" onClick={() => setShowFilters(f => !f)}
                className={cn("p-2 rounded-xl transition-colors",
                  showFilters ? "bg-brand-emerald/20 text-brand-emerald-light" : "hover:bg-white/10 text-slate-400")}>
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Mode + Filters Panel ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  {/* Mode toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Search Mode</p>
                      <p className="text-xs text-slate-500">Quick: instant nav + verses. Advanced: full-text with pagination.</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      {(["quick", "advanced"] as const).map((m) => (
                        <button key={m} type="button" onClick={() => setMode(m)}
                          className={cn("px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                            mode === m ? "bg-brand-emerald text-white" : "text-slate-400 hover:text-white")}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Translation */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Translation</p>
                      <p className="text-xs text-slate-500">Used for matching and display.</p>
                    </div>
                    <select aria-label="Translation" value={translationId} onChange={(e) => setTranslation(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none">
                      <option value="131">Saheeh International (EN)</option>
                      <option value="20">Pickthall (EN)</option>
                      <option value="85">Sahih International (EN Alt)</option>
                      <option value="203">Dr. Mustafa Khattab (EN)</option>
                    </select>
                  </div>

                  {/* Exact match (advanced only) */}
                  {mode === "advanced" && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">Exact Match Only</p>
                        <p className="text-xs text-slate-500">Return only exact phrase matches.</p>
                      </div>
                      <button type="button" onClick={() => setExactMatch(e => !e)}
                        className="text-brand-emerald-light transition-colors">
                        {exactMatch
                          ? <ToggleRight className="w-7 h-7" />
                          : <ToggleLeft className="w-7 h-7 text-slate-500" />}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Results ── */}
          <div className="space-y-8">

            {/* Loading skeletons */}
            {loading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            )}

            {!loading && hasResults && (
              <>
                {/* Navigation results */}
                {navResults.length > 0 && (
                  <section>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-3 ml-1">
                      Quick Navigation
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {navResults.map((nav, i) => {
                        const Icon = NAV_TYPE_ICON[nav.resultType] ?? Hash;
                        return (
                          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}>
                            <Link href={NAV_TYPE_HREF(nav)}
                              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/[0.07] hover:bg-white/9 hover:border-brand-emerald/30 transition-all group">
                              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-brand-emerald-light" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate group-hover:text-brand-emerald-light transition-colors"
                                  dangerouslySetInnerHTML={{ __html: nav.name }} />
                                <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">{nav.resultType}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-emerald-light group-hover:translate-x-0.5 transition-all shrink-0" />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Verse results */}
                {verseResults.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3 ml-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                        Verse Matches
                        {pagination?.total_records != null && (
                          <span className="ml-2 text-brand-emerald-light normal-case tracking-normal">
                            ({pagination.total_records.toLocaleString()} total)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {verseResults.map((verse, i) => {
                        const key  = verseKey(verse);
                        const text = verseText(verse);
                        const sid  = surahId(verse);
                        return (
                          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}>
                            <Link href={`/surah/${sid}`}
                              className="block p-5 rounded-2xl bg-white/4 border border-white/[0.07] hover:bg-white/8 hover:border-brand-emerald/25 transition-all group">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald-light uppercase tracking-wide">
                                  {key}
                                </span>
                                {verse.arabic && (
                                  <span className="arabic-text text-lg text-slate-400 group-hover:text-brand-gold transition-colors">
                                    {verse.arabic}
                                  </span>
                                )}
                              </div>
                              {text && (
                                <p className="text-sm text-slate-300 group-hover:text-white transition-colors leading-relaxed line-clamp-3
                                  [&_em]:text-brand-gold [&_em]:not-italic [&_em]:font-bold [&_em]:bg-brand-gold/10 [&_em]:px-0.5 [&_em]:rounded"
                                  dangerouslySetInnerHTML={{ __html: text }}
                                />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Pagination (advanced mode) */}
                    {pagination && pagination.total_pages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-3">
                        <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                          className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-sm font-bold transition-all">
                          Previous
                        </button>
                        <span className="text-sm text-slate-400 font-mono">
                          {page} / {pagination.total_pages}
                        </span>
                        <button type="button" disabled={page >= pagination.total_pages} onClick={() => setPage(p => p + 1)}
                          className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-sm font-bold transition-all">
                          Next
                        </button>
                      </div>
                    )}
                  </section>
                )}
              </>
            )}

            {/* No results */}
            {noResults && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/2">
                <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-bold mb-1">No results for &quot;{debouncedQuery}&quot;</p>
                <p className="text-xs text-slate-600">Try a different keyword, surah name, or verse key like 2:255</p>
              </motion.div>
            )}

            {/* Empty state (nothing typed yet) */}
            {!enabled && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { label: "Try searching", examples: ["Al-Fatiha", "الرحمن", "2:255"] },
                  { label: "By topic", examples: ["mercy", "paradise", "prayer"] },
                  { label: "By number", examples: ["Surah 36", "Juz 30", "Page 1"] },
                ].map((group) => (
                  <div key={group.label} className="p-5 rounded-2xl bg-white/3 border border-white/6">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 mb-3">{group.label}</p>
                    <div className="space-y-2">
                      {group.examples.map((ex) => (
                        <button key={ex} type="button" onClick={() => setQuery(ex)}
                          className="block w-full text-left text-sm text-slate-400 hover:text-brand-emerald-light transition-colors font-medium">
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
