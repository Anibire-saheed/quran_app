"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReflectFeed, fetchMyPosts, createPost, deletePost, editPost, togglePostLike,
  togglePostSave, fetchPostComments, createComment, toggleCommentLike, fetchTags,
} from "@/services/quranService";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import {
  Sparkles, Heart, Bookmark, MessageCircle, Share2, Plus, X, Trash2,
  Edit2, Tag, TrendingUp, Users, Globe, Send, ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const FEED_TABS = [
  { key: "trending", label: "Trending", icon: TrendingUp },
  { key: "newest", label: "Newest", icon: Sparkles },
  { key: "following", label: "Following", icon: Users },
];

function PostComments({ postId, onClose }: { postId: number; onClose: () => void }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: () => fetchPostComments(postId),
  });

  const createMutation = useMutation({
    mutationFn: (body: string) => createComment({ body, postId }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["post-comments", postId] }); setCommentText(""); },
  });

  const likeMutation = useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post-comments", postId] }),
  });

  const comments: any[] = data?.comments ?? data?.data ?? [];

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      className="border-t border-white/10 mt-4 pt-4 overflow-hidden">
      {isLoading ? (
        <div className="space-y-2">{[...Array(2)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.length === 0 && <p className="text-xs text-slate-600 text-center py-2">No comments yet.</p>}
          {comments.map((c: any) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full islamic-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                {c.author?.name?.[0] ?? "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold">{c.author?.name ?? "User"}</span>
                  <span className="text-[10px] text-slate-600">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</span>
                </div>
                <p className="text-sm text-slate-300">{c.body}</p>
                <button type="button"
                  onClick={() => likeMutation.mutate(c.id)}
                  className={cn("flex items-center gap-1 mt-1 text-[10px] transition-colors",
                    c.isLiked ? "text-red-400" : "text-slate-600 hover:text-red-400")}>
                  <Heart className="w-3 h-3" /> {c.likesCount ?? 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && commentText.trim()) { e.preventDefault(); createMutation.mutate(commentText); } }}
            placeholder="Write a comment…"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 placeholder:text-slate-600"
          />
          <button type="button" aria-label="Send comment"
            disabled={!commentText.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate(commentText)}
            className="p-2.5 rounded-xl bg-brand-emerald/20 text-brand-emerald-light hover:bg-brand-emerald/30 disabled:opacity-40 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

function PostCard({ post, onDelete }: { post: any; onDelete?: () => void }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(post.body ?? "");
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [saved, setSaved] = useState(post.isSaved ?? false);

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(post.id),
    onMutate: () => { setLiked((v: boolean) => !v); setLikesCount((n: number) => liked ? n - 1 : n + 1); },
  });

  const saveMutation = useMutation({
    mutationFn: () => togglePostSave(post.id),
    onMutate: () => setSaved((v: boolean) => !v),
  });

  const editMutation = useMutation({
    mutationFn: (body: string) => editPost(post.id, { body }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["reflect-feed"] }); queryClient.invalidateQueries({ queryKey: ["my-posts"] }); setIsEditing(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["reflect-feed"] }); queryClient.invalidateQueries({ queryKey: ["my-posts"] }); onDelete?.(); },
  });

  return (
    <motion.div layout className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group">
      {/* Author */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full islamic-gradient flex items-center justify-center text-white text-sm font-bold shrink-0">
            {post.author?.name?.[0] ?? post.author?.username?.[0] ?? "U"}
          </div>
          <div>
            <p className="text-sm font-bold">{post.author?.name ?? post.author?.username ?? "User"}</p>
            <p className="text-[10px] text-slate-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
            </p>
          </div>
        </div>
        {isAuthenticated && post.isOwn && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" aria-label="Edit post" onClick={() => { setIsEditing(true); setEditBody(post.body ?? ""); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button type="button" aria-label="Delete post" onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Verse reference */}
      {post.verseKey && (
        <p className="text-[10px] text-brand-emerald-light/70 bg-brand-emerald/5 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 mb-3">
          <span>📖</span> {post.verseKey}
        </p>
      )}

      {/* Body */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editBody}
            onChange={e => setEditBody(e.target.value)}
            rows={4}
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="button" disabled={!editBody.trim() || editMutation.isPending}
              onClick={() => editMutation.mutate(editBody)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold islamic-gradient text-white disabled:opacity-50 hover:scale-105 transition-all">
              {editMutation.isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</p>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag: any) => (
            <span key={tag.id ?? tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-slate-400 border border-white/10">
              #{tag.name ?? tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <button type="button"
          onClick={() => isAuthenticated && likeMutation.mutate()}
          className={cn("flex items-center gap-1.5 transition-colors hover:text-red-400",
            liked ? "text-red-400" : "")}>
          <Heart className={cn("w-4 h-4 transition-all", liked ? "fill-current scale-110" : "")} />
          {likesCount > 0 && likesCount}
        </button>
        <button type="button"
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 hover:text-white transition-colors">
          <MessageCircle className="w-4 h-4" />
          {post.commentsCount > 0 && post.commentsCount}
        </button>
        <button type="button"
          onClick={() => isAuthenticated && saveMutation.mutate()}
          className={cn("flex items-center gap-1.5 transition-colors hover:text-brand-gold",
            saved ? "text-brand-gold" : "")}>
          <Bookmark className={cn("w-4 h-4", saved ? "fill-current" : "")} />
        </button>
        <button type="button" aria-label="Share post" className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && <PostComments postId={post.id} onClose={() => setShowComments(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

function CreatePostForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { data: tagSuggestions } = useQuery({
    queryKey: ["tags", tagInput],
    queryFn: () => fetchTags({ q: tagInput }),
    enabled: tagInput.length >= 2,
  });

  const createMutation = useMutation({
    mutationFn: () => createPost({ body, privacy: isPrivate ? "private" : "public", tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reflect-feed"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      onClose();
    },
  });

  const addTag = (tag: string) => {
    const t = tag.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="mb-6 bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-300">New Reflection</h3>
        <button type="button" aria-label="Close create form" onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Share a reflection on a verse or topic…"
        rows={5}
        autoFocus
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 mb-4"
      />

      {/* Tags */}
      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald-light text-xs">
              #{tag}
              <button type="button" aria-label={`Remove tag ${tag}`} onClick={() => setTags(t => t.filter(x => x !== tag))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } }}
            placeholder="Add tags (press Enter)…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 placeholder:text-slate-600"
          />
          {tagSuggestions?.data?.length > 0 && tagInput.length >= 2 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-xl z-10 max-h-32 overflow-y-auto">
              {tagSuggestions.data.map((t: any) => (
                <button key={t.id} type="button" onClick={() => addTag(t.name)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 text-slate-300 transition-colors">
                  #{t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
          <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)}
            className="rounded accent-brand-emerald" />
          Private
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
          <button type="button" disabled={!body.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
            className="px-5 py-2 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all">
            {createMutation.isPending ? "Posting…" : "Post Reflection"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReflectPage() {
  const { isAuthenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["reflect-feed", activeTab],
    queryFn: () => fetchReflectFeed({ tab: activeTab as any, limit: 20 }),
  });

  const { data: myPostsData, isLoading: isMyPostsLoading } = useQuery({
    queryKey: ["my-posts"],
    queryFn: () => fetchMyPosts({ tab: "my_reflections", limit: 20 }),
    enabled: isAuthenticated && showMyPosts,
  });

  const posts: any[] = showMyPosts
    ? (myPostsData?.posts ?? myPostsData?.data ?? [])
    : (feedData?.posts ?? feedData?.data ?? []);
  const isLoading = showMyPosts ? isMyPostsLoading : isFeedLoading;

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 lg:pb-32">
      <Sidebar />
      <BottomNav />

      <main className="lg:ml-64 p-6 lg:p-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-brand-gold" />
              Reflect
            </h2>
            <p className="text-slate-400 mt-1">Community reflections on Quran verses.</p>
          </div>
          {isAuthenticated ? (
            <button type="button" onClick={() => { setShowCreate(true); setShowMyPosts(false); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl islamic-gradient text-white font-bold hover:scale-105 transition-all shadow-lg text-sm">
              <Plus className="w-4 h-4" /> New Reflection
            </button>
          ) : (
            <button onClick={login}
              className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
              Sign in
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {FEED_TABS.map(tab => (
              <button key={tab.key} type="button"
                onClick={() => { setActiveTab(tab.key); setShowMyPosts(false); }}
                className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                  !showMyPosts && activeTab === tab.key ? "bg-white text-black" : "text-slate-400 hover:text-white")}>
                <tab.icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            ))}
          </div>
          {isAuthenticated && (
            <button type="button"
              onClick={() => setShowMyPosts(v => !v)}
              className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                showMyPosts ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-slate-400 hover:text-white")}>
              My Reflections
            </button>
          )}
        </div>

        {/* Create post form */}
        <AnimatePresence>
          {showCreate && <CreatePostForm onClose={() => setShowCreate(false)} />}
        </AnimatePresence>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 font-medium mb-2">
              {showMyPosts ? "You haven't posted any reflections yet." : "No reflections found."}
            </p>
            {isAuthenticated && (
              <button type="button" onClick={() => { setShowCreate(true); setShowMyPosts(false); }}
                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold islamic-gradient text-white hover:scale-105 transition-all">
                Write the first one
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
