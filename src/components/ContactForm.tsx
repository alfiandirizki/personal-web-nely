"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm({ locale }: { locale: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");

  const labels = locale === "id"
    ? { name: "Nama", email: "Email", message: "Pesan", send: "Kirim Pesan →", sending: "Mengirim...", success: "Pesan terkirim! 🎉", error: "Gagal mengirim. Coba lagi.", placeholder: "Tulis pesan kamu..." }
    : { name: "Name", email: "Email", message: "Message", send: "Send Message →", sending: "Sending...", success: "Message sent! 🎉", error: "Failed to send. Try again.", placeholder: "Write your message..." };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");

    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({ name, email, message });

    if (error) {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    } else {
      setState("success");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setState("idle"), 5000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{labels.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border-2 border-neo-border/40 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{labels.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border-2 border-neo-border/40 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{labels.message}</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder={labels.placeholder}
          className="w-full px-4 py-2.5 border-2 border-neo-border/40 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors resize-none"
        />
      </div>

      {state === "success" && (
        <div className="neo-card bg-neo-green/20 p-3 text-sm font-bold text-green-700">
          {labels.success}
        </div>
      )}
      {state === "error" && (
        <div className="neo-card bg-neo-red/20 p-3 text-sm font-bold text-red-700">
          {labels.error}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="neo-btn bg-neo-pink px-6 py-3 text-sm disabled:opacity-50 w-full sm:w-auto"
      >
        {state === "sending" ? labels.sending : labels.send}
      </button>
    </form>
  );
}
