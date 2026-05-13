"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchChapterReciters } from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { Music, Play, Search, Info } from "lucide-react";
import { useState } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { BookIcon } from "@/components/ui/BookIcon";
import { cn } from "@/utils/cn";

export default function RecitersPage() {
  const [search, setSearch] = useState("");
  const { currentReciter, setCurrentReciter, currentSurah, setCurrentSurah, setIsPlaying } = useAudioStore();
  
  const { data: reciters, isLoading } = useQuery({
    queryKey: ["chapter-reciters"],
    queryFn: () => fetchChapterReciters(),
  });

  const handleReciterSelect = (reciter: any) => {
    setCurrentReciter(String(reciter.id));
    if (!currentSurah) {
      setCurrentSurah({ id: 1, name_simple: "Al-Fatiha", revelation_place: "makkah" });
    }
    setIsPlaying(true);
  };

  const filteredReciters = reciters?.filter((r: any) => {
    const name = r.name || r.translated_name?.name || "";
    const styleName = r.style?.name || "";
    return name.toLowerCase().includes(search.toLowerCase()) ||
           styleName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Music className="w-8 h-8 text-brand-gold" />
            Reciters
          </h2>
          <p className="text-slate-400">Choose from world-renowned reciters to enhance your listening experience.</p>
        </div>

        <div className="relative w-full lg:w-96 mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search reciters..." 
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold/50 text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReciters?.map((reciter: any) => {
              const isActive = String(currentReciter) === String(reciter.id);
              const name = reciter.translated_name?.name || reciter.name || "Unknown Reciter";
              const styleName = reciter.style?.name || "Murattal";
              
              return (
                <button 
                  key={reciter.id}
                  onClick={() => handleReciterSelect(reciter)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left group",
                    isActive 
                      ? "bg-brand-emerald/10 border-brand-emerald-light shadow-lg shadow-emerald-900/20" 
                      : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "relative w-12 h-12 flex items-center justify-center shrink-0 transition-all duration-500",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}>
                      <BookIcon 
                        isActive={isActive}
                        className="absolute inset-0 transition-transform duration-500"
                      />
                      <span className={cn(
                        "relative z-10 font-black text-lg transition-colors",
                        isActive ? "text-brand-gold" : "text-slate-500 dark:text-slate-400 group-hover:text-brand-emerald-light"
                      )}>
                        {name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-0.5">{styleName}</p>
                    </div>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}
