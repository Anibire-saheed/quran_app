"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCurrentStreak, fetchActivityDays, fetchStreaks,
  fetchTodaysGoalPlan,
} from "@/services/quranService";
import { Activity, Flame, Target, Calendar, Clock, ChevronRight, TrendingUp, Award } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function ActivitiesPage() {
  const { isAuthenticated, login } = useAuth();
  const tz = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

  const { data: currentStreakData, isLoading: isStreakLoading } = useQuery({
    queryKey: ["currentStreak"],
    queryFn: () => fetchCurrentStreak("QURAN", tz),
    enabled: isAuthenticated,
  });

  const { data: streaksHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["streaksHistory"],
    queryFn: () => fetchStreaks({ first: 10, sortOrder: "desc", orderBy: "startDate" }),
    enabled: isAuthenticated,
  });

  const { data: activityDays, isLoading: isActivityLoading } = useQuery({
    queryKey: ["activityDays"],
    queryFn: () => fetchActivityDays({ first: 14 }),
    enabled: isAuthenticated,
  });

  const { data: todaysPlan } = useQuery({
    queryKey: ["todays-goal-plan", "QURAN_TIME"],
    queryFn: () => fetchTodaysGoalPlan({ type: "QURAN_TIME", mushafId: 4 }, tz),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 lg:ml-[280px] p-10 flex flex-col items-center justify-center">
          <Activity className="w-20 h-20 text-slate-800 mb-8" />
          <h2 className="text-3xl font-black mb-4">Track Your Progress</h2>
          <p className="text-slate-500 text-center max-w-md mb-10">
            Sign in to track your reading streaks, set spiritual goals, and view your activity history.
          </p>
          <button onClick={login} className="px-10 py-4 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl">
            Sign in to continue
          </button>
        </main>
      </div>
    );
  }

  const currentDays = currentStreakData?.data?.days ?? currentStreakData?.days ?? 0;
  const activityList: any[] = activityDays?.data ?? activityDays?.edges?.map((e: any) => e.node) ?? [];
  const streaksList: any[] = streaksHistory?.data ?? streaksHistory?.edges?.map((e: any) => e.node) ?? [];
  const goals: any[] = todaysPlan?.goals ?? todaysPlan?.data ?? [];
  const completedGoals = goals.filter((g: any) => g.isCompleted).length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="flex-1 lg:ml-[280px] p-6 lg:p-10 max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Activity className="w-9 h-9 text-brand-emerald-light" />
            My Activities
          </h1>
          <p className="text-slate-400">Track your reading progress, streaks, and spiritual goals.</p>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Flame, label: "Current Streak", value: `${currentDays}d`, color: "text-orange-400", bg: "bg-orange-500/10" },
            { icon: Target, label: "Goals Today", value: `${completedGoals}/${goals.length}`, color: "text-brand-emerald-light", bg: "bg-brand-emerald/10" },
            { icon: TrendingUp, label: "Active Days", value: activityList.length, color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: Award, label: "Streaks", value: streaksList.length, color: "text-brand-gold", bg: "bg-brand-gold/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Current streak hero */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Flame className="w-48 h-48 text-orange-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-orange-500 mb-4">
                  <Flame className="w-7 h-7 animate-pulse" />
                  <span className="font-bold tracking-widest uppercase text-sm">Current Streak</span>
                </div>
                {isStreakLoading ? (
                  <div className="h-24 w-32 bg-white/5 rounded-2xl animate-pulse" />
                ) : (
                  <>
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-8xl font-black">{currentDays}</span>
                      <span className="text-2xl font-medium text-slate-400">Days</span>
                    </div>
                    <p className="text-slate-400 max-w-md text-sm">
                      {currentDays > 0
                        ? "You're doing great! Keep reading every day to maintain your streak."
                        : "Start reading today to begin your streak!"}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-brand-emerald-light" />
                  Recent Activity
                </h3>
                <span className="text-xs text-slate-500">Last {activityList.length} sessions</span>
              </div>

              {isActivityLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-18 rounded-2xl bg-white/5 animate-pulse h-16" />)}
                </div>
              ) : activityList.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No activity recorded yet. Start reading to track your progress!
                </div>
              ) : (
                <div className="space-y-3">
                  {activityList.map((day: any, i: number) => {
                    const minutes = Math.floor((day.seconds ?? 0) / 60);
                    const secs = (day.seconds ?? 0) % 60;
                    return (
                      <div key={day.id ?? i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald-light shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">
                              {day.date ? new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—"}
                            </p>
                            {day.ranges?.length > 0 && (
                              <p className="text-xs text-slate-500 truncate max-w-[200px]">{day.ranges.join(", ")}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm">{minutes}m {secs}s</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tight">Reading Time</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Streak history */}
            {!isHistoryLoading && streaksList.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Streak History
                </h3>
                <div className="space-y-3">
                  {streaksList.map((streak: any, i: number) => (
                    <div key={streak.id ?? i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center gap-4">
                        <Flame className={cn("w-5 h-5 shrink-0", streak.status === "ACTIVE" ? "text-orange-400" : "text-slate-600")} />
                        <div>
                          <p className="text-sm font-bold">{streak.days ?? 0} days</p>
                          <p className="text-xs text-slate-500">
                            {streak.startDate ? new Date(streak.startDate).toLocaleDateString() : ""} –{" "}
                            {streak.endDate ? new Date(streak.endDate).toLocaleDateString() : "ongoing"}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        streak.status === "ACTIVE" ? "bg-orange-500/10 text-orange-400" : "bg-white/5 text-slate-500"
                      )}>
                        {streak.status ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Today's goals */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-emerald-light" />
                  Today's Goals
                </h3>
                <Link href="/goals" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                  Manage <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 text-xs mb-3">No goals set yet.</p>
                  <Link href="/goals"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-emerald/10 text-brand-emerald-light hover:bg-brand-emerald/20 transition-all inline-block">
                    Set a goal →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 4).map((goal: any) => (
                    <div key={goal.id}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400 capitalize">{goal.category ?? "Reading"}</span>
                        <span className={cn("font-bold", goal.isCompleted ? "text-green-400" : "text-slate-300")}>
                          {goal.isCompleted ? "Done ✓" : `${Math.round(goal.progress ?? 0)}%`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn("progress-fill h-full rounded-full transition-all", goal.isCompleted ? "bg-green-400" : "bg-brand-emerald-light")}
                          style={{ "--fill": `${Math.min(goal.progress ?? 0, 100)}%` } as React.CSSProperties}
                        />
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {goal.type === "QURAN_TIME" ? `${goal.amount} min/day` :
                         goal.type === "QURAN_PAGES" ? `${goal.amount} pages/day` :
                         `${goal.amount} verses/day`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-2">
              <h3 className="font-bold text-sm mb-4 text-slate-300">Quick Links</h3>
              {[
                { href: "/goals", label: "Manage Goals", icon: Target },
                { href: "/notes", label: "My Notes", icon: Clock },
                { href: "/reflect", label: "Reflections", icon: Activity },
                { href: "/bookmarks", label: "Bookmarks", icon: Calendar },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-brand-emerald-light transition-colors" />
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
