"use client";

import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, ListMusic, X } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAudioByChapter } from "@/services/quranService";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioPlayer() {
  const { isPlaying, currentSurah, setIsPlaying, volume, setVolume, isRepeat, toggleRepeat, isShuffle, toggleShuffle, currentReciter, currentAyah, setCurrentAyah } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { data: audioFile } = useQuery({
    queryKey: ["audio", currentReciter, currentSurah?.id],
    queryFn: () => fetchAudioByChapter(currentReciter, currentSurah?.id, true),
    enabled: !!currentSurah && !!currentReciter,
  });

  const audioSrc = audioFile?.audio_url
    ? (audioFile.audio_url.startsWith("http") ? audioFile.audio_url : `https://download.quranicaudio.com/${audioFile.audio_url}`)
    : null;

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioSrc) {
      audioRef.current.play().catch((err) => console.error("Playback error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSurah, audioSrc]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const currentTimeMs = audioRef.current.currentTime * 1000;
    if (!isDragging) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
    if (audioFile?.segments) {
      const { currentWord: storeWord, setCurrentWord } = useAudioStore.getState();
      
      const currentSegment = audioFile.segments.find((seg: any) => {
        const start = seg.length === 4 ? seg[2] : seg[1];
        const end = seg.length === 4 ? seg[3] : seg[2];
        return currentTimeMs >= start && currentTimeMs <= end;
      });

      if (currentSegment) {
        const verseNumber = currentSegment[0];
        const wordNumber = currentSegment.length === 4 ? currentSegment[1] : null;

        if (verseNumber !== currentAyah) {
          setCurrentAyah(verseNumber);
        }
        if (wordNumber !== storeWord) {
          setCurrentWord(wordNumber);
        }
      }
    }
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    } else {
      setIsPlaying(false);
      setCurrentAyah(null);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * audioRef.current.duration;
    setProgress(pct * 100);
  };

  return (
    <AnimatePresence>
      {currentSurah && (
        <motion.div
          key="audio-player"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-16 lg:bottom-0 left-0 lg:left-64 right-0 z-40"
        >
          {/* Waveform glow when playing */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-t from-brand-emerald/10 to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="glass-effect border-t border-black/5 dark:border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
            <audio
              ref={audioRef}
              src={audioSrc || undefined}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
            />

            {/* Surah Info */}
            <div className="flex items-center gap-3 w-1/3 min-w-0">
              <div className="relative w-11 h-11 rounded-xl islamic-gradient flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <span className="relative z-10 text-sm">{currentSurah.id}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{currentSurah.name_simple}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate capitalize">{currentSurah.revelation_place}</p>
              </div>
              <button
                type="button"
                title="Close player"
                onClick={() => setIsPlaying(false)}
                className="ml-auto p-1 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-xl px-4">
              <div className="flex items-center gap-4 lg:gap-6">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleShuffle}
                  className={cn("transition-colors", isShuffle ? "text-brand-gold" : "text-slate-400 hover:text-white")}
                >
                  <Shuffle className="w-4 h-4" />
                </motion.button>

                <motion.button whileTap={{ scale: 0.85 }} className="text-slate-400 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5 fill-current" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={!audioSrc}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all",
                    audioSrc
                      ? "bg-white text-black hover:scale-110 hover:shadow-white/20"
                      : "bg-white/10 text-white/20 cursor-not-allowed"
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isPlaying ? "pause" : "play"}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <motion.button whileTap={{ scale: 0.85 }} className="text-slate-400 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5 fill-current" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleRepeat}
                  className={cn("transition-colors", isRepeat ? "text-brand-gold" : "text-slate-400 hover:text-white")}
                >
                  <Repeat className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Progress bar */}
              <div className="w-full flex items-center gap-3">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono w-8 text-right tabular-nums">
                  {formatTime(audioRef.current?.currentTime || 0)}
                </span>
                <div
                  className="flex-1 h-1.5 bg-white/10 rounded-full overflow-visible group cursor-pointer relative"
                  onClick={handleSeek}
                >
                  <div
                    className="progress-fill absolute inset-y-0 left-0 bg-brand-emerald-light rounded-full transition-[width] duration-100 flex items-center justify-end"
                    style={{ "--fill": `${progress}%` } as React.CSSProperties}
                  >
                    <motion.div
                      className="w-3 h-3 bg-white rounded-full shadow-lg shadow-black/40 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2 shrink-0"
                      whileHover={{ scale: 1.3 }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono w-8 tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="hidden lg:flex items-center gap-4 w-1/3 justify-end">
              <ListMusic className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <div className="flex items-center gap-2 group">
                <Volume2 className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-emerald-light"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
