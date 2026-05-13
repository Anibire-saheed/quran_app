"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSurahs } from "@/services/quranService";
import Link from "next/link";
import { Book, Info, ChevronRight, Hash } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function ChaptersPage() {
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => fetchSurahs(),
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Holy Quran Chapters</h1>
          <p className="text-slate-400">Browse and read all 114 Surahs of the Noble Quran.</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {chapters?.map((chapter: any) => (
              <Link
                key={chapter.id}
                href={`/surah/${chapter.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 islamic-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-900/20">
                      {chapter.id}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
