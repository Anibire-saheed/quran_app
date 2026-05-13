"use client";

import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { Heart, Sparkles } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8 animate-bounce">
          <Heart className="w-12 h-12 fill-current" />
        </div>
        
        <h2 className="text-4xl font-black mb-4">Your Favorites</h2>
        <p className="text-slate-400 text-center max-w-md mb-10">
          Save your most-loved Surahs and Ayahs here to access them quickly. Sign in to sync across devices.
        </p>
        
        <button className="flex items-center gap-2 px-8 py-4 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
          <Sparkles className="w-5 h-5" />
          Sign in to get started
        </button>
      </main>

    </div>
  );
}
