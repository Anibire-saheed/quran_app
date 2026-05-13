"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  MapPin, Sparkles, ArrowRight, Play, BookOpen, Heart, Globe,
  Shield, Zap, Users, Star, ChevronDown, Moon, Menu, X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  motion, useScroll, useTransform, useInView, animate,
  AnimatePresence, type Variants,
} from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface PrayerTimes {
  Fajr: string; Sunrise: string; Dhuhr: string;
  Asr: string; Maghrib: string; Isha: string;
}

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, to]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  { icon: Play, title: "Premium Audio", desc: "Crystal-clear recordings from world-renowned reciters with gapless playback across all 114 Surahs.", color: "from-blue-600 to-blue-400", glow: "shadow-blue-500/20" },
  { icon: BookOpen, title: "Crystal Reading", desc: "Beautifully typeset Arabic script with instant translations and tafsir from leading scholars.", color: "from-emerald-600 to-emerald-400", glow: "shadow-emerald-500/20" },
  { icon: Zap, title: "Instant Search", desc: "Find any verse, keyword, or Surah in milliseconds with intelligent full-text search.", color: "from-amber-500 to-yellow-400", glow: "shadow-amber-500/20" },
  { icon: Heart, title: "Personal Library", desc: "Save favourites, set bookmarks, and sync your progress seamlessly across every device.", color: "from-rose-600 to-pink-400", glow: "shadow-rose-500/20" },
  { icon: Globe, title: "50+ Translations", desc: "Deeply understand the message with translations in over fifty languages by esteemed scholars.", color: "from-indigo-600 to-violet-400", glow: "shadow-indigo-500/20" },
  { icon: Shield, title: "Privacy First", desc: "No ads. No tracking. Just you and the words of Allah, completely secure and distraction-free.", color: "from-slate-600 to-slate-400", glow: "shadow-slate-500/20" },
];

const STATS = [
  { value: 114, suffix: "", label: "Surahs" },
  { value: 6236, suffix: "", label: "Verses" },
  { value: 50, suffix: "+", label: "Translations" },
  { value: 100, suffix: "+", label: "Reciters" },
];

const VERSE = {
  arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
  translation: "All praise is due to Allah, Lord of all the worlds.",
  ref: "Al-Fatiha 1:2",
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage() {
  const { login, isAuthenticated } = useAuth();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [city] = useState("Lagos");
  const [hijriDate, setHijriDate] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Nigeria&method=2`)
      .then((r) => r.json())
      .then((d) => {
        setPrayerTimes(d.data.timings);
        const h = d.data.date.hijri;
        setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
      })
      .catch(() => {});
  }, [city]);

  return (
    <div className="bg-[#020617] text-white selection:bg-amber-400 selection:text-black overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 lg:px-16 backdrop-blur-xl bg-black/30 border-b border-white/5"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-10 h-10 islamic-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40"
          >
            <span className="text-xl font-black italic">Q</span>
          </motion.div>
          <span className="text-lg font-black tracking-tight">Quran Majeed</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#community" className="hover:text-white transition-colors">Community</Link>
          <Link href="#prayer" className="hover:text-white transition-colors">Prayer Times</Link>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/chapters" className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-amber-400 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <button type="button" onClick={login} className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
                Sign In
              </button>
              <button type="button" onClick={login}
                className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-amber-400 transition-colors">
                Get Started
              </button>
            </>
          )}
        </div>

        <button type="button" aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 inset-x-0 z-40 glass-effect border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden">
            <Link href="#features" onClick={() => setMenuOpen(false)} className="font-semibold hover:text-amber-400 transition-colors">Features</Link>
            <Link href="#prayer" onClick={() => setMenuOpen(false)} className="font-semibold hover:text-amber-400 transition-colors">Prayer Times</Link>
            {isAuthenticated ? (
              <Link href="/chapters" onClick={() => setMenuOpen(false)}
                className="px-6 py-3 rounded-2xl islamic-gradient text-white font-bold text-sm w-fit text-center">
                Go to Dashboard
              </Link>
            ) : (
              <button type="button" onClick={() => { login(); setMenuOpen(false); }}
                className="px-6 py-3 rounded-2xl islamic-gradient text-white font-bold text-sm w-fit">
                Get Started
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Parallax mosque background */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-[url('/mosque-bg.png')]"
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-[#020617]" />
        </motion.div>

        {/* Animated glow orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-emerald-600/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-100 h-100 bg-amber-500/8 rounded-full blur-[100px] animate-float-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-brand-emerald/5 rounded-full blur-[160px]" />
        </div>

        {/* Rotating geometric ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-200 h-200 border border-white/3 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute w-150 h-150 border border-amber-400/4 rounded-full"
          />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-6xl">
          {/* Bismillah */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <p className="arabic-text text-3xl lg:text-5xl text-amber-300/90 font-medium tracking-wide drop-shadow-2xl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8 backdrop-blur-md"
          >
            <Star className="w-3 h-3 fill-current" />
            Redefining Spiritual Connection
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="text-6xl lg:text-[110px] font-black mb-6 leading-[0.85] tracking-tighter"
          >
            Come Close<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-400 bg-size-[200%_auto] animate-gradient">
              to Allah.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg lg:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Experience the Noble Quran with premium audio, beautiful typography,
            and tools crafted for the modern Muslim.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <Link href="/chapters"
                className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-amber-400 transition-all hover:scale-105 shadow-2xl active:scale-95">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            ) : (
              <button type="button" onClick={login}
                className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-amber-400 transition-all hover:scale-105 shadow-2xl active:scale-95">
                Start Reading Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-10"
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── PRAYER TIMES ─── */}
      <section id="prayer" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-effect rounded-3xl overflow-hidden border-white/5 shadow-2xl"
        >
          <div className="bg-white/5 p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-white/5">
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Location</p>
                <div className="flex items-center gap-2 text-base font-bold">
                  <MapPin className="w-4 h-4 text-amber-400" /> {city}, Nigeria
                </div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden lg:block" />
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Current Time</p>
                <div className="text-3xl font-black tabular-nums font-mono">
                  {currentTime ? currentTime.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
                </div>
              </div>
              {hijriDate && (
                <>
                  <div className="w-px h-10 bg-white/10 hidden lg:block" />
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Hijri Date</p>
                    <div className="flex items-center gap-2 font-bold">
                      <Moon className="w-4 h-4 text-amber-400" /> {hijriDate}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Live Times</span>
            </div>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 divide-x divide-white/5">
            {prayerTimes
              ? Object.entries(prayerTimes)
                  .filter(([k]) => ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(k))
                  .map(([name, time]) => (
                    <motion.div key={name}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      className="p-6 lg:p-8 flex flex-col items-center cursor-default transition-colors">
                      <span className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">{name}</span>
                      <span className="text-xl font-black tabular-nums">{time}</span>
                    </motion.div>
                  ))
              : Array(6).fill(null).map((_, i) => (
                  <div key={i} className="p-8 flex flex-col items-center gap-2">
                    <div className="h-3 w-10 bg-white/10 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
                  </div>
                ))}
          </div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {STATS.map(({ value, suffix, label }) => (
            <motion.div key={label} variants={fadeUp}>
              <p className="text-5xl lg:text-6xl font-black text-amber-400 mb-1">
                <AnimatedCounter to={value} suffix={suffix} />
              </p>
              <p className="text-white/40 font-semibold text-sm uppercase tracking-widest">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-32 px-6 lg:px-16 max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-20"
        >
          <motion.p variants={fadeUp} className="text-amber-400 text-xs font-black tracking-[0.4em] uppercase mb-4">Everything You Need</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-7xl font-black mb-6">
            Built for the <span className="text-transparent bg-clip-text islamic-gradient">Modern Soul</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 max-w-2xl mx-auto text-lg">
            Every detail crafted for a distraction-free, immersive spiritual experience.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-effect rounded-3xl p-8 border-white/5 hover:border-white/10 group cursor-default"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300",
                f.color, f.glow
              )}>
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3">{f.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── VERSE SECTION ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-950/40 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-150 h-150 bg-emerald-600/5 rounded-full blur-[120px]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <p className="text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase mb-10">Verse of the Day</p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="arabic-text text-4xl lg:text-6xl text-white/90 leading-loose mb-10 font-medium"
          >
            {VERSE.arabic}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-px w-32 bg-amber-400/30 mx-auto mb-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl lg:text-2xl text-white/60 italic mb-4 font-medium"
          >
            &ldquo;{VERSE.translation}&rdquo;
          </motion.p>
          <p className="text-white/30 text-sm font-semibold tracking-wider">{VERSE.ref}</p>
        </motion.div>
      </section>

      {/* ─── AUDIO SECTION ─── */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto glass-effect rounded-[48px] p-10 lg:p-20 border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-950/30 to-transparent" />
          <div className="absolute top-0 right-0 w-100 h-100 bg-emerald-600/8 blur-[120px]" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <p className="text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-6">Immersive Audio</p>
              <h3 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                Listen to the<br />
                <span className="text-emerald-400">Divine Melody.</span>
              </h3>
              <p className="text-white/50 text-lg mb-10 leading-relaxed">
                Our persistent audio player follows you as you browse — never missing a beat.
              </p>
              <div className="space-y-4">
                {["Gapless Surah transitions", "128 kbps crystal-clear audio", "Choose from 100+ Reciters"].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Zap className="w-3 h-3 text-emerald-400 fill-current" />
                    </div>
                    <span className="font-semibold text-white/80">{item}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={login}
                className="inline-flex items-center gap-2 mt-10 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors group">
                Browse Reciters <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <motion.div
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full max-w-sm"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-3xl p-8 border-emerald-500/20 shadow-2xl shadow-emerald-900/30 relative z-10"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 islamic-gradient rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">18</div>
                  <div>
                    <h4 className="text-xl font-black">Al-Kahf</h4>
                    <p className="text-emerald-400 font-semibold text-sm">Mishary Rashid Alafasy</p>
                  </div>
                </div>
                {/* Waveform bars */}
                <div className="flex items-center gap-1 mb-6 h-10">
                  {Array(24).fill(null).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [0.3, 1, 0.4, 0.8, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                      className={cn(
                        "flex-1 rounded-full origin-bottom",
                        i < 8 ? "bg-emerald-400" : "bg-white/20"
                      )}
                      style={{ height: "100%" }}
                    />
                  ))}
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                  <motion.div
                    animate={{ width: ["30%", "34%", "30%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/30 font-mono">
                  <span>3:24</span><span>11:45</span>
                </div>
                <div className="flex items-center justify-center gap-8 mt-6">
                  {[false, true, false].map((active, i) => (
                    <motion.button key={i} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}
                      type="button" aria-label="Playback control"
                      className={cn("rounded-full transition-colors",
                        active ? "w-14 h-14 bg-white flex items-center justify-center text-black"
                               : "w-10 h-10 flex items-center justify-center text-white/40 hover:text-white")}>
                      <Play className={cn("fill-current", active ? "w-6 h-6 ml-1" : "w-5 h-5")} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-600/10 blur-[80px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY ─── */}
      <section id="community" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase mb-6">Community</p>
            <h3 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
              Connect with<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-200">Muslims Worldwide.</span>
            </h3>
            <p className="text-white/50 text-lg mb-10 leading-relaxed">
              Join reading rooms, share reflections, set goals together, and grow spiritually as a community.
            </p>
            <div className="flex flex-wrap gap-4">
              <button type="button" onClick={login}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-amber-400 text-black font-black hover:bg-amber-300 transition-colors">
                <Users className="w-5 h-5" /> Join a Room
              </button>
              <button type="button" onClick={login}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">
                <Sparkles className="w-5 h-5" /> Explore Reflections
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Users, label: "Active Rooms", value: "50+", color: "text-amber-400" },
              { icon: BookOpen, label: "Reflections Shared", value: "10K+", color: "text-emerald-400" },
              { icon: Star, label: "Daily Goals Met", value: "95%", color: "text-blue-400" },
              { icon: Heart, label: "Happy Readers", value: "25K+", color: "text-rose-400" },
            ].map((item) => (
              <motion.div key={item.label}
                whileHover={{ scale: 1.04, y: -4 }}
                className="glass-effect rounded-2xl p-6 border-white/5 text-center cursor-default">
                <item.icon className={cn("w-7 h-7 mx-auto mb-3", item.color)} />
                <p className="text-3xl font-black mb-1">{item.value}</p>
                <p className="text-white/40 text-xs font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-16 px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto islamic-gradient rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/40"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <p className="text-white/60 font-black text-xs tracking-[0.4em] uppercase mb-4">Start Your Journey</p>
            <h3 className="text-4xl lg:text-6xl font-black text-white mb-6">Begin Reading Today.</h3>
            <p className="text-white/60 text-lg mb-10 max-w-md mx-auto">
              Join thousands of Muslims who have made the Quran a daily companion.
            </p>
            <button type="button" onClick={login}
              className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-amber-400 transition-all hover:scale-105 shadow-2xl active:scale-95 group">
              Get Started Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 pt-20 pb-10 px-6 lg:px-16 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 islamic-gradient rounded-xl flex items-center justify-center">
                  <span className="text-xl font-black italic">Q</span>
                </div>
                <h2 className="text-lg font-black uppercase">Quran Majeed</h2>
              </div>
              <p className="text-white/30 leading-relaxed text-sm mb-6">
                Bringing the light of the Quran to your digital world with excellence and beauty.
              </p>
              <div className="flex gap-3">
                {[1,2,3,4].map((i) => (
                  <motion.div key={i} whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 cursor-pointer transition-colors" />
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-6 text-white/60">Platform</h5>
              <ul className="space-y-3 text-white/30 text-sm">
                {["Chapters", "Audio Reciters", "Reading Mode", "Bookmarks"].map((l) => (
                  <li key={l}>
                    <button type="button" onClick={login} className="hover:text-amber-400 transition-colors text-left">{l}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-6 text-white/60">Community</h5>
              <ul className="space-y-3 text-white/30 text-sm">
                {["Reading Rooms", "Reflections", "Goals", "Activities"].map((l) => (
                  <li key={l}>
                    <button type="button" onClick={login} className="hover:text-amber-400 transition-colors text-left">{l}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-6 text-white/60">Newsletter</h5>
              <p className="text-white/30 text-sm mb-4">Daily inspirations and updates.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-white/20" />
                <motion.button whileTap={{ scale: 0.95 }} type="button"
                  className="px-4 py-2.5 rounded-xl gold-gradient text-black font-black text-xs uppercase tracking-wider shrink-0">
                  Join
                </motion.button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-white/15">
            <p>© 2026 Quran Majeed Premium. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white/40 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white/40 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white/40 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
