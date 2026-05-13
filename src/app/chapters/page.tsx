"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSurahs, fetchJuzs } from "@/services/quranService";
import { useState } from "react";
import Link from "next/link";
import { Book, Info, ChevronRight, Hash } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { BookIcon } from "@/components/ui/BookIcon";
import { cn } from "@/utils/cn";

export default function ChaptersPage() {
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  
  const { data: chapters, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => fetchSurahs(),
    enabled: viewMode === 'surah',
  });

  const { data: juzs, isLoading: isJuzsLoading } = useQuery({
    queryKey: ["juzs"],
    queryFn: () => fetchJuzs(),
    enabled: viewMode === 'juz',
  });

  const isLoading = viewMode === 'surah' ? isChaptersLoading : isJuzsLoading;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Holy Quran</h1>
            <p className="text-slate-400">
              {viewMode === 'surah' ? "Browse and read all 114 Surahs of the Noble Quran." : "Explore the Quran through its 30 Juz divisions."}
            </p>
          </div>

          {/* Design Button for Juz / Surah Toggle */}
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 w-fit">
            <button
              onClick={() => setViewMode('surah')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300",
                viewMode === 'surah' 
                  ? "bg-white dark:bg-white/10 text-brand-emerald-light dark:text-brand-gold shadow-lg shadow-black/5" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              )}
            >
              Surah
            </button>
            <button
              onClick={() => setViewMode('juz')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300",
                viewMode === 'juz' 
                  ? "bg-white dark:bg-white/10 text-brand-emerald-light dark:text-brand-gold shadow-lg shadow-black/5" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              )}
            >
              Juz
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {viewMode === 'surah' ? (
              chapters?.map((chapter: any) => (
                <Link
                  key={chapter.id}
                  href={`/surah/${chapter.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <BookIcon className="absolute inset-0 transition-transform duration-500" />
                        <span className="relative z-10 font-black text-brand-emerald-light dark:text-brand-gold text-lg">
                          {chapter.id}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                          {chapter.name_simple}
                        </h3>
                        <p className="text-sm text-slate-400">{chapter.translated_name.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-arabic text-emerald-500 drop-shadow-sm">
                        {chapter.name_arabic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1">
                      <Book className="w-3 h-3" />
                      {chapter.verses_count} Verses
                    </span>
                    <span className="flex items-center gap-1 uppercase tracking-wider">
                      <Hash className="w-3 h-3" />
                      {chapter.revelation_place}
                    </span>
                  </div>
                  
                  <ChevronRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))
            ) : (
              juzs?.map((juz: any) => (
                <Link
                  key={juz.id}
                  href={`/reading?juz=${juz.juz_number}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <BookIcon className="absolute inset-0 transition-transform duration-500" />
                        <span className="relative z-10 font-black text-brand-emerald-light dark:text-brand-gold text-lg">
                          {juz.juz_number}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                          Juz {juz.juz_number}
                        </h3>
                        <p className="text-sm text-slate-400">Boundary Section</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 border-t border-white/5 pt-4">
                    {Object.entries(juz.verse_mapping).map(([chapId, range]) => (
                      <div key={chapId} className="flex items-center justify-between">
                        <span className="font-bold">Chapter {chapId}</span>
                        <span className="text-slate-600 font-mono">{range as string}</span>
                      </div>
                    ))}
                  </div>
                  
                  <ChevronRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
