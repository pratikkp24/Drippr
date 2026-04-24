"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Notif = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  actionUrl: string | null;
  read: boolean;
  createdAt: string;
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

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  async function load() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setUnread(data.unread || 0);
      }
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    load();

    // Realtime — react to INSERTs on this user's notifications
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${userId}`
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true })
    });
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next && unread > 0) markAllRead();
        }}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-text-2 hover:text-primary hover:bg-bg transition-colors"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-surface" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] max-h-[420px] bg-bg border border-border rounded-lg shadow-lg overflow-hidden z-50 flex flex-col">
          <div className="px-md py-sm border-b border-border flex items-center justify-between">
            <p className="text-[12px] tracking-[2px] uppercase text-text-3">Notifications</p>
            {items.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-text-2 hover:text-primary"
              >
                Mark read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <p className="p-lg text-[13px] text-text-3 text-center italic">All quiet.</p>
            ) : (
              <ul>
                {items.map((n) => {
                  const content = (
                    <div
                      className={`px-md py-sm border-b border-border last:border-b-0 transition-colors ${
                        n.read ? "bg-bg" : "bg-surface/80"
                      } hover:bg-surface`}
                    >
                      <p className="text-[13px] font-medium text-text-1 leading-snug">{n.title}</p>
                      {n.body && (
                        <p className="text-[12px] font-light text-text-2 mt-0.5 line-clamp-2">{n.body}</p>
                      )}
                      <p className="text-[11px] font-light text-text-3 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  );
                  return (
                    <li key={n.id}>
                      {n.actionUrl ? (
                        <Link href={n.actionUrl} onClick={() => setOpen(false)}>
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
