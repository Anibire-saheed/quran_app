"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSurahs, fetchReadingSessions } from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { BookOpen, Search, ArrowRight, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export default function ReadingPage() {
  const [search, setSearch] = useState("");
  
  const { data: surahs, isLoading: isLoadingSurahs } = useQuery({
    queryKey: ["surahs"],
    queryFn: () => fetchSurahs(),
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["reading-sessions"],
    queryFn: () => fetchReadingSessions({ first: 1 }),
  });

  const lastSession = sessions?.edges?.[0]?.node;

  const filteredSurahs = surahs?.filter((s: any) => 
    s.name_simple.toLowerCase().includes(search.toLowerCase()) ||
    s.name_arabic.includes(search)
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-emerald-light" />
            Reading Room
          </h2>
          <p className="text-slate-400">Select a Surah to begin your immersive reading experience.</p>
        </div>

        {/* Continue Reading Card */}
        {lastSession ? (
          <div className="glass-effect rounded-3xl p-8 border-brand-emerald/20 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/5 blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest mb-4">
                  <Clock className="w-3 h-3" />
                  Continue Reading
                </div>
                <h3 className="text-3xl font-black mb-2">Surah {surahs?.find((s: any) => s.id === lastSession.chapterNumber)?.name_simple || "Loading..."}</h3>
                <p className="text-slate-400">Verse {lastSession.verseNumber} • Updated {new Date(lastSession.updatedAt).toLocaleDateString()}</p>
              </div>
              <Link href={`/surah/${lastSession.chapterNumber}?ayah=${lastSession.verseNumber}`} className="bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-gold hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                Resume Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass-effect rounded-3xl p-8 border-white/10 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Start your journey</h3>
              <p className="text-sm text-slate-400">Select a Surah below to begin tracking your progress.</p>
            </div>
            <div className="p-3 rounded-full bg-white/5">
              <Sparkles className="w-6 h-6 text-brand-gold animate-pulse" />
            </div>
          </div>
        )}

        <div className="relative w-full lg:w-96 mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search Surah..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {(isLoadingSurahs || isLoadingSessions) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs?.map((surah: any) => (
              <Link 
                key={surah.id}
                href={`/surah/${surah.id}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-emerald-light/30 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-slate-400 group-hover:text-brand-emerald-light transition-colors">
                    {surah.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{surah.name_simple}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{surah.verses_count} Ayahs</p>
                  </div>
                </div>
                <span className="arabic-text text-xl text-slate-300 group-hover:text-brand-gold transition-colors">{surah.name_arabic}</span>
              </Link>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
