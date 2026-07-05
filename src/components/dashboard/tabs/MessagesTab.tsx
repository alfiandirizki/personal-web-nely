"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function markAsRead(msg: Message) {
    if (!msg.read) {
      await supabase.from("messages").update({ read: true }).eq("id", msg.id);
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
    }
    setSelected(msg);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus pesan ini?")) return;
    await supabase.from("messages").delete().eq("id", id);
    setMessages(messages.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-neo-border/10 rounded-lg animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-neo-border/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (selected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">📨 Detail Pesan</h1>
          <button onClick={() => setSelected(null)} className="neo-btn bg-surface px-4 py-2 text-sm">
            ← Kembali
          </button>
        </div>

        <div className="neo-card p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-neo-border/60 uppercase">Nama</p>
              <p className="font-bold mt-1">{selected.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-neo-border/60 uppercase">Email</p>
              <a href={`mailto:${selected.email}`} className="font-bold mt-1 text-neo-border underline block">
                {selected.email}
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-neo-border/60 uppercase">Tanggal</p>
            <p className="text-sm mt-1 text-neo-border/70">
              {new Date(selected.created_at).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-neo-border/60 uppercase mb-2">Pesan</p>
            <div className="neo-card p-4 bg-neo-blue/10 text-sm leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`mailto:${selected.email}?subject=Re: Message from website`}
              className="neo-btn bg-neo-green px-5 py-2 text-sm"
            >
              ✉️ Balas
            </a>
            <a
              href={`https://wa.me/${selected.email.includes("@") ? "" : selected.email}`}
              target="_blank"
              className="neo-btn bg-neo-blue px-5 py-2 text-sm"
            >
              💬 WhatsApp
            </a>
            <button
              onClick={() => handleDelete(selected.id)}
              className="neo-btn bg-neo-red/30 px-5 py-2 text-sm"
            >
              🗑️ Hapus
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black">📨 Messages</h1>
          {unreadCount > 0 && (
            <span className="neo-btn bg-neo-pink px-3 py-1 text-xs">
              {unreadCount} baru
            </span>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="neo-card p-8 text-center bg-neo-border/5">
          <span className="text-4xl block mb-3">📭</span>
          <p className="font-bold text-neo-border/60">Belum ada pesan masuk</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => markAsRead(msg)}
              className={`neo-card p-4 w-full text-left flex items-center gap-4 ${
                !msg.read ? "bg-neo-yellow/10 border-neo-yellow/50" : ""
              }`}
            >
              {!msg.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-neo-pink shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm truncate ${!msg.read ? "font-black" : "font-bold"}`}>
                    {msg.name}
                  </p>
                  <span className="text-xs text-neo-border/40 shrink-0">
                    {new Date(msg.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <p className="text-xs text-neo-border/60 truncate mt-0.5">
                  {msg.message}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                className="neo-btn bg-neo-red/20 px-2 py-1 text-xs shrink-0"
              >
                🗑️
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
