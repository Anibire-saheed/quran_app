"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { BookIcon } from "@/components/ui/BookIcon";
import { Play, Pause, BookOpen, Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { addUserBookmark } from "@/services/api/bookmarks";
import { motion } from "framer-motion";

interface SurahCardProps {
  surah: any;
  index?: number;
}

export default function SurahCard({ surah, index = 0 }: SurahCardProps) {
  const { setCurrentSurah, setIsPlaying, currentSurah, isPlaying } = useAudioStore();
  const { isAuthenticated, login } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isCurrentlyPlaying = currentSurah?.id === surah.id && isPlaying;
  const isCurrent = currentSurah?.id === surah.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrent) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSurah(surah);
      setIsPlaying(true);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { login(); return; }
    if (isLiking) return;
    try {
      setIsLiking(true);
      setIsFavorited(!isFavorited);
      if (!isFavorited) {
        await addUserBookmark({ key: surah.id, type: "surah", mushafId: 1 });
      }
    } catch {
      setIsFavorited(isFavorited);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative glass-effect rounded-[32px] p-6 border border-black/5 dark:border-white/5 hover:border-brand-emerald-light/25 transition-colors duration-300 overflow-hidden"
    >
      {/* Background Icon */}
      <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-105 transition-all duration-700 pointer-events-none">
        <img src="/images/surah-card-bg-2.png" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-brand-emerald/10 blur-2xl rounded-full" />
      </div>

      {/* Active top bar */}
      {isCurrent && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-brand-emerald/0 via-brand-emerald-light to-brand-emerald/0"
        />
      )}

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={cn(
          "relative w-12 h-12 flex items-center justify-center shrink-0 transition-all duration-500",
          isCurrent ? "scale-110" : "group-hover:scale-110"
        )}>
          {/* Book Icon Frame */}
          <BookIcon 
            isActive={isCurrent}
            className="absolute inset-0 transition-transform duration-500"
          />
          
          <span className={cn(
            "relative z-10 font-black text-lg transition-colors",
            isCurrent ? "text-brand-gold" : "text-slate-500 dark:text-slate-400 group-hover:text-brand-emerald-light"
          )}>
            {isCurrent && isCurrentlyPlaying ? <EqualizerBars /> : surah.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleFavorite}
            disabled={isLiking}
            whileTap={{ scale: 0.82 }}
            className={cn(
              "p-2 rounded-full transition-colors",
              isFavorited ? "text-red-500 bg-red-500/10" : "hover:bg-white/5 text-slate-400 hover:text-red-400"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
          </motion.button>

          <motion.button
            onClick={handlePlay}
            whileTap={{ scale: 0.82 }}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              isCurrent
                ? "bg-brand-emerald text-white opacity-100 shadow-lg shadow-emerald-900/30"
                : "bg-brand-emerald/10 text-brand-emerald-light opacity-0 group-hover:opacity-100 hover:bg-brand-emerald hover:text-white"
            )}
          >
            {isCurrentlyPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </motion.button>
        </div>
      </div>

      <Link href={`/surah/${surah.id}`} className="block relative z-10">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold group-hover:text-brand-emerald-light transition-colors duration-200">
              {surah.name_simple}
            </h3>
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">{surah.translated_name?.name}</p>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {surah.verses_count} Ayahs
              </span>
              <span>•</span>
              <span className="capitalize">{surah.revelation_place}</span>
            </div>
          </div>
          <span className="arabic-text text-2xl text-slate-400 dark:text-slate-300 group-hover:text-brand-gold transition-colors duration-200">
            {surah.name_arabic}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function EqualizerBars() {
  return (
    <div className="flex items-end gap-[2px] h-5 w-5 justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-white"
          animate={{ height: ["30%", "100%", "55%", "85%", "30%"] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
