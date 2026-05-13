"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserBookmarks, deleteUserBookmark,
} from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import {
  Heart, BookOpen, Hash, Trash2, ChevronRight, Layers,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";

type BookmarkType = "surah" | "ayah" | "juz" | "page";

interface Bookmark {
  id: string;
  key: number;
  type: BookmarkType;
  verseNumber?: number;
  mushafId?: number;
}

const TYPE_CONFIG: Record<BookmarkType, { label: string; icon: React.ElementType; color: string; bg: string; href: (b: Bookmark) => string }> = {
  surah: { label: "Surah",  icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", href: (b) => `/surah/${b.key}` },
  ayah:  { label: "Ayah",   icon: Hash,     color: "text-amber-400",   bg: "bg-amber-500/10",   href: (b) => `/surah/${b.key}#ayah-${b.verseNumber ?? 1}` },
  juz:   { label: "Juz",    icon: Layers,   color: "text-blue-400",    bg: "bg-blue-500/10",    href: (b) => `/reading?juz=${b.key}` },
  page:  { label: "Page",   icon: BookOpen, color: "text-purple-400",  bg: "bg-purple-500/10",  href: (b) => `/reading?page=${b.key}` },
};

const TABS: { key: BookmarkType | "all"; label: string }[] = [
  { key: "all",   label: "All"    },
  { key: "surah", label: "Surahs" },
  { key: "ayah",  label: "Ayahs"  },
  { key: "juz",   label: "Juz"    },
  { key: "page",  label: "Pages"  },
];

function bookmarkLabel(b: Bookmark): string {
  if (b.type === "surah") return `Surah ${b.key}`;
  if (b.type === "ayah")  return `${b.key}:${b.verseNumber ?? "?"}`;
  if (b.type === "juz")   return `Juz ${b.key}`;
  return `Page ${b.key}`;
}

export default function FavoritesPage() {
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchUserBookmarks({ mushafId: 4, first: 100 }),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserBookmark(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  // Normalize response shape
  const allBookmarks: Bookmark[] = (() => {
    const raw = data?.bookmarks ?? data?.data?.bookmarks ?? (Array.isArray(data?.data) ? data.data : null) ?? [];
    return raw.filter((b: Bookmark) => !b.mushafId || b.mushafId === 4);
  })();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <BottomNav />
        <main className="flex-1 lg:ml-64 p-10 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-black mb-3">Your Favorites</h2>
          <p className="text-slate-500 text-center max-w-md mb-10">
            Bookmark surahs, ayahs, juz, and pages to save them here for quick access.
          </p>
          <button type="button" onClick={login}
            className="px-10 py-4 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl">
            Sign in to view favorites
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-red-400 fill-red-400/30" />
          </div>
          <div>
            <h2 className="text-3xl font-black">My Favorites</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {allBookmarks.length} saved bookmark{allBookmarks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : allBookmarks.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/3">
            <Heart className="w-14 h-14 text-slate-700 mx-auto mb-5" />
            <p className="text-slate-400 font-bold text-lg mb-2">No favorites yet</p>
            <p className="text-slate-600 text-sm mb-8">
              Bookmark surahs and ayahs while reading — they'll appear here.
            </p>
            <Link href="/chapters"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-lg text-sm">
              <BookOpen className="w-4 h-4" /> Browse Chapters
            </Link>
          </div>
        ) : (
          <>
            {/* Group by type */}
            {(["surah", "ayah", "juz", "page"] as BookmarkType[]).map((type) => {
              const items = allBookmarks.filter((b) => b.type === type);
              if (items.length === 0) return null;
              const cfg = TYPE_CONFIG[type];
              const Icon = cfg.icon;
              return (
                <section key={type} className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", cfg.bg)}>
                      <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      {cfg.label}s · {items.length}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <AnimatePresence>
                      {items.map((bookmark, i) => (
                        <motion.div
                          key={bookmark.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.03 }}
                          layout
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/7 hover:bg-white/7 transition-all group"
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm", cfg.bg, cfg.color)}>
                            {bookmark.key}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{bookmarkLabel(bookmark)}</p>
                            <p className={cn("text-[10px] font-bold uppercase tracking-wide mt-0.5", cfg.color)}>
                              {cfg.label}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <Link href={cfg.href(bookmark)}
                              className="p-2 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              aria-label="Remove bookmark"
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteMutation.mutate(bookmark.id)}
                              className="p-2 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}
