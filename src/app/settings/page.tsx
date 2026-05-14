"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPreferences, updatePreference, fetchLanguages, fetchAyahRecitations, fetchAvailableTranslations } from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { Settings, Moon, Sun, Type, Music, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { useThemeStore } from "@/store/useThemeStore";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState<any>({});
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore();

  const { data: preferences } = useQuery({
    queryKey: ["preferences"],
    queryFn: () => fetchPreferences(),
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => fetchLanguages(),
  });

  const { data: recitations } = useQuery({
    queryKey: ["recitations"],
    queryFn: () => fetchAyahRecitations(),
  });

  const { data: translations } = useQuery({
    queryKey: ["translations"],
    queryFn: () => fetchAvailableTranslations(),
  });

  useEffect(() => {
    if (preferences) {
      setLocalSettings(preferences);
    }
  }, [preferences]);

  const mutation = useMutation({
    mutationFn: (body: any) => updatePreference({ mushafId: 4 }, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    }
  });

  const handleUpdate = (group: string, key: string, value: any) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value }
    }));
    mutation.mutate({ group, key, value });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-[280px] p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-400" />
            Settings
          </h2>
          <p className="text-slate-400">Personalize your reading experience and account preferences.</p>
        </div>

        <div className="space-y-8">
          {/* Appearance Section */}
          <section className="glass-effect rounded-3xl p-8 border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Moon className="w-5 h-5 text-brand-gold" />
              Appearance
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Theme Mode</p>
                  <p className="text-xs text-slate-500">Switch between light and dark modes.</p>
                </div>
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", themeMode === 'light' ? "bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black" : "text-slate-500 dark:text-slate-400")}
                  >
                    <Sun className="w-3.5 h-3.5" /> Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", themeMode === 'dark' ? "bg-slate-800 text-white shadow-sm dark:bg-white dark:text-black" : "text-slate-500 dark:text-slate-400")}
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Reader Preferences Section */}
          <section className="glass-effect rounded-3xl p-8 border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Type className="w-5 h-5 text-brand-emerald-light" />
              Reader Styles
            </h3>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Arabic Script</p>
                  <p className="text-xs text-slate-500">Choose your preferred Quranic script.</p>
                </div>
                <select
                  aria-label="Arabic script"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                  value={localSettings.quranReaderStyles?.quranFont || 'uthmani'}
                  onChange={(e) => handleUpdate('quranReaderStyles', 'quranFont', e.target.value)}
                >
                  <option value="uthmani">Uthmani</option>
                  <option value="indopak">Indopak</option>
                  <option value="tajweed">Tajweed</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Translation</p>
                  <p className="text-xs text-slate-500">Select the default translation to display.</p>
                </div>
                <select
                  aria-label="Default translation"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm max-w-50 focus:outline-none"
                  value={localSettings.translations?.selectedId || '131'}
                  onChange={(e) => handleUpdate('translations', 'selectedId', e.target.value)}
                >
                  {translations?.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Audio Section */}
          <section className="glass-effect rounded-3xl p-8 border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Music className="w-5 h-5 text-blue-400" />
              Audio Settings
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Default Reciter</p>
                  <p className="text-xs text-slate-500">Your preferred voice for ayah recitations.</p>
                </div>
                <select
                  aria-label="Default reciter"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm max-w-50 focus:outline-none"
                  value={localSettings.audio?.reciter || '2'}
                  onChange={(e) => handleUpdate('audio', 'reciter', e.target.value)}
                >
                  {recitations?.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.reciter_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Language Section */}
          <section className="glass-effect rounded-3xl p-8 border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              Language & Region
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">App Language</p>
                  <p className="text-xs text-slate-500">The language used throughout the interface.</p>
                </div>
                <select
                  aria-label="App language"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                  value={localSettings.language?.selected || 'en'}
                  onChange={(e) => handleUpdate('language', 'selected', e.target.value)}
                >
                  {languages?.map((l: any) => (
                    <option key={l.id} value={l.iso_code}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </div>

        {mutation.isPending && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-brand-emerald text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-2xl z-100">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving changes...
          </div>
        )}
      </main>
    </div>
  );
}
