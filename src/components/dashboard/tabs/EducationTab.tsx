"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Education, Publication } from "@/lib/supabase/types";

export default function EducationTab() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [eduRes, pubRes] = await Promise.all([
      supabase.from("education").select("*").order("sort_order"),
      supabase.from("publications").select("*").order("year", { ascending: false }),
    ]);
    setEducations(eduRes.data || []);
    setPublications(pubRes.data || []);
    setLoading(false);
  }

  async function saveEducation(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEdu) return;
    setSaving(true);
    if (editingEdu.id === "new") {
      const { id: _, created_at: __, ...rest } = editingEdu;
      await supabase.from("education").insert(rest);
    } else {
      const { created_at: _, ...rest } = editingEdu;
      await supabase.from("education").update(rest).eq("id", editingEdu.id);
    }
    setSaving(false);
    setEditingEdu(null);
    fetchData();
    showMsg("✅ Tersimpan!");
  }

  async function savePublication(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPub) return;
    setSaving(true);
    if (editingPub.id === "new") {
      const { id: _, created_at: __, ...rest } = editingPub;
      await supabase.from("publications").insert(rest);
    } else {
      const { created_at: _, ...rest } = editingPub;
      await supabase.from("publications").update(rest).eq("id", editingPub.id);
    }
    setSaving(false);
    setEditingPub(null);
    fetchData();
    showMsg("✅ Tersimpan!");
  }

  async function deleteEdu(id: string) {
    if (!confirm("Hapus?")) return;
    await supabase.from("education").delete().eq("id", id);
    fetchData();
    showMsg("🗑️ Dihapus!");
  }

  async function deletePub(id: string) {
    if (!confirm("Hapus?")) return;
    await supabase.from("publications").delete().eq("id", id);
    fetchData();
    showMsg("🗑️ Dihapus!");
  }

  function showMsg(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-neo-border/10 rounded-lg animate-pulse" />
        <div className="h-24 bg-neo-border/5 rounded-2xl animate-pulse" />
        <div className="h-24 bg-neo-border/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Edit education form
  if (editingEdu) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">🎓 {editingEdu.id === "new" ? "Tambah" : "Edit"} Education</h1>
          <button onClick={() => setEditingEdu(null)} className="neo-btn bg-surface px-4 py-2 text-sm">← Kembali</button>
        </div>
        <form onSubmit={saveEducation} className="neo-card p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Degree (EN)" value={editingEdu.degree_en} onChange={(v) => setEditingEdu({ ...editingEdu, degree_en: v })} />
            <FormInput label="Degree (ID)" value={editingEdu.degree_id} onChange={(v) => setEditingEdu({ ...editingEdu, degree_id: v })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="School (EN)" value={editingEdu.school_en} onChange={(v) => setEditingEdu({ ...editingEdu, school_en: v })} />
            <FormInput label="School (ID)" value={editingEdu.school_id} onChange={(v) => setEditingEdu({ ...editingEdu, school_id: v })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Period (EN)" value={editingEdu.period_en} onChange={(v) => setEditingEdu({ ...editingEdu, period_en: v })} />
            <FormInput label="Period (ID)" value={editingEdu.period_id} onChange={(v) => setEditingEdu({ ...editingEdu, period_id: v })} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="neo-btn bg-neo-green px-8 py-3 text-sm disabled:opacity-50">
              {saving ? "⏳..." : "💾 Simpan"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Edit publication form
  if (editingPub) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">📄 {editingPub.id === "new" ? "Tambah" : "Edit"} Publication</h1>
          <button onClick={() => setEditingPub(null)} className="neo-btn bg-surface px-4 py-2 text-sm">← Kembali</button>
        </div>
        <form onSubmit={savePublication} className="neo-card p-5 sm:p-6 space-y-4">
          <FormInput label="Title" value={editingPub.title} onChange={(v) => setEditingPub({ ...editingPub, title: v })} />
          <FormInput label="Authors" value={editingPub.authors} onChange={(v) => setEditingPub({ ...editingPub, authors: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput label="Journal" value={editingPub.journal} onChange={(v) => setEditingPub({ ...editingPub, journal: v })} />
            <FormInput label="Year" value={String(editingPub.year)} onChange={(v) => setEditingPub({ ...editingPub, year: parseInt(v) || 2025 })} />
            <FormInput label="Period" value={editingPub.period_en} onChange={(v) => setEditingPub({ ...editingPub, period_en: v, period_id: v })} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="neo-btn bg-neo-green px-8 py-3 text-sm disabled:opacity-50">
              {saving ? "⏳..." : "💾 Simpan"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {message && <span className="neo-btn bg-neo-green/30 px-3 py-1 text-xs inline-block">{message}</span>}

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">🎓 Education</h1>
          <button onClick={() => setEditingEdu({ id: "new", degree_en: "", degree_id: "", school_en: "", school_id: "", period_en: "", period_id: "", description_en: "", description_id: "", sort_order: educations.length + 1, created_at: "" })} className="neo-btn bg-neo-green px-4 py-2 text-sm">+ Tambah</button>
        </div>
        {educations.map((edu) => (
          <div key={edu.id} className="neo-card p-4 flex items-center gap-4">
            <span className="text-2xl shrink-0">🎓</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate">{edu.degree_en}</p>
              <p className="text-xs text-neo-border/60">{edu.school_en} · {edu.period_en}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditingEdu(edu)} className="neo-btn bg-neo-yellow px-3 py-1.5 text-xs">✏️</button>
              <button onClick={() => deleteEdu(edu.id)} className="neo-btn bg-neo-red/30 px-3 py-1.5 text-xs">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Publications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">📄 Publications</h2>
          <button onClick={() => setEditingPub({ id: "new", title: "", authors: "", journal: "", year: 2025, period_en: "", period_id: "", created_at: "" })} className="neo-btn bg-neo-green px-4 py-2 text-sm">+ Tambah</button>
        </div>
        {publications.map((pub) => (
          <div key={pub.id} className="neo-card p-4 flex items-center gap-4">
            <span className="text-2xl shrink-0">📄</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate">{pub.title}</p>
              <p className="text-xs text-neo-border/60">{pub.journal} · {pub.year}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditingPub(pub)} className="neo-btn bg-neo-yellow px-3 py-1.5 text-xs">✏️</button>
              <button onClick={() => deletePub(pub.id)} className="neo-btn bg-neo-red/30 px-3 py-1.5 text-xs">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors" />
    </div>
  );
}
