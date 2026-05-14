"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTodaysGoalPlan, createGoal, updateGoal, deleteGoal, estimateGoalTimeline,
  fetchCurrentStreak,
} from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { Target, Plus, Trash2, Edit2, Clock, Flame, TrendingUp, CheckCircle2, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const GOAL_TYPES = [
  { value: "QURAN_TIME", label: "Time (minutes/day)" },
  { value: "QURAN_PAGES", label: "Pages per day" },
  { value: "QURAN_RANGE", label: "Verse range" },
];

const GOAL_CATEGORIES = [
  { value: "memorization", label: "Memorization" },
  { value: "recitation", label: "Recitation" },
  { value: "study", label: "Study" },
  { value: "listening", label: "Listening" },
];

function GoalForm({ initial, onSubmit, onCancel, isPending }: {
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [type, setType] = useState(initial?.type ?? "QURAN_TIME");
  const [amount, setAmount] = useState(initial?.amount ?? 15);
  const [duration, setDuration] = useState(initial?.duration ?? 30);
  const [category, setCategory] = useState(initial?.category ?? "recitation");
  const [estimate, setEstimate] = useState<any>(null);
  const [estimating, setEstimating] = useState(false);

  const handleEstimate = async () => {
    setEstimating(true);
    try {
      const result = await estimateGoalTimeline({ type, amount, duration, mushafId: 4 });
      setEstimate(result);
    } catch { /* ignore */ }
    setEstimating(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block">Goal Type</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30">
            {GOAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30">
            {GOAL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block">
            {type === "QURAN_TIME" ? "Minutes per day" : type === "QURAN_PAGES" ? "Pages per day" : "Amount"}
          </label>
          <input type="number" min={1} value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block">Duration (days)</label>
          <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
        </div>
      </div>

      {estimate && (
        <div className="bg-brand-emerald/10 border border-brand-emerald/20 rounded-2xl p-4 text-sm text-brand-emerald-light">
          <p className="font-bold mb-1">Timeline Estimate</p>
          <p className="text-slate-300">{JSON.stringify(estimate)}</p>
        </div>
      )}

      <div className="flex items-center gap-3 justify-between">
        <button type="button" onClick={handleEstimate} disabled={estimating}
          className="text-xs text-slate-400 hover:text-brand-emerald-light flex items-center gap-1.5 transition-colors">
          <TrendingUp className="w-3.5 h-3.5" />
          {estimating ? "Estimating…" : "Estimate Timeline"}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="button" disabled={isPending}
            onClick={() => onSubmit({ type, amount, duration, category })}
            className="px-5 py-2 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 transition-all disabled:opacity-50">
            {isPending ? "Saving…" : initial ? "Update Goal" : "Create Goal"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function GoalsPage() {
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"QURAN_TIME" | "QURAN_PAGES" | "QURAN_RANGE">("QURAN_TIME");

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: todaysPlan, isLoading: isPlanLoading } = useQuery({
    queryKey: ["todays-goal-plan", activeTab],
    queryFn: () => fetchTodaysGoalPlan({ type: activeTab, mushafId: 4 }, tz),
    enabled: isAuthenticated,
  });

  const { data: streakData } = useQuery({
    queryKey: ["current-streak"],
    queryFn: () => fetchCurrentStreak("QURAN", tz),
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (goal: any) => createGoal({ mushafId: 4 }, goal, tz),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["todays-goal-plan"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, goal }: { id: string | number; goal: any }) => updateGoal(id, { mushafId: 4 }, goal, tz),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["todays-goal-plan"] }); setEditingGoal(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteGoal(id, { category: "recitation" }, tz),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todays-goal-plan"] }),
  });

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 lg:ml-[280px] p-10 flex flex-col items-center justify-center">
          <Target className="w-20 h-20 text-slate-700 mb-8" />
          <h2 className="text-3xl font-black mb-4">Reading Goals</h2>
          <p className="text-slate-500 text-center max-w-md mb-10">
            Set daily reading goals, track your progress, and estimate completion timelines.
          </p>
          <button onClick={login}
            className="px-10 py-4 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl">
            Sign in to set goals
          </button>
        </main>
      </div>
    );
  }

  const goals: any[] = todaysPlan?.goals ?? todaysPlan?.data ?? [];
  const progress = todaysPlan?.progress ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-[280px] p-6 lg:p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Target className="w-8 h-8 text-brand-emerald-light" />
              Reading Goals
            </h2>
            <p className="text-slate-400 mt-1">Set and track your daily Quran reading goals.</p>
          </div>
          <button type="button" onClick={() => { setShowForm(true); setEditingGoal(null); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-lg shadow-emerald-900/20 text-sm">
            <Plus className="w-4 h-4" /> New Goal
          </button>
        </div>

        {/* Streak + progress summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Flame, label: "Current Streak", value: `${streakData?.data?.days ?? streakData?.days ?? 0} days`, color: "text-orange-400" },
            { icon: Target, label: "Goals Today", value: goals.length, color: "text-brand-emerald-light" },
            { icon: CheckCircle2, label: "Completed", value: goals.filter((g: any) => g.isCompleted).length, color: "text-green-400" },
            { icon: Clock, label: "Minutes Today", value: progress?.minutesRead ?? "—", color: "text-blue-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <Icon className={cn("w-6 h-6 mb-3", color)} />
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tab selector */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-6 w-fit">
          {GOAL_TYPES.map(t => (
            <button key={t.value} type="button"
              onClick={() => setActiveTab(t.value as any)}
              className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === t.value ? "bg-white text-black" : "text-slate-400 hover:text-white")}>
              {t.label.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* New goal form */}
        <AnimatePresence>
          {showForm && !editingGoal && (
            <div className="mb-6">
              <GoalForm
                onSubmit={(data) => createMutation.mutate(data)}
                onCancel={() => setShowForm(false)}
                isPending={createMutation.isPending}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Goals list */}
        {isPlanLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Target className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 font-medium mb-2">No goals yet for this type</p>
            <p className="text-sm text-slate-600">Click "New Goal" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal: any) => (
              <motion.div key={goal.id} layout
                className="bg-white/5 border border-white/10 rounded-2xl p-6 group">
                {editingGoal?.id === goal.id ? (
                  <GoalForm
                    initial={editingGoal}
                    onSubmit={(data) => updateMutation.mutate({ id: goal.id, goal: data })}
                    onCancel={() => setEditingGoal(null)}
                    isPending={updateMutation.isPending}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                          goal.isCompleted ? "bg-green-500/10 text-green-400" : "bg-brand-emerald/10 text-brand-emerald-light"
                        )}>
                          {goal.isCompleted ? "Completed" : "Active"}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{goal.category}</span>
                      </div>
                      <p className="font-bold text-sm">
                        {goal.type === "QURAN_TIME" ? `${goal.amount} min/day` :
                         goal.type === "QURAN_PAGES" ? `${goal.amount} pages/day` :
                         `${goal.amount} verses/day`}
                        {goal.duration ? ` · ${goal.duration} days` : ""}
                      </p>
                      {/* Progress bar */}
                      {goal.progress != null && (
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(goal.progress)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-emerald-light rounded-full transition-all"
                              style={{ width: `${Math.min(goal.progress, 100)}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button type="button" aria-label="Edit goal" onClick={() => setEditingGoal(goal)}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" aria-label="Delete goal"
                        onClick={() => deleteMutation.mutate(goal.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
