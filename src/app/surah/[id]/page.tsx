"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSurahDetail, fetchSurahVerses, fetchChapterInfo, fetchHadithContent,
  fetchQuranByScript, fetchAvailableTranslations, fetchAvailableTafsirs,
  fetchTafsirByAyah, fetchNotesByVerse, addNote, updateNote, deleteNote,
  addUserBookmark, fetchBookmarksInRange,
} from "@/services/quranService";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import {
  ChevronLeft, Play, Bookmark, BookmarkCheck, Share2, Info, X, MessageSquare,
  AlertCircle, ScrollText, FileText, Plus, Trash2, ChevronDown, Check,
} from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";

const SCRIPTS = [
  { key: "uthmani", label: "Uthmani" },
  { key: "uthmani_simple", label: "Uthmani Simple" },
  { key: "imlaei", label: "Imlaei" },
  { key: "indopak", label: "Indopak" },
  { key: "indopak_nastaleeq", label: "Nastaleeq" },
  { key: "uthmani_tajweed", label: "Tajweed" },
  { key: "code_v1", label: "Glyph V1" },
  { key: "code_v2", label: "Glyph V2" },
];

type PanelMode = "info" | "hadith" | "tafsir" | "note" | null;

interface VerseTranslation { resource_id: number; text: string; }
interface VerseWord { text_uthmani: string; translation?: { text: string }; }
interface Verse {
  id: string | number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations?: VerseTranslation[];
  words?: VerseWord[];
}

function Dropdown({ label, options, value, onChange }: {
  label: string;
  options: { value: string | number; label: string }[];
  value: string | number;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => String(o.value) === String(value));
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold transition-all">
        <span className="text-slate-400">{label}:</span>
        <span className="max-w-[100px] truncate">{selected?.label ?? value}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="absolute top-full mt-1 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-20 min-w-[180px] max-h-64 overflow-y-auto">
              {options.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => { onChange(String(opt.value)); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-xs hover:bg-white/5 flex items-center justify-between gap-2 transition-colors",
                    String(opt.value) === String(value) ? "text-brand-emerald-light" : "text-slate-300"
                  )}>
                  <span className="truncate">{opt.label}</span>
                  {String(opt.value) === String(value) && <Check className="w-3 h-3 shrink-0" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SurahDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setCurrentSurah, setIsPlaying, currentAyah } = useAudioStore();
  const { isAuthenticated } = useAuth();

  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [activeAyah, setActiveAyah] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [script, setScript] = useState("uthmani");
  const [translationId, setTranslationId] = useState("131");
  const [tafsirId, setTafsirId] = useState("169");
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | number | null>(null);

  const { data: chapter, isLoading: isChapterLoading, isError } = useQuery({
    queryKey: ["chapter", id],
    queryFn: () => fetchSurahDetail(id as string),
  });

  const { data: verseResponse, isLoading: isVersesLoading } = useQuery({
    queryKey: ["verses", id, page, translationId],
    queryFn: () => fetchSurahVerses(id as string, page, 20, { translationId }),
    enabled: !!chapter,
  });

  const { data: scriptData } = useQuery({
    queryKey: ["script", id, script],
    queryFn: () => fetchQuranByScript(script, { chapter_number: Number(id) }),
    enabled: script !== "uthmani" && !!chapter,
  });

  const { data: availableTranslations } = useQuery({
    queryKey: ["available-translations"],
    queryFn: () => fetchAvailableTranslations(),
  });

  const { data: availableTafsirs } = useQuery({
    queryKey: ["available-tafsirs"],
    queryFn: () => fetchAvailableTafsirs(),
  });

  const { data: chapterInfo } = useQuery({
    queryKey: ["chapter-info", id],
    queryFn: () => fetchChapterInfo(id as string),
    enabled: panelMode === "info",
  });

  const { data: hadithResponse, isLoading: isHadithLoading } = useQuery({
    queryKey: ["hadith-content", activeAyah],
    queryFn: () => fetchHadithContent(activeAyah as string),
    enabled: panelMode === "hadith" && !!activeAyah,
  });

  const { data: tafsirResponse, isLoading: isTafsirLoading } = useQuery({
    queryKey: ["tafsir-ayah", tafsirId, activeAyah],
    queryFn: () => fetchTafsirByAyah(tafsirId, activeAyah as string),
    enabled: panelMode === "tafsir" && !!activeAyah,
  });

  const { data: notesResponse, isLoading: isNotesLoading } = useQuery({
    queryKey: ["notes-verse", activeAyah],
    queryFn: () => fetchNotesByVerse(activeAyah as string),
    enabled: panelMode === "note" && !!activeAyah && isAuthenticated,
  });

  const { data: bookmarksData } = useQuery({
    queryKey: ["bookmarks-range", id, page],
    queryFn: () => fetchBookmarksInRange({
      chapterNumber: Number(id),
      rangeStartAyahNumber: (page - 1) * 20 + 1,
      rangeEndAyahNumber: page * 20,
      mushafId: 4,
    }),
    enabled: isAuthenticated && !!chapter,
  });

  const bookmarkMutation = useMutation({
    mutationFn: (verseNumber: number) => addUserBookmark({ key: Number(id), type: "ayah", verseNumber, mushafId: 4 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks-range", id, page] }),
  });

  const addNoteMutation = useMutation({
    mutationFn: (body: string) => addNote({ body, saveToQR: false, ranges: [activeAyah as string] }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notes-verse", activeAyah] }); setNoteText(""); },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id: nId, body }: { id: string | number; body: string }) => updateNote(nId, { body }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notes-verse", activeAyah] }); setEditingNoteId(null); setNoteText(""); },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string | number) => deleteNote(noteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes-verse", activeAyah] }),
  });

  const scriptTextMap = useMemo(() => {
    if (script === "uthmani" || !scriptData?.verses) return null;
    const map: Record<number, string> = {};
    for (const v of scriptData.verses) {
      const text = v.text_indopak ?? v.text_indopak_nastaleeq ?? v.text_uthmani_tajweed ??
        v.text_uthmani_simple ?? v.text_imlaei_simple ?? v.code_v1 ?? v.code_v2 ?? v.text ?? "";
      map[v.verse_number] = text;
    }
    return map;
  }, [scriptData, script]);

  const bookmarkedVerseNumbers = useMemo(() => {
    const set = new Set<number>();
    for (const b of bookmarksData?.bookmarks ?? []) { if (b.verse_number) set.add(b.verse_number); }
    return set;
  }, [bookmarksData]);

  const translationOptions = useMemo(() =>
    (availableTranslations ?? []).map((t: any) => ({ value: String(t.id), label: t.name })),
    [availableTranslations]);

  const tafsirOptions = useMemo(() =>
    (availableTafsirs ?? []).map((t: any) => ({ value: String(t.id), label: t.name })),
    [availableTafsirs]);

  if (isChapterLoading || (!!chapter && isVersesLoading && !verseResponse)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading Surah…</p>
        </div>
      </div>
    );
  }

  if (isError || !chapter) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-slate-400">Failed to load Surah.</p>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold text-sm">Go Back</button>
      </div>
    );
  }

  const verses: Verse[] = verseResponse?.verses ?? [];
  const totalPages = verseResponse?.meta?.pagination?.total_pages ?? verseResponse?.pagination?.total_pages ?? 1;

  const openPanel = (mode: PanelMode, verseKey?: string) => {
    setActiveAyah(verseKey ?? null);
    setPanelMode(mode);
    setNoteText("");
    setEditingNoteId(null);
  };
  const closePanel = () => { setPanelMode(null); setActiveAyah(null); };

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
          <button type="button" onClick={() => router.back()} aria-label="Go back"
            className="p-2 rounded-xl hover:bg-white/5 transition-colors group shrink-0">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <Dropdown label="Script" options={SCRIPTS.map(s => ({ value: s.key, label: s.label }))} value={script} onChange={setScript} />
            {translationOptions.length > 0 && (
              <Dropdown label="Translation" options={translationOptions} value={translationId} onChange={setTranslationId} />
            )}
            {tafsirOptions.length > 0 && (
              <Dropdown label="Tafsir" options={tafsirOptions} value={tafsirId} onChange={setTafsirId} />
            )}
            <button type="button" onClick={() => openPanel("info")}
              className="p-2 rounded-xl hover:bg-white/5 text-brand-gold transition-colors" aria-label="Chapter info">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Surah Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="arabic-text text-6xl lg:text-8xl mb-6 text-brand-gold">{chapter.name_arabic}</h1>
          <h2 className="text-3xl font-black mb-2">{chapter.name_simple}</h2>
          <p className="text-slate-400 uppercase tracking-[0.2em] text-sm font-bold mb-8">
            {chapter.revelation_place} • {chapter.verses_count} Ayahs
          </p>
          <div className="flex items-center justify-center gap-4">
            <motion.button type="button" whileTap={{ scale: 0.95 }}
              onClick={() => { setCurrentSurah(chapter); setIsPlaying(true); }}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
              <Play className="w-5 h-5 fill-current" />Listen to Surah
            </motion.button>
            <button type="button" aria-label="Share"
              className="p-3 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Bismillah */}
        {chapter.id !== 1 && chapter.id !== 9 && page === 1 && (
          <div className="text-center mb-16">
            <p className="arabic-text text-4xl text-slate-200">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
        )}

        {/* Verses */}
        <div className="space-y-12">
          {verses.map((verse, i) => {
            const translation = verse.translations?.find(t => t.resource_id === Number(translationId))?.text
              ?? verse.translations?.find(t => t.resource_id === 131)?.text;
            const transliteration = verse.translations?.find(t => t.resource_id === 57)?.text;
            const isCurrentAyah = currentAyah === verse.verse_number;
            const isBookmarked = bookmarkedVerseNumbers.has(verse.verse_number);
            const displayText = (scriptTextMap?.[verse.verse_number]) || verse.text_uthmani;

            return (
              <motion.div
                key={verse.id}
                id={`ayah-${verse.verse_number}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                className={cn(
                  "group relative p-8 rounded-3xl border transition-all duration-500",
                  isCurrentAyah
                    ? "bg-brand-emerald/5 border-brand-emerald/20 shadow-2xl shadow-emerald-900/10"
                    : "hover:bg-white/[0.02] border-transparent"
                )}>
                <div className="flex-1 text-right w-full">
                  <p className={cn(
                    "arabic-text text-3xl lg:text-5xl leading-[2] lg:leading-[1.8] transition-colors duration-500",
                    isCurrentAyah ? "text-white" : "text-slate-100 group-hover:text-brand-gold"
                  )}>
                    {displayText}
                    <span className={cn(
                      "inline-flex items-center justify-center w-10 h-10 rounded-full border text-xs font-bold mr-4 font-sans transition-colors",
                      isCurrentAyah
                        ? "border-brand-emerald text-brand-emerald shadow-lg shadow-emerald-500/20"
                        : "border-brand-gold/30 text-brand-gold"
                    )}>
                      {verse.verse_number}
                    </span>
                  </p>
                </div>

                <div className="mt-8 space-y-4 max-w-3xl">
                  {transliteration && (
                    <p className="text-brand-emerald-light/80 italic text-sm" dangerouslySetInnerHTML={{ __html: transliteration }} />
                  )}
                  {translation && (
                    <div className="text-lg text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: translation }} />
                  )}
                </div>

                {verse.words && verse.words.length > 0 && (
                  <div className="mt-6 flex flex-wrap flex-row-reverse gap-4">
                    {verse.words.map((word, wi) => (
                      <div key={wi} className="flex flex-col items-center group/word">
                        <span className="arabic-text text-2xl text-slate-400 group-hover/word:text-brand-gold transition-colors">{word.text_uthmani}</span>
                        <span className="text-[10px] text-slate-600 group-hover/word:text-slate-300 transition-colors">{word.translation?.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action bar */}
                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                  <button type="button" aria-label="Play ayah"
                    onClick={() => { setCurrentSurah(chapter); setIsPlaying(true); }}
                    className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button type="button" onClick={() => openPanel("hadith", verse.verse_key)}
                    className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-brand-gold transition-colors flex items-center gap-1 text-xs">
                    <MessageSquare className="w-4 h-4" /><span className="hidden sm:inline">Hadith</span>
                  </button>
                  <button type="button" onClick={() => openPanel("tafsir", verse.verse_key)}
                    className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-brand-emerald-light transition-colors flex items-center gap-1 text-xs">
                    <ScrollText className="w-4 h-4" /><span className="hidden sm:inline">Tafsir</span>
                  </button>
                  {isAuthenticated && (
                    <button type="button" onClick={() => openPanel("note", verse.verse_key)}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1 text-xs">
                      <FileText className="w-4 h-4" /><span className="hidden sm:inline">Note</span>
                    </button>
                  )}
                  {isAuthenticated && (
                    <button type="button" aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                      onClick={() => bookmarkMutation.mutate(verse.verse_number)}
                      disabled={bookmarkMutation.isPending}
                      className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors",
                        isBookmarked ? "text-brand-gold" : "text-slate-500 hover:text-white")}>
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="absolute -left-4 lg:-left-10 top-0 bottom-0 w-px bg-white/5 group-hover:bg-brand-emerald/30 transition-colors" />
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-4">
            <button type="button" disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 font-bold">Previous</button>
            <span className="text-slate-400 font-mono">Page {page} of {totalPages}</span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 font-bold">Next</button>
          </div>
        )}
      </main>

      {/* Side Panel */}
      <AnimatePresence>
        {panelMode && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closePanel} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-white/10 z-[70] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                <h3 className="text-lg font-black">
                  {panelMode === "info" && "Chapter Info"}
                  {panelMode === "hadith" && `Hadiths · ${activeAyah}`}
                  {panelMode === "tafsir" && `Tafsir · ${activeAyah}`}
                  {panelMode === "note" && `Notes · ${activeAyah}`}
                </h3>
                <button type="button" onClick={closePanel} aria-label="Close panel" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Chapter info */}
                {panelMode === "info" && (
                  !chapterInfo
                    ? <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded-full animate-pulse" />)}</div>
                    : <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: chapterInfo.text ?? "" }} />
                )}

                {/* Hadith */}
                {panelMode === "hadith" && (
                  isHadithLoading
                    ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />)}</div>
                    : !hadithResponse?.hadiths?.length
                      ? <p className="text-slate-500 text-center py-10">No hadiths for this ayah.</p>
                      : hadithResponse.hadiths.map((h: any, i: number) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-sm text-slate-200 leading-relaxed mb-4">{h.text}</p>
                          <span className="px-2 py-1 rounded bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase">{h.source || "Source"}</span>
                        </div>
                      ))
                )}

                {/* Tafsir */}
                {panelMode === "tafsir" && (
                  isTafsirLoading
                    ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-white/5 rounded-full animate-pulse" />)}</div>
                    : (() => {
                      const tafsirText = tafsirResponse?.tafsir?.text ?? tafsirResponse?.tafsirs?.[0]?.text ?? tafsirResponse?.text;
                      return tafsirText
                        ? <div className="prose prose-invert prose-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: tafsirText }} />
                        : <p className="text-slate-500 text-center py-10">No tafsir available for this ayah.</p>;
                    })()
                )}

                {/* Notes */}
                {panelMode === "note" && (
                  <>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <textarea
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Write your note about this verse…"
                        rows={4}
                        className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        {editingNoteId && (
                          <button type="button" onClick={() => { setEditingNoteId(null); setNoteText(""); }}
                            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors">Cancel</button>
                        )}
                        <button type="button"
                          disabled={!noteText.trim() || addNoteMutation.isPending || updateNoteMutation.isPending}
                          onClick={() => editingNoteId
                            ? updateNoteMutation.mutate({ id: editingNoteId, body: noteText })
                            : addNoteMutation.mutate(noteText)
                          }
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-emerald/20 text-brand-emerald-light hover:bg-brand-emerald/30 disabled:opacity-40 flex items-center gap-1">
                          <Plus className="w-3 h-3" />{editingNoteId ? "Update" : "Save Note"}
                        </button>
                      </div>
                    </div>
                    {isNotesLoading
                      ? <div className="space-y-2">{[...Array(2)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
                      : (() => {
                        const notes = notesResponse?.notes ?? notesResponse ?? [];
                        return Array.isArray(notes) && notes.length === 0
                          ? <p className="text-slate-600 text-xs text-center py-4">No notes yet for this verse.</p>
                          : Array.isArray(notes) && notes.map((note: any) => (
                            <div key={note.id} className="p-4 rounded-xl bg-white/5 border border-white/5 group/note">
                              <p className="text-sm text-slate-300 leading-relaxed mb-3">{note.body}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-600">
                                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ""}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                                  <button type="button"
                                    onClick={() => { setEditingNoteId(note.id); setNoteText(note.body); }}
                                    className="px-2 py-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition-colors text-xs">Edit</button>
                                  <button type="button" aria-label="Delete note" onClick={() => deleteNoteMutation.mutate(note.id)}
                                    disabled={deleteNoteMutation.isPending}
                                    className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ));
                      })()
                    }
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
