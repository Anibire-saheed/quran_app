"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Target, Headphones, Users, Flame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const FEATURES = [
  { icon: BookOpen, label: "Read the Quran" },
  { icon: Headphones, label: "Listen to Reciters" },
  { icon: Target, label: "Set Daily Goals" },
  { icon: Users, label: "Join Reading Rooms" },
];

const ARABIC_VERSES = [
  "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
];

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [verseIndex, setVerseIndex] = useState(0);
  const [phase, setPhase] = useState<"greeting" | "features" | "ready">("greeting");

  const firstName = user?.name?.split(" ")[0];

  // Rotate Arabic verse
  useEffect(() => {
    const t = setInterval(() => {
      setVerseIndex((i) => (i + 1) % ARABIC_VERSES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance through phases
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("features"), 2200);
    const t2 = setTimeout(() => {
      setPhase("ready");
      // Automatic redirect after a brief delay once ready
      setTimeout(() => router.push("/dashboard"), 1500);
    }, 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-600/8 rounded-full blur-[140px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[120px] animate-float-reverse" />
      </div>

      {/* Rotating rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="w-[700px] h-[700px] border border-white/[0.03] rounded-full absolute"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="w-[500px] h-[500px] border border-amber-400/[0.04] rounded-full absolute"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[300px] h-[300px] border border-emerald-500/[0.05] rounded-full absolute"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl w-full">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-24 h-24 mb-10 flex items-center justify-center"
        >
          <img src="/logo.svg" alt="Kashaf Logo" className="w-full h-full object-contain" />
        </motion.div>

        {/* Arabic verse rotating */}
        <div className="h-14 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={verseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
              className="arabic-text text-3xl text-amber-300/80 font-medium"
            >
              {ARABIC_VERSES[verseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Main greeting */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h1 className="text-5xl lg:text-7xl font-black mb-4 leading-tight">
            As-salamu Alaykum, <br />
            {firstName && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-[length:200%_auto] animate-gradient">
                {firstName}.
              </span>
            )}
          </h1>
          <p className="text-white/40 text-lg font-medium mb-12">
            Your spiritual journey continues here.
          </p>
        </motion.div>

        {/* Feature chips — appear in phase 2 */}
        <AnimatePresence>
          {(phase === "features" || phase === "ready") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/70 backdrop-blur-md"
                >
                  <Icon className="w-4 h-4 text-brand-emerald-light" />
                  {label}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak motivator if available */}
        <WelcomeStreak />

        {/* Auto-redirecting message */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-amber-400 font-bold tracking-widest text-sm flex items-center justify-center gap-3"
            >
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              TAKING YOU TO DASHBOARD...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 mt-16"
        >
          {(["greeting", "features", "ready"] as const).map((p) => (
            <motion.div
              key={p}
              animate={{
                width: phase === p ? 24 : 6,
                backgroundColor: phase === p ? "#fbbf24" : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.4 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function WelcomeStreak() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    // Read streak from sessionStorage if previously cached, avoid blocking load
    try {
      const cached = sessionStorage.getItem("qf_streak");
      if (cached) setStreak(Number(cached));
    } catch { /* ignore */ }
  }, []);

  if (!streak || streak < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-8"
    >
      <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
      <span className="font-bold text-orange-300">
        {streak}-day streak — keep it going!
      </span>
    </motion.div>
  );
}
