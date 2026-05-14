"use client";

import { useEffect, useState } from "react";
import { 
  MapPin, 
  Moon, 
  Sun, 
  SunMedium, 
  Sunrise, 
  Sunset, 
  CloudMoon, 
  Clock,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const PRAYER_CONFIG = [
  { name: "Fajr", icon: Moon, color: "text-blue-500 dark:text-blue-400" },
  { name: "Sunrise", icon: Sunrise, color: "text-amber-500 dark:text-amber-400" },
  { name: "Dhuhr", icon: Sun, color: "text-amber-600 dark:text-amber-500" },
  { name: "Asr", icon: SunMedium, color: "text-orange-500 dark:text-orange-400" },
  { name: "Maghrib", icon: Sunset, color: "text-rose-500 dark:text-rose-400" },
  { name: "Isha", icon: CloudMoon, color: "text-indigo-500 dark:text-indigo-400" },
];

export default function PrayerTimesPage() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [city] = useState("Lagos");
  const [hijriDate, setHijriDate] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Nigeria&method=2`)
      .then((r) => r.json())
      .then((d) => {
        setPrayerTimes(d.data.timings);
        setHijriDate(`${d.data.date.hijri.day} ${d.data.date.hijri.month.en} ${d.data.date.hijri.year} AH`);
      });
  }, [city]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-12 selection:bg-brand-gold/30">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-bold">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-2xl">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Live Times</span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass-effect rounded-[48px] p-8 lg:p-16 border-foreground/5 shadow-2xl overflow-hidden"
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-gold/5 blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] -z-10" />

          {/* Top Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 items-center">
            {/* Location */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                <MapPin className="w-8 h-8 text-brand-gold-dark dark:text-brand-gold" />
              </div>
              <div>
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-1.5">Location</p>
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight">{city}, Nigeria</h2>
              </div>
            </div>

            {/* Current Time */}
            <div className="text-center">
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-2">Current Time</p>
              <div className="text-5xl lg:text-7xl font-black tabular-nums tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-foreground to-foreground/60 drop-shadow-sm">
                {currentTime ? currentTime.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
              </div>
            </div>

            {/* Hijri Date */}
            <div className="flex items-center gap-6 justify-end">
              <div className="text-right">
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-1.5">Hijri Date</p>
                <h2 className="text-xl lg:text-2xl font-black tracking-tight">{hijriDate || "Loading..."}</h2>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                <Moon className="w-8 h-8 text-brand-gold-dark dark:text-brand-gold fill-brand-gold/20" />
              </div>
            </div>
          </div>

          {/* Prayer Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {/* Custom Vertical Separators */}
            <div className="absolute inset-y-0 left-1/2 w-px bg-linear-to-b from-transparent via-foreground/5 to-transparent hidden lg:block" />
            
            {PRAYER_CONFIG.map((config, index) => {
              const time = prayerTimes?.[config.name as keyof PrayerTimes];
              return (
                <motion.div
                  key={config.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: "var(--foreground)", opacity: 0.03 }}
                  className="relative group flex flex-col items-center py-10 px-4 rounded-[32px] border border-foreground/5 transition-all duration-500 overflow-hidden"
                >
                  {/* Vertical Glow Line */}
                  <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-linear-to-b from-transparent via-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="mb-10 relative">
                    <config.icon className={cn("w-12 h-12 relative z-10", config.color)} />
                    <div className="absolute inset-0 blur-2xl opacity-20 bg-brand-gold -z-10" />
                  </div>
                  
                  <h3 className="text-base font-bold text-foreground/60 mb-2 group-hover:text-foreground transition-colors">{config.name}</h3>
                  <div className="text-3xl lg:text-4xl font-black text-brand-gold-dark dark:text-brand-gold tabular-nums tracking-tight">
                    {time || "--:--"}
                  </div>

                  {/* Active/Next Prayer Indicator */}
                  {index === 2 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Note */}
        <p className="mt-10 text-center text-foreground/20 text-xs font-semibold tracking-widest uppercase">
          Prayer times are based on your current location and standard calculation methods.
        </p>
      </main>
    </div>
  );
}
