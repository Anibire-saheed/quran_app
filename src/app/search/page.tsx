"use client";

import { useQuery } from "@tanstack/react-query";
import { searchQuran } from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { Search, Filter, X, ChevronRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface SearchNavResult {
  key: string | number;
  name: string;
  resultType: string;
}

interface SearchVerseResult {
  key: string;
  name: string;
  arabic?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchQuran({ mode: "quick", query: debouncedQuery }),
    enabled: debouncedQuery.length > 2,
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black mb-4">Search the Quran</h2>
            <p className="text-slate-400">
              Find any Surah, Ayah, or topic instantly.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-12">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <Search className="w-6 h-6 text-brand-emerald-light" />
              <div className="w-px h-6 bg-white/10"></div>
            </div>
            <input
              type="text"
              placeholder="Search by name, number, or keyword..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-20 pr-16 text-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 focus:bg-white/10 transition-all shadow-2xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Results Area */}
          <div className="space-y-10">
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl bg-white/5 animate-pulse"
                  ></div>
                ))}
              </div>
            )}

            {!isLoading && results?.result && (
              <>
                {/* Navigational Results (Surahs, Juz, Pages) */}
                {results.result.navigation?.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">
                      Quick Navigation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.result.navigation.map(
                        (nav: SearchNavResult, idx: number) => (
                          <Link
                            key={idx}
                            href={
                              nav.resultType === "surah"
                                ? `/surah/${nav.key}`
                                : `/reading?${nav.resultType}=${nav.key}`
                            }
                            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-emerald/30 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald-light font-bold">
                                {nav.key}
                              </div>
                              <div>
                                <p className="font-bold text-white group-hover:text-brand-emerald-light transition-colors">
                                  {nav.name}
                                </p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">
                                  {nav.resultType}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-brand-emerald-light group-hover:translate-x-1 transition-all" />
                          </Link>
                        ),
                      )}
                    </div>
                  </section>
                )}

                {/* Verse Results */}
                {results.result.verses?.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">
                      Verse Matches
                    </h3>
                    <div className="space-y-4">
                      {results.result.verses.map(
                        (verse: SearchVerseResult, idx: number) => (
                          <Link
                            key={idx}
                            href={`/surah/${verse.key.split(":")[0]}?ayah=${verse.key.split(":")[1]}`}
                            className="block p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-emerald/30 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald-light">
                                Verse {verse.key}
                              </span>
                              {verse.arabic && (
                                <span className="arabic-text text-xl text-slate-400 group-hover:text-brand-gold transition-colors">
                                  {verse.arabic}
                                </span>
                              )}
                            </div>
                            <p
                              className="text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: verse.name }}
                            />
                          </Link>
                        ),
                      )}
                    </div>
                  </section>
                )}
              </>
            )}

            {debouncedQuery.length > 2 &&
              !isLoading &&
              !results?.result?.navigation?.length &&
              !results?.result?.verses?.length && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-slate-400 mb-2">
                    No results found for &quot;{debouncedQuery}&quot;
                  </p>
                  <p className="text-xs text-slate-500">
                    Try searching for a Surah name, verse key, or keyword.
                  </p>
                </div>
              )}
          </div>
        </div>
      </main>

    </div>
  );
}
