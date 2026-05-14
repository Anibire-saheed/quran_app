"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, addNote, updateNote, deleteNote, publishNote } from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { FileText, Plus, Trash2, Edit2, Send, X, BookOpen } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NotesPage() {
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [noteBody, setNoteBody] = useState("");
  const [publishingId, setPublishingId] = useState<string | number | null>(null);
  const [publishBody, setPublishBody] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const { data, isLoading } = useQuery({
    queryKey: ["notes", sortBy],
    queryFn: () => fetchNotes({ sortBy, limit: 50 }),
    enabled: isAuthenticated,
  });

  const addMutation = useMutation({
    mutationFn: (body: string) => addNote({ body, saveToQR: false }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notes"] }); setNoteBody(""); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string | number; body: string }) => updateNote(id, { body }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notes"] }); setEditingNote(null); setNoteBody(""); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, body }: { id: string | number; body: string }) => publishNote(id, { body }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notes"] }); setPublishingId(null); setPublishBody(""); },
  });

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 lg:ml-[280px] p-10 flex flex-col items-center justify-center">
          <FileText className="w-20 h-20 text-slate-700 mb-8" />
          <h2 className="text-3xl font-black mb-4">My Notes</h2>
          <p className="text-slate-500 text-center max-w-md mb-10">
            Write personal reflections and notes on Quran verses. Optionally share them as reflections.
          </p>
          <button onClick={login}
            className="px-10 py-4 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl">
            Sign in to add notes
          </button>
        </main>
      </div>
    );
  }

  const notes: any[] = data?.notes ?? data?.data?.notes ?? (Array.isArray(data?.data) ? data.data : []);

  const startEdit = (note: any) => {
    setEditingNote(note);
    setNoteBody(note.body);
    setShowForm(false);
  };

  const startPublish = (note: any) => {
    setPublishingId(note.id);
    setPublishBody(note.body);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-[280px] p-6 lg:p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              My Notes
            </h2>
            <p className="text-slate-400 mt-1">Personal reflections on Quran verses.</p>
          </div>
          <div className="flex items-center gap-3">
            <select aria-label="Sort notes" value={sortBy} onChange={e => setSortBy(e.target.value as "newest" | "oldest")}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button type="button" onClick={() => { setShowForm(true); setEditingNote(null); setNoteBody(""); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-lg text-sm">
              <Plus className="w-4 h-4" /> New Note
            </button>
          </div>
        </div>

        {/* New note form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mb-6 bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-300">New Note</h3>
                <button type="button" aria-label="Close form" onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={noteBody}
                onChange={e => setNoteBody(e.target.value)}
                placeholder="Write your reflection or note…"
                rows={5}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                <button type="button" disabled={!noteBody.trim() || addMutation.isPending}
                  onClick={() => addMutation.mutate(noteBody)}
                  className="px-5 py-2 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all">
                  {addMutation.isPending ? "Saving…" : "Save Note"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit form */}
        <AnimatePresence>
          {editingNote && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mb-6 bg-white/5 border border-brand-emerald/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-brand-emerald-light">Editing Note</h3>
                <button type="button" aria-label="Cancel edit" onClick={() => { setEditingNote(null); setNoteBody(""); }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={noteBody}
                onChange={e => setNoteBody(e.target.value)}
                rows={5}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => { setEditingNote(null); setNoteBody(""); }}
                  className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                <button type="button" disabled={!noteBody.trim() || updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ id: editingNote.id, body: noteBody })}
                  className="px-5 py-2 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all">
                  {updateMutation.isPending ? "Saving…" : "Update Note"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes list */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 font-medium mb-2">No notes yet</p>
            <p className="text-sm text-slate-600">Click "New Note" or add notes directly from a Surah page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note: any) => (
              <motion.div key={note.id} layout
                className="bg-white/5 border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all">
                <p className="text-slate-200 leading-relaxed mb-4 whitespace-pre-wrap">{note.body}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Verse range links */}
                    {note.ranges?.map((range: string) => (
                      <Link key={range} href={`/surah/${range.split(":")[0]}?ayah=${range.split(":")[1] ?? ""}`}
                        className="flex items-center gap-1 text-[10px] text-brand-emerald-light/70 hover:text-brand-emerald-light transition-colors bg-brand-emerald/5 px-2 py-1 rounded-lg">
                        <BookOpen className="w-3 h-3" />{range}
                      </Link>
                    ))}
                    <span className="text-[10px] text-slate-600">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                    </span>
                    {note.isPublished && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">Published</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!note.isPublished && (
                      <button type="button" aria-label="Publish note" onClick={() => startPublish(note)}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-brand-emerald-light transition-colors" title="Publish to Reflect">
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button type="button" aria-label="Edit note" onClick={() => startEdit(note)}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button type="button" aria-label="Delete note"
                      onClick={() => deleteMutation.mutate(note.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Publish panel */}
                <AnimatePresence>
                  {publishingId === note.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10 overflow-hidden">
                      <p className="text-xs font-bold text-slate-400 mb-2">Edit before publishing to Reflect:</p>
                      <textarea
                        value={publishBody}
                        onChange={e => setPublishBody(e.target.value)}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={() => setPublishingId(null)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">Cancel</button>
                        <button type="button" disabled={!publishBody.trim() || publishMutation.isPending}
                          onClick={() => publishMutation.mutate({ id: note.id, body: publishBody })}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 flex items-center gap-1 transition-all">
                          <Send className="w-3 h-3" />{publishMutation.isPending ? "Publishing…" : "Publish"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
