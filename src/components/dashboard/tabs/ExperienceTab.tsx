"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/lib/supabase/types";

const typeConfig: Record<string, { color: string; label: string }> = {
  work: { color: "bg-neo-pink", label: "💼 Kerja" },
  internship: { color: "bg-neo-green", label: "🌿 Magang" },
  organizational: { color: "bg-neo-purple", label: "🎯 Organisasi" },
};

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("type")
      .order("sort_order");
    setExperiences(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin mau hapus experience ini?")) return;
    await supabase.from("experiences").delete().eq("id", id);
    setExperiences(experiences.filter((e) => e.id !== id));
    showMsg("🗑️ Dihapus!");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    if (editing.id === "new") {
      const { id: _, created_at: __, ...rest } = editing;
      const { error } = await supabase.from("experiences").insert(rest);
      if (error) { showMsg(`❌ ${error.message}`); setSaving(false); return; }
    } else {
      const { created_at: _, ...rest } = editing;
      const { error } = await supabase.from("experiences").update(rest).eq("id", editing.id);
      if (error) { showMsg(`❌ ${error.message}`); setSaving(false); return; }
    }

    setSaving(false);
    setEditing(null);
    fetchExperiences();
    showMsg("✅ Tersimpan!");
  }

  function showMsg(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function startNew() {
    setEditing({
      id: "new",
      title_en: "",
      title_id: "",
      company: "",
      period_en: "",
      period_id: "",
      description_en: [""],
      description_id: [""],
      highlights: [],
      type: "work",
      sort_order: experiences.length + 1,
      created_at: "",
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-neo-border/10 rounded-lg animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-neo-border/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Edit form
  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">
            {editing.id === "new" ? "➕ Tambah" : "✏️ Edit"} Experience
          </h1>
          <button
            onClick={() => setEditing(null)}
            className="neo-btn bg-surface px-4 py-2 text-sm"
          >
            ← Kembali
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Title & Company */}
          <div className="neo-card p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
              Informasi Posisi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Title (EN)" value={editing.title_en} onChange={(v) => setEditing({ ...editing, title_en: v })} required />
              <FormInput label="Title (ID)" value={editing.title_id} onChange={(v) => setEditing({ ...editing, title_id: v })} required />
            </div>
            <FormInput label="Company / Organization" value={editing.company} onChange={(v) => setEditing({ ...editing, company: v })} required />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput label="Period (EN)" value={editing.period_en} onChange={(v) => setEditing({ ...editing, period_en: v })} />
              <FormInput label="Period (ID)" value={editing.period_id} onChange={(v) => setEditing({ ...editing, period_id: v })} />
              <div>
                <label className="block text-xs font-bold text-neo-border/70 mb-1.5">Type</label>
                <select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as Experience["type"] })}
                  className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border"
                >
                  <option value="work">Work</option>
                  <option value="internship">Internship</option>
                  <option value="organizational">Organizational</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="neo-card p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
              Deskripsi (1 poin per baris)
            </h3>
            <div>
              <label className="block text-xs font-bold text-neo-border/70 mb-1.5">English</label>
              <textarea
                rows={5}
                value={editing.description_en.join("\n")}
                onChange={(e) => setEditing({ ...editing, description_en: e.target.value.split("\n") })}
                className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border resize-none"
                placeholder="One bullet point per line"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neo-border/70 mb-1.5">Indonesia</label>
              <textarea
                rows={5}
                value={editing.description_id.join("\n")}
                onChange={(e) => setEditing({ ...editing, description_id: e.target.value.split("\n") })}
                className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border resize-none"
                placeholder="Satu poin per baris"
              />
            </div>
          </div>

          {/* Highlights & Order */}
          <div className="neo-card p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
              Tags & Sorting
            </h3>
            <FormInput
              label="Highlights (comma separated)"
              value={editing.highlights.join(", ")}
              onChange={(v) => setEditing({ ...editing, highlights: v.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
            <div className="w-32">
              <FormInput
                label="Sort Order"
                value={String(editing.sort_order)}
                onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })}
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="neo-btn bg-neo-green px-8 py-3 text-sm disabled:opacity-50"
            >
              {saving ? "⏳ Menyimpan..." : "💾 Simpan"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">💼 Experience</h1>
        <button onClick={startNew} className="neo-btn bg-neo-green px-4 py-2 text-sm">
          + Tambah
        </button>
      </div>

      {message && (
        <div className="neo-btn bg-neo-green/30 px-4 py-2 text-sm inline-block">
          {message}
        </div>
      )}

      {/* Grouped by type */}
      {(["work", "internship", "organizational"] as const).map((type) => {
        const items = experiences.filter((e) => e.type === type);
        if (items.length === 0) return null;
        const config = typeConfig[type];

        return (
          <div key={type} className="space-y-3">
            <h3 className="text-sm font-black flex items-center gap-2">
              <span className={`${config.color} px-2 py-0.5 rounded-lg text-xs border-2 border-neo-border`}>
                {config.label}
              </span>
            </h3>
            {items.map((exp) => (
              <div
                key={exp.id}
                className="neo-card p-4 flex items-center gap-4"
              >
                <div className={`w-1.5 h-12 rounded-full shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate">{exp.title_en}</p>
                  <p className="text-xs text-neo-border/60">
                    {exp.company} · {exp.period_en}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(exp)}
                    className="neo-btn bg-neo-yellow px-3 py-1.5 text-xs"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="neo-btn bg-neo-red/30 px-3 py-1.5 text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors"
      />
    </div>
  );
}
