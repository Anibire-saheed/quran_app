"use client";

import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import {
  User, Calendar, BookOpen, Clock, Heart, Award, Edit2, X, Check,
  Users, UserPlus, UserMinus, ChevronRight, AlertCircle,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile, updateUserProfile, fetchUserFollowers, fetchUserFollowing,
  fetchUserReflectPosts, removeFollower,
} from "@/services/quranService";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function EditProfileModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");

  const updateMutation = useMutation({
    mutationFn: () => updateUserProfile({ firstName, lastName, country, bio }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["userProfile"] }); onClose(); },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black">Edit Profile</h3>
          <button type="button" aria-label="Close" onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">First Name</label>
              <input aria-label="First Name" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Last Name</label>
              <input aria-label="Last Name" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">Country</label>
            <input aria-label="Country" placeholder="e.g. Nigeria" value={country} onChange={e => setCountry(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">Bio</label>
            <textarea aria-label="Bio" placeholder="Tell others about yourself…" value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="button" disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
            className="px-6 py-2.5 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-2">
            <Check className="w-4 h-4" />
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function UserListModal({ title, users, onClose, showRemove }: {
  title: string;
  users: any[];
  onClose: () => void;
  showRemove?: boolean;
}) {
  const queryClient = useQueryClient();
  const removeMutation = useMutation({
    mutationFn: (id: string | number) => removeFollower(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userFollowers"] }),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h3 className="font-black">{title}</h3>
          <button type="button" aria-label="Close" onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {users.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No users yet.</p>}
          {users.map((u: any) => (
            <div key={u.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full islamic-gradient flex items-center justify-center text-white text-sm font-bold shrink-0">
                {u.firstName?.[0] ?? u.name?.[0] ?? u.username?.[0] ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{u.firstName ?? u.name ?? u.username}</p>
                <p className="text-xs text-slate-500 truncate">@{u.username}</p>
              </div>
              {showRemove && (
                <button type="button" aria-label="Remove follower"
                  onClick={() => removeMutation.mutate(u.id)}
                  disabled={removeMutation.isPending}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors shrink-0">
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile({ qdc: true }),
    enabled: isAuthenticated,
  });

  const { data: followersData } = useQuery({
    queryKey: ["userFollowers"],
    queryFn: () => fetchUserFollowers(profileResponse?.data?.id ?? profileResponse?.id, { first: 50 }),
    enabled: isAuthenticated && !!(profileResponse?.data?.id ?? profileResponse?.id),
  });

  const { data: followingData } = useQuery({
    queryKey: ["userFollowing"],
    queryFn: () => fetchUserFollowing(profileResponse?.data?.id ?? profileResponse?.id, { first: 50 }),
    enabled: isAuthenticated && !!(profileResponse?.data?.id ?? profileResponse?.id),
  });

  const { data: postsData } = useQuery({
    queryKey: ["userReflectPosts"],
    queryFn: () => fetchUserReflectPosts(String(profileResponse?.data?.id ?? profileResponse?.id), { limit: 5 }),
    enabled: isAuthenticated && !!(profileResponse?.data?.id ?? profileResponse?.id),
  });

  const profile = profileResponse?.data ?? profileResponse;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-emerald-light border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-10 flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-8">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-3xl font-black mb-4">Your Profile</h2>
            <p className="text-slate-500 max-w-sm mb-10">Sign in to sync your progress, save favorites, and connect with the community.</p>
            <button onClick={() => window.location.href = '/login'} className="px-8 py-4 rounded-2xl islamic-gradient text-white font-black shadow-xl hover:scale-105 transition-all">
              Sign In Now
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-10 flex flex-col items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black mb-2">Profile Not Found</h2>
            <p className="text-slate-500 mb-8">We couldn't retrieve your profile data. Please try again.</p>
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ["userProfile"] })} className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const followers: any[] = followersData?.data ?? followersData?.edges?.map((e: any) => e.node) ?? [];
  const following: any[] = followingData?.data ?? followingData?.edges?.map((e: any) => e.node) ?? [];
  const recentPosts: any[] = postsData?.posts ?? postsData?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10 max-w-5xl">
        {/* Profile header */}
        <div className="glass-effect rounded-[40px] p-8 lg:p-12 border-white/5 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
              {profile?.avatarUrls?.medium ? (
                <img src={profile.avatarUrls.medium} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full islamic-gradient flex items-center justify-center text-5xl font-black text-white">
                  {profile?.firstName?.[0] ?? profile?.name?.[0] ?? "U"}
                </div>
              )}
            </div>
            <div className="flex-1 text-center lg:text-left min-w-0">
              <h2 className="text-4xl font-black mb-1 truncate">
                {profile?.firstName} {profile?.lastName}
              </h2>
              {profile?.bio && <p className="text-slate-400 text-sm mb-3 line-clamp-2">{profile.bio}</p>}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-slate-400 text-sm">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> @{profile?.username}</span>
                {profile?.joiningYear && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {profile.joiningYear}</span>}
                {profile?.country && <span className="flex items-center gap-1">📍 {profile.country}</span>}
              </div>
              {/* Followers/Following */}
              <div className="flex gap-5 mt-4 justify-center lg:justify-start">
                <button type="button" onClick={() => setShowFollowers(true)}
                  className="text-center hover:text-brand-emerald-light transition-colors">
                  <span className="font-black text-lg block">{profile?.followersCount ?? followers.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Followers</span>
                </button>
                <button type="button" onClick={() => setShowFollowing(true)}
                  className="text-center hover:text-brand-emerald-light transition-colors">
                  <span className="font-black text-lg block">{profile?.followingCount ?? following.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Following</span>
                </button>
              </div>
            </div>
            <button type="button" onClick={() => setShowEdit(true)}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 font-bold text-sm shrink-0">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Reflections", value: profile?.postsCount ?? recentPosts.length, icon: BookOpen, color: "text-blue-400" },
            { label: "Followers", value: profile?.followersCount ?? followers.length, icon: Users, color: "text-brand-gold" },
            { label: "Likes Received", value: profile?.likesCount ?? 0, icon: Heart, color: "text-red-400" },
            { label: "Language", value: (profile?.languageIsoCode ?? profile?.language ?? "en").toUpperCase(), icon: Clock, color: "text-emerald-400" },
          ].map(stat => (
            <div key={stat.label} className="glass-effect rounded-3xl p-6 border-white/5 flex flex-col items-center text-center">
              <stat.icon className={cn("w-6 h-6 mb-3", stat.color)} />
              <span className="text-2xl font-black">{stat.value}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Reflections */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" /> Recent Reflections
              </h3>
              <Link href="/reflect" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentPosts.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <p className="text-slate-500 text-sm">No reflections yet.</p>
                  <Link href="/reflect" className="text-xs text-brand-emerald-light mt-2 inline-block hover:underline">
                    Write your first reflection →
                  </Link>
                </div>
              ) : (
                recentPosts.map((post: any) => (
                  <div key={post.id} className="glass-effect rounded-2xl p-4 border-white/5">
                    <p className="text-sm text-slate-300 line-clamp-2 mb-2">{post.body}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likesCount ?? 0}</span>
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-gold" /> Achievements
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-3xl flex items-center justify-center border transition-all",
                  i < 3 ? "bg-brand-emerald/10 border-brand-emerald-light text-brand-emerald-light" : "bg-white/5 border-white/5 text-slate-600 grayscale"
                )}>
                  <Award className="w-8 h-8" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showEdit && <EditProfileModal profile={profile} onClose={() => setShowEdit(false)} />}
        {showFollowers && (
          <UserListModal title={`Followers (${followers.length})`} users={followers}
            onClose={() => setShowFollowers(false)} showRemove />
        )}
        {showFollowing && (
          <UserListModal title={`Following (${following.length})`} users={following}
            onClose={() => setShowFollowing(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
