"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Send, Trash2 } from "lucide-react";

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  userId: string;
  user: { username: string; displayName: string; avatarUrl: string | null };
  replies: Comment[];
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CommentsSection({ slug, currentUserId }: { slug: string; currentUserId: string | null }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/drops/${slug}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function post() {
    if (!body.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/drops/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() })
      });
      if (res.ok) {
        setBody("");
        load();
      }
    } finally {
      setPosting(false);
    }
  }

  async function postReply(parentId: string) {
    if (!replyBody.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/drops/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim(), parentId })
      });
      if (res.ok) {
        setReplyBody("");
        setReplyTo(null);
        load();
      }
    } finally {
      setPosting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  const totalCount = comments.reduce((n, c) => n + 1 + c.replies.length, 0);

  return (
    <section className="max-w-[700px] mx-auto px-md sm:px-xl py-2xl border-t border-border">
      <h2 className="font-sans font-medium text-[11px] text-text-3 uppercase tracking-[2px] mb-lg">
        Comments · {totalCount}
      </h2>

      {currentUserId ? (
        <div className="flex gap-sm items-start mb-xl">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            maxLength={500}
            className="flex-1 rounded-md bg-surface border border-border p-sm text-[14px] text-text-1 focus:outline-none focus:border-primary resize-none"
          />
          <button
            onClick={post}
            disabled={posting || !body.trim()}
            className="h-10 w-10 rounded-md bg-primary text-bg flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50"
            aria-label="Post comment"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        <p className="text-[13px] font-light text-text-2 mb-xl">
          <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {loading ? (
        <div className="py-xl flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-text-3" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-[13px] font-light text-text-3 italic">Be the first to comment.</p>
      ) : (
        <ul className="space-y-lg">
          {comments.map((c) => (
            <li key={c.id} className="space-y-sm">
              <CommentItem comment={c} currentUserId={currentUserId} onDelete={remove} />

              {c.replies.length > 0 && (
                <ul className="ml-xl space-y-sm pl-md border-l border-border">
                  {c.replies.map((r) => (
                    <li key={r.id}>
                      <CommentItem comment={r} currentUserId={currentUserId} onDelete={remove} compact />
                    </li>
                  ))}
                </ul>
              )}

              {currentUserId && (
                <div className="ml-xl">
                  {replyTo === c.id ? (
                    <div className="flex gap-sm items-start">
                      <textarea
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder={`Reply to @${c.user.username}`}
                        rows={2}
                        maxLength={500}
                        autoFocus
                        className="flex-1 rounded-md bg-surface border border-border p-sm text-[13px] text-text-1 focus:outline-none focus:border-primary resize-none"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => postReply(c.id)}
                          disabled={posting || !replyBody.trim()}
                          className="h-9 w-9 rounded-md bg-primary text-bg flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50"
                          aria-label="Send reply"
                        >
                          {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setReplyBody("");
                          }}
                          className="h-9 w-9 rounded-md border border-border text-text-3 hover:text-primary text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyTo(c.id)}
                      className="text-[12px] text-text-3 hover:text-primary underline-offset-4 hover:underline"
                    >
                      Reply
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
  compact
}: {
  comment: Comment;
  currentUserId: string | null;
  onDelete: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex gap-sm ${compact ? "text-[13px]" : "text-[14px]"}`}>
      <div className={`relative ${compact ? "w-7 h-7" : "w-9 h-9"} rounded-full overflow-hidden bg-border shrink-0`}>
        <Image
          src={
            comment.user.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.displayName)}&bg=E6DDCF&color=1F3D2B`
          }
          alt={comment.user.displayName}
          fill
          sizes="36px"
          className="object-cover"

        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <Link
            href={`/profile/${comment.user.username}`}
            className="font-medium text-text-1 hover:text-primary transition-colors"
          >
            {comment.user.displayName}
          </Link>
          <span className="text-[11px] font-light text-text-3">@{comment.user.username}</span>
          <span className="text-[11px] font-light text-text-3">· {timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-text-1 whitespace-pre-wrap break-words mt-0.5">{comment.body}</p>
      </div>
      {currentUserId === comment.userId && (
        <button
          onClick={() => onDelete(comment.id)}
          className="text-text-3 hover:text-error transition-colors shrink-0"
          aria-label="Delete comment"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
