"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import {
  Users, Search, Plus, MessageSquare, Shield, Globe, ArrowRight,
  X, UserPlus, Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserJoinedRooms, searchRooms, createGroup, inviteToRoom,
  acceptRoomInvite, rejectRoomInvite,
} from "@/services/quranService";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

// ── Create Group Modal ────────────────────────────────────────────────────────
function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const createMutation = useMutation({
    mutationFn: () => createGroup({ name, description, url, public: isPublic }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["joinedRooms"] }); onClose(); },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-80 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black">Create a Group</h3>
          <button type="button" aria-label="Close" onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">Group Name</label>
            <input aria-label="Group Name" placeholder="e.g. Quran Memorization Circle" value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">URL Handle</label>
            <input aria-label="URL Handle" placeholder="e.g. quran-memorization" value={url}
              onChange={e => setUrl(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">Description</label>
            <textarea aria-label="Description" placeholder="What is this group about?" value={description}
              onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)}
              className="rounded accent-brand-emerald" />
            <span className="text-sm text-slate-300">Public group (anyone can join)</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="button" disabled={!name.trim() || !url.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
            className="px-6 py-2.5 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2">
            <Check className="w-4 h-4" />
            {createMutation.isPending ? "Creating…" : "Create Group"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Invite Modal ──────────────────────────────────────────────────────────────
function InviteModal({ roomId, onClose }: { roomId: number; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const inviteMutation = useMutation({
    mutationFn: (u: string) => inviteToRoom(roomId, { userIds: [u] }),
    onSuccess: () => { setUsername(""); onClose(); },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-80 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black">Invite Member</h3>
          <button type="button" aria-label="Close" onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-400 mb-1.5 block">Username</label>
          <input aria-label="Username to invite" placeholder="@username" value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="button" disabled={!username.trim() || inviteMutation.isPending}
            onClick={() => inviteMutation.mutate(username)}
            className="px-5 py-2 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {inviteMutation.isPending ? "Sending…" : "Send Invite"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Room Card ─────────────────────────────────────────────────────────────────
function RoomCard({ room, joined = false }: { room: any; joined?: boolean }) {
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);

  const acceptMutation = useMutation({
    mutationFn: () => acceptRoomInvite(room.id, room.inviteToken ?? ""),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["joinedRooms"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectRoomInvite(room.id, room.inviteToken ?? ""),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["joinedRooms"] }),
  });

  return (
    <>
      <div className="group glass-effect rounded-4xl p-8 border-white/5 hover:border-brand-emerald-light/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10 relative overflow-hidden flex flex-col h-full">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-emerald/10 rounded-full blur-3xl group-hover:bg-brand-emerald/20 transition-colors" />

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0">
            {room.avatarUrl ? (
              <img src={room.avatarUrl} alt={room.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full islamic-gradient flex items-center justify-center text-2xl font-black text-white">
                {room.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {room.public ? (
              <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-brand-emerald/10 text-brand-emerald-light rounded-lg border border-brand-emerald/20">
                <Globe className="w-2 h-2" /> Public
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-brand-gold/10 text-brand-gold rounded-lg border border-brand-gold/20">
                <Shield className="w-2 h-2" /> Private
              </span>
            )}
            {joined && (
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/10 text-white rounded-lg border border-white/20">
                Member
              </span>
            )}
          </div>
        </div>

        <div className="mb-6 relative z-10 flex-1">
          <h3 className="text-xl font-black mb-3 group-hover:text-brand-emerald-light transition-colors line-clamp-1">{room.name}</h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 font-medium">
            {room.description || "No description provided for this room."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10 gap-2 flex-wrap">
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5 text-[10px] font-black">
              <Users className="w-4 h-4" />{room.membersCount ?? 0}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black">
              <MessageSquare className="w-4 h-4" />{room.postsCount ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {joined && (
              <button type="button" onClick={() => setShowInvite(true)}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-500 hover:text-brand-emerald-light transition-colors" title="Invite member">
                <UserPlus className="w-4 h-4" />
              </button>
            )}
            {room.hasPendingInvite ? (
              <div className="flex gap-1">
                <button type="button" onClick={() => acceptMutation.mutate()} disabled={acceptMutation.isPending}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-emerald/20 text-brand-emerald-light hover:bg-brand-emerald/30 transition-all">
                  Accept
                </button>
                <button type="button" onClick={() => rejectMutation.mutate()} disabled={rejectMutation.isPending}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                  Decline
                </button>
              </div>
            ) : (
              <button type="button"
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-emerald-light group-hover:translate-x-1 transition-transform">
                {joined ? "Enter Room" : "Join Now"} <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInvite && <InviteModal roomId={room.id} onClose={() => setShowInvite(false)} />}
      </AnimatePresence>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState<"joined" | "discover">("joined");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const { isAuthenticated, login } = useAuth();

  const { data: joinedRooms, isLoading: isLoadingJoined } = useQuery({
    queryKey: ["joinedRooms"],
    queryFn: () => fetchUserJoinedRooms(),
    enabled: isAuthenticated && activeTab === "joined",
  });

  const { data: discoverRooms, isLoading: isLoadingDiscover } = useQuery({
    queryKey: ["discoverRooms", searchQuery],
    queryFn: () => searchRooms({ query: searchQuery, limit: 12 }),
    enabled: activeTab === "discover",
  });

  if (!isAuthenticated && activeTab === "joined") {
    return (
      <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
        <Sidebar />
        <BottomNav />
        <main className="lg:ml-64 p-6 lg:p-10 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-24 h-24 rounded-3xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald-light mb-8">
            <Users className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black mb-4">Join the Conversation</h2>
          <p className="text-slate-400 text-center max-w-md mb-10 font-medium">
            Rooms are private or public groups where you can share reflections and study the Quran together.
          </p>
          <button type="button" onClick={login}
            className="px-8 py-4 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
            Sign in to access Rooms
          </button>
        </main>
      </div>
    );
  }

  const joined: any[] = joinedRooms?.data ?? joinedRooms?.rooms ?? [];
  const discover: any[] = discoverRooms?.data ?? discoverRooms?.rooms ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10 max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter">Rooms</h1>
            <p className="text-slate-400 font-medium uppercase text-[10px] tracking-[0.2em]">Community & Study Groups</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-emerald-light transition-colors" />
              <input
                type="text"
                placeholder="Search rooms…"
                aria-label="Search rooms"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setActiveTab("discover"); }}
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-brand-emerald-light/20 text-sm"
              />
            </div>
            <button type="button" onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-emerald/10 text-brand-emerald-light hover:bg-brand-emerald hover:text-white transition-all shadow-lg font-bold text-sm">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Group</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl w-fit mb-10 border border-white/5">
          <button type="button" onClick={() => setActiveTab("joined")}
            className={cn("px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
              activeTab === "joined" ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-white")}>
            My Rooms
          </button>
          <button type="button" onClick={() => setActiveTab("discover")}
            className={cn("px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
              activeTab === "discover" ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-white")}>
            Discover
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === "joined" ? (
            isLoadingJoined ? (
              [...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-4xl bg-white/5 animate-pulse border border-white/10" />)
            ) : joined.length > 0 ? (
              joined.map((room: any) => <RoomCard key={room.id} room={room} joined />)
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                <Users className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-slate-400">No rooms joined yet</h3>
                <p className="text-slate-600 max-w-sm mx-auto mt-2">Discover public study groups or create your own.</p>
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button type="button" onClick={() => setActiveTab("discover")}
                    className="text-brand-emerald-light font-black uppercase text-xs tracking-widest hover:underline">
                    Browse Directory
                  </button>
                  <span className="text-slate-700">·</span>
                  <button type="button" onClick={() => setShowCreate(true)}
                    className="text-brand-gold font-black uppercase text-xs tracking-widest hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Create Group
                  </button>
                </div>
              </div>
            )
          ) : (
            isLoadingDiscover ? (
              [...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-4xl bg-white/5 animate-pulse border border-white/10" />)
            ) : discover.length > 0 ? (
              discover.map((room: any) => <RoomCard key={room.id} room={room} />)
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500 italic">No rooms found matching your search.</p>
              </div>
            )
          )}
        </div>
      </main>

      <AnimatePresence>
        {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
