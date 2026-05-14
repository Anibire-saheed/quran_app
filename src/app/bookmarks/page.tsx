"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserBookmarks } from "@/services/quranService";
import { Bookmark, BookOpen, Trash2, ExternalLink, Hash, MapPin } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Link from "next/link";

export default function BookmarksPage() {
  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ["userBookmarks"],
    queryFn: () => fetchUserBookmarks({ mushafId: 4 }), // Default to UthmaniHafs
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 lg:ml-[280px] p-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">My Bookmarks</h1>
          <p className="text-slate-400">Your personal reading markers and saved locations across the Quran.</p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks?.data?.length > 0 ? (
              bookmarks.data.map((bookmark: any) => (
                <div 
                  key={bookmark.id} 
                  className="group relative flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className={bookmark.isReading ? "text-emerald-500" : "text-slate-500 group-hover:text-white transition-colors"}>
                      <Bookmark className={`w-8 h-8 ${bookmark.isReading ? "fill-emerald-500" : ""}`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                          {bookmark.type} {bookmark.key}
                          {bookmark.verseNumber && <span className="text-emerald-500 ml-2">:{bookmark.verseNumber}</span>}
                        </h3>
                        {bookmark.isReading && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded-md border border-emerald-500/20">
                            Reading Now
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 uppercase tracking-widest font-medium">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Surah {bookmark.key}</span>
                        <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> Mushaf ID: {bookmark.mushafId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/surah/${bookmark.key}${bookmark.verseNumber ? `?verse=${bookmark.verseNumber}` : ''}`}
                      className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 transition-all border border-white/5"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all border border-white/5">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <Bookmark className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No bookmarks saved</h3>
                <p className="text-slate-600 max-w-sm mx-auto mt-2">
                  Use the bookmark icon while reading to save your spot or highlight meaningful verses.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
