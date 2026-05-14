"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "@/services/quranService";
import { FolderOpen, Plus, MoreVertical, Heart, BookOpen, Clock } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

import { useAuth } from "@/hooks/useAuth";

export default function CollectionsPage() {
  const { isAuthenticated, login } = useAuth();

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 lg:ml-[280px] p-10 flex flex-col items-center justify-center">
          <FolderOpen className="w-20 h-20 text-slate-800 mb-8" />
          <h2 className="text-3xl font-black mb-4">Your Library</h2>
          <p className="text-slate-500 text-center max-w-md mb-10">
            Create custom collections to organize your favorite ayahs and surahs.
          </p>
          <button onClick={login} className="px-10 py-4 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl">
            Sign in to view Collections
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 lg:ml-[280px] p-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Collections</h1>
            <p className="text-slate-400">Organize your favorite verses and surahs into custom folders.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
            <Plus className="w-5 h-5" />
            New Collection
          </button>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Default Favorites Collection */}
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 hover:bg-emerald-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Heart className="w-8 h-8 fill-emerald-500" />
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Favorites</h3>
              <p className="text-emerald-500/60 text-sm mb-4">Default Collection</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> 24 Items</span>
              </div>
            </div>

            {/* Custom Collections */}
            {collections?.data?.map((collection: any) => (
              <div key={collection.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  {collection.name}
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  Updated {new Date(collection.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {collection.bookmarksCount || 0} Items</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Private</span>
                </div>
              </div>
            ))}

            {/* Empty State / Add New Placeholder */}
            {collections?.data?.length === 0 && (
              <div className="xl:col-span-3 py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No custom collections yet</h3>
                <p className="text-slate-600 max-w-sm mx-auto mt-2">
                  Create your first collection to start organizing your Quranic journey.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
